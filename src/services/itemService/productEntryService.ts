import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface MaterialSpecificationInput {
  uom: string;
  description?: string;
  alterUnit?: string;
  alterUnitValue?: number;
  serialUniqueNo?: string;
}

interface ProductCreateInput {
  brand: string;
  category: string;
  productName: string;
  shortDescription?: string;
  hsnCode: string;
  gstPercentage: number;
  status?: string;
  specifications?: MaterialSpecificationInput[];
}

// Create Product with nested specifications
export const createProduct = async (data: ProductCreateInput) => {
  return prisma.productEntery.create({
    data: {
      brand: data.brand,
      category: data.category,
      productName: data.productName,
      shortDescription: data.shortDescription,
      hsnCode: data.hsnCode,
      gstPercentage: data.gstPercentage,
      status: data.status,
      specifications: data.specifications
        ? { create: data.specifications }
        : undefined
    },
    include: { specifications: true }
  });
};

// Get all products
export const getAllProducts = async () => {
  return prisma.productEntery.findMany({
    orderBy: { createdAt: "desc" },
    include: { specifications: true }
  });
};

// Get product by ID
export const getProductById = async (id: number) => {
  return prisma.productEntery.findUnique({
    where: { id },
    include: { specifications: true }
  });
};

// Get products by category
export const getProductsByCategory = async (category: string) => {
  return prisma.productEntery.findMany({
    where: { category },
    orderBy: { productName: "asc" },
    include: { specifications: true }
  });
};

// Update product
export const updateProduct = async (
  id: number,
  data: {
    brand?: string;
    category?: string;
    productName?: string;
    shortDescription?: string;
    hsnCode?: string;
    gstPercentage?: number;
    status?: string;
    specifications?: {
      create?: MaterialSpecificationInput[];
      update?: {
        where: { id: number };
        data: MaterialSpecificationInput;
      }[];
      delete?: { id: number }[];
    };
  }
) => {
  return prisma.productEntery.update({
    where: { id },
    data: {
      ...data,
      specifications: data.specifications
    },
    include: { specifications: true }
  });
};

// Delete product
export const deleteProduct = async (id: number) => {
  return prisma.productEntery.delete({
    where: { id },
    include: { specifications: true }
  });
};
