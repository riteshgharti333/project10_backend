import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createBed = async (data: any) => {
  return prisma.bed.create({ data });
};

export const getAllBeds = async () => {
  return prisma.bed.findMany({ orderBy: { createdAt: "desc" } });
};

export const getBedById = async (id: number) => {
  return prisma.bed.findUnique({ where: { id } });
};

export const getBedByNumber = async (bedNumber: string) => {
  return prisma.bed.findUnique({ where: { bedNumber } });
};

export const getBedsByWard = async (wardNumber: string) => {
  return prisma.bed.findMany({ where: { wardNumber } });
};

export const updateBed = async (id: number, data: any) => {
  return prisma.bed.update({
    where: { id },
    data,
  });
};

export const deleteBed = async (id: number) => {
  return prisma.bed.delete({ where: { id } });
};