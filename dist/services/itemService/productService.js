"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProductsByCategory = exports.getProductByCode = exports.getProductById = exports.getAllProducts = exports.createProduct = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createProduct = async (data) => {
    return prisma.product.create({ data });
};
exports.createProduct = createProduct;
const getAllProducts = async () => {
    return prisma.product.findMany({
        orderBy: { createdAt: "desc" }
    });
};
exports.getAllProducts = getAllProducts;
const getProductById = async (id) => {
    return prisma.product.findUnique({ where: { id } });
};
exports.getProductById = getProductById;
const getProductByCode = async (productCode) => {
    return prisma.product.findUnique({ where: { productCode } });
};
exports.getProductByCode = getProductByCode;
const getProductsByCategory = async (parentCategory, subCategory) => {
    return prisma.product.findMany({
        where: {
            parentCategory,
            ...(subCategory && { subCategory })
        },
        orderBy: { productName: "asc" }
    });
};
exports.getProductsByCategory = getProductsByCategory;
const updateProduct = async (id, data) => {
    return prisma.product.update({
        where: { id },
        data,
    });
};
exports.updateProduct = updateProduct;
const deleteProduct = async (id) => {
    return prisma.product.delete({ where: { id } });
};
exports.deleteProduct = deleteProduct;
