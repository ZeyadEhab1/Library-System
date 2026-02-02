class CheckoutService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async checkoutBook(borrowerId, isbn) {
    return this.prisma.$transaction(async (tx) => {
      const book = await tx.book.findUnique({
        where: { isbn }
      });

      if (!book) throw new Error("Book not found");

      if (book.available_quantity <= 0) {
        throw new Error("No copies available");
      }
      
      const existing = await tx.checkout.findFirst({
        where: {
          borrower_id: borrowerId,
          book_id: book.id,
          returned_at: null
        }
      });

      if (existing) {
        throw new Error("You already borrowed this book");
      }

      await tx.book.update({
        where: { id: book.id },
        data: {
          available_quantity: { decrement: 1 }
        }
      });

      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14); 

      const checkout = await tx.checkout.create({
        data: {
          borrower_id: borrowerId,
          book_id: book.id,
          due_date: dueDate,
          borrowed_at: new Date()
        }
      });

      return checkout;
    });
  }

  async returnBook(borrowerId, isbn) {
    return this.prisma.$transaction(async (tx) => {
      const book = await tx.book.findUnique({
        where: { isbn }
      });

      if (!book) throw new Error("Book not found");

      const checkout = await tx.checkout.findFirst({
        where: {
          book_id: book.id,
          borrower_id: borrowerId,
          returned_at: null
        }
      });

      if (!checkout) throw new Error("No active checkout found");

      await tx.checkout.update({
        where: { id: checkout.id },
        data: { returned_at: new Date(), status: 'RETURNED' }
      });

      await tx.book.update({
        where: { id: book.id },
        data: {
          available_quantity: { increment: 1 }
        }
      });
    });
  }

  async myBooks(borrowerId) {
    return this.prisma.checkout.findMany({
      where: {
        borrower_id: borrowerId,
        returned_at: null
      },
      include: {
        book: true
      }
    });
  }

  async overdueBooks() {
    return this.prisma.checkout.findMany({
      where: {
        returned_at: null,
        due_date: { lt: new Date() }
      },
      include: {
        borrower: true,
        book: true
      }
    });
  }

  async updateOverdueCheckouts() {
    const now = new Date();
    
    const result = await this.prisma.checkout.updateMany({
      where: {
        status: 'ACTIVE',
        due_date: { lt: now },
        returned_at: null
      },
      data: {
        status: 'OVERDUE'
      }
    });

    return {
      count: result.count,
      timestamp: now
    };
  }
}

export default CheckoutService;
