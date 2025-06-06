import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createProduct = async (data: {
  productName: string;
  productCode: string;
  parentCategory: string;
  subCategory: string;
  categoryLogo?: string;
  description?: string;
  unit: string;
  price: number;
  taxRate: number;
  status?: string;
}) => {
  return prisma.product.create({ data });
};

export const getAllProducts = async () => {
  return prisma.product.findMany({ 
    orderBy: { createdAt: "desc" } 
  });
};

export const getProductById = async (id: number) => {
  return prisma.product.findUnique({ where: { id } });
};

export const getProductByCode = async (productCode: string) => {
  return prisma.product.findUnique({ where: { productCode } });
};

export const getProductsByCategory = async (parentCategory: string, subCategory?: string) => {
  return prisma.product.findMany({ 
    where: { 
      parentCategory,
      ...(subCategory && { subCategory }) 
    },
    orderBy: { productName: "asc" }
  });
};

export const updateProduct = async (
  id: number,
  data: {
    productName?: string;
    productCode?: string;
    parentCategory?: string;
    subCategory?: string;
    categoryLogo?: string;
    description?: string;
    unit?: string;
    price?: number;
    taxRate?: number;
    status?: string;
  }
) => {
  return prisma.product.update({
    where: { id },
    data,
  });
};

export const deleteProduct = async (id: number) => {
  return prisma.product.delete({ where: { id } });
};