import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createBrand = async (data: {
  brandName: string;
  brandLogo: string;
  description: string;
  status?: string;
}) => {
  return prisma.brand.create({ data });
};

export const getAllBrands = async () => {
  return prisma.brand.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const getBrandById = async (id: number) => {
  return prisma.brand.findUnique({ where: { id } });
};

export const getBrandByName = async (brandName: string) => {
  return prisma.brand.findUnique({ where: { brandName } });
};

export const updateBrand = async (
  id: number,
  data: {
    brandName?: string;
    brandLogo?: string;
    description?: string;
    status?: string;
  }
) => {
  return prisma.brand.update({ where: { id }, data });
};

export const deleteBrand = async (id: number) => {
  return prisma.brand.delete({ where: { id } });
};
