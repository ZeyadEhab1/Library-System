import bcrypt from "bcryptjs";

class BorrowerService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async createBorrower(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    return this.prisma.borrower.create({
      data: {
        ...data,
        password: hashedPassword
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        created_at: true,
      }
    });
  }

  async getBorrowerByEmail(email) {
    return this.prisma.borrower.findUnique({
      where: { email }
    });
  }

  async getBorrowerById(id) {
    return this.prisma.borrower.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        created_at: true,
      }
    });
  }

  async updateBorrower(id, data) {
    const updateData = { ...data };

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    return this.prisma.borrower.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        created_at: true,
      },
    });
  }

  async deleteBorrower(id) {
    return this.prisma.borrower.delete({ where: { id } });
  }

  async getAllBorrowers() {
    return this.prisma.borrower.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        created_at: true,
      },
    });
  }
}

export default BorrowerService;
