class BookService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async createBook(data) {
    return this.prisma.book.create({ data });
  }

  async getAllBooks(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const [books, total] = await Promise.all([
      this.prisma.book.findMany({
        skip,
        take: limit,
        orderBy: {
          created_at: 'desc'
        }
      }),
      this.prisma.book.count()
    ]);

    return {
      data: books,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1
      }
    };
  }

  async getBookById(id) {
    return this.prisma.book.findUnique({ where: { id } });
  }

  async updateBook(id, data) {
    return this.prisma.book.update({
      where: { id },
      data,
    });
  }

  async deleteBook(id) {
    return this.prisma.book.delete({ where: { id } });
  }
}

export default BookService;
