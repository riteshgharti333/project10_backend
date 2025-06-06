import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createBirth = async (data: any) => {
  return prisma.birth.create({ data });
};

export const getAllBirths = async () => {
  return prisma.birth.findMany({ orderBy: { createdAt: "desc" } });
};

export const getBirthById = async (id: number) => {
  return prisma.birth.findUnique({ where: { id } });
};

export const updateBirth = async (id: number, data: any) => {
  return prisma.birth.update({
    where: { id },
    data,
  });
};

export const deleteBirth = async (id: number) => {
  return prisma.birth.delete({ where: { id } });
};
