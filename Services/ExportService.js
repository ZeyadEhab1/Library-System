class ExportService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async getBorrowingProcessesByPeriod(startDate, endDate) {
    return this.prisma.checkout.findMany({
      where: {
        borrowed_at: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            isbn: true
          }
        },
        borrower: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      },
      orderBy: {
        borrowed_at: 'desc'
      }
    });
  }

  async getOverdueBorrowsLastMonth() {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    return this.prisma.checkout.findMany({
      where: {
        returned_at: null,
        due_date: {
          gte: lastMonth,
          lte: endOfLastMonth,
          lt: now
        }
      },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            isbn: true
          }
        },
        borrower: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      },
      orderBy: {
        due_date: 'asc'
      }
    });
  }

  async getAllBorrowingProcessesLastMonth() {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    return this.prisma.checkout.findMany({
      where: {
        borrowed_at: {
          gte: lastMonth,
          lte: endOfLastMonth
        }
      },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            isbn: true
          }
        },
        borrower: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      },
      orderBy: {
        borrowed_at: 'desc'
      }
    });
  }

  async getAnalyticalReport(startDate, endDate) {
    const checkouts = await this.getBorrowingProcessesByPeriod(startDate, endDate);
    
    const totalBorrows = checkouts.length;
    const activeBorrows = checkouts.filter(c => c.status === 'ACTIVE' && !c.returned_at).length;
    const returnedBorrows = checkouts.filter(c => c.returned_at !== null).length;
    const overdueBorrows = checkouts.filter(c => 
      c.status === 'OVERDUE' || (!c.returned_at && new Date(c.due_date) < new Date())
    ).length;

    const bookStats = {};
    checkouts.forEach(checkout => {
      const bookId = checkout.book.id;
      if (!bookStats[bookId]) {
        bookStats[bookId] = {
          book: checkout.book,
          borrowCount: 0
        };
      }
      bookStats[bookId].borrowCount++;
    });

    const borrowerStats = {};
    checkouts.forEach(checkout => {
      const borrowerId = checkout.borrower.id;
      if (!borrowerStats[borrowerId]) {
        borrowerStats[borrowerId] = {
          borrower: checkout.borrower,
          borrowCount: 0
        };
      }
      borrowerStats[borrowerId].borrowCount++;
    });

    return {
      period: {
        startDate,
        endDate
      },
      summary: {
        totalBorrows,
        activeBorrows,
        returnedBorrows,
        overdueBorrows
      },
      bookStats: Object.values(bookStats),
      borrowerStats: Object.values(borrowerStats),
      checkouts
    };
  }
}

export default ExportService;
