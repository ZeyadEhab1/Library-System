import { PrismaClient } from "@prisma/client";

// Singleton pattern for Prisma client
let prismaInstance = null;

export const getPrismaClient = () => {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient();
  }
  return prismaInstance;
};

export default getPrismaClient;
