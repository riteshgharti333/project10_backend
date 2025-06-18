"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProductsByCategory = exports.getProductById = exports.getAllProducts = exports.createProduct = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Create Product with nested specifications
const createProduct = async (data) => {
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
exports.createProduct = createProduct;
// Get all products
const getAllProducts = async () => {
    return prisma.productEntery.findMany({
        orderBy: { createdAt: "desc" },
        include: { specifications: true }
    });
};
exports.getAllProducts = getAllProducts;
// Get product by ID
const getProductById = async (id) => {
    return prisma.productEntery.findUnique({
        where: { id },
        include: { specifications: true }
    });
};
exports.getProductById = getProductById;
// Get products by category
const getProductsByCategory = async (category) => {
    return prisma.productEntery.findMany({
        where: { category },
        orderBy: { productName: "asc" },
        include: { specifications: true }
    });
};
exports.getProductsByCategory = getProductsByCategory;
// Update product
const updateProduct = async (id, data) => {
    return prisma.productEntery.update({
        where: { id },
        data: {
            ...data,
            specifications: data.specifications
        },
        include: { specifications: true }
    });
};
exports.updateProduct = updateProduct;
// Delete product
const deleteProduct = async (id) => {
    return prisma.productEntery.delete({
        where: { id },
        include: { specifications: true }
    });
};
exports.deleteProduct = deleteProduct;
