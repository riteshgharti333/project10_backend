"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBrand = exports.updateBrand = exports.getBrandByName = exports.getBrandById = exports.getAllBrands = exports.createBrand = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createBrand = async (data) => {
    return prisma.brand.create({ data });
};
exports.createBrand = createBrand;
const getAllBrands = async () => {
    return prisma.brand.findMany({
        orderBy: { createdAt: "desc" },
    });
};
exports.getAllBrands = getAllBrands;
const getBrandById = async (id) => {
    return prisma.brand.findUnique({ where: { id } });
};
exports.getBrandById = getBrandById;
const getBrandByName = async (brandName) => {
    return prisma.brand.findUnique({ where: { brandName } });
};
exports.getBrandByName = getBrandByName;
const updateBrand = async (id, data) => {
    return prisma.brand.update({ where: { id }, data });
};
exports.updateBrand = updateBrand;
const deleteBrand = async (id) => {
    return prisma.brand.delete({ where: { id } });
};
exports.deleteBrand = deleteBrand;
