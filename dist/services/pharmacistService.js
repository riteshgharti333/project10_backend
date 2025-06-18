"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePharmacist = exports.updatePharmacist = exports.getPharmacistsByDepartment = exports.getPharmacistByRegistration = exports.getPharmacistById = exports.getAllPharmacists = exports.createPharmacist = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createPharmacist = async (data) => {
    return prisma.pharmacist.create({ data });
};
exports.createPharmacist = createPharmacist;
const getAllPharmacists = async () => {
    return prisma.pharmacist.findMany({
        orderBy: { createdAt: "desc" }
    });
};
exports.getAllPharmacists = getAllPharmacists;
const getPharmacistById = async (id) => {
    return prisma.pharmacist.findUnique({ where: { id } });
};
exports.getPharmacistById = getPharmacistById;
const getPharmacistByRegistration = async (registrationNo) => {
    return prisma.pharmacist.findUnique({ where: { registrationNo } });
};
exports.getPharmacistByRegistration = getPharmacistByRegistration;
const getPharmacistsByDepartment = async (department) => {
    return prisma.pharmacist.findMany({
        where: { department },
        orderBy: { fullName: "asc" }
    });
};
exports.getPharmacistsByDepartment = getPharmacistsByDepartment;
const updatePharmacist = async (id, data) => {
    return prisma.pharmacist.update({
        where: { id },
        data,
    });
};
exports.updatePharmacist = updatePharmacist;
const deletePharmacist = async (id) => {
    return prisma.pharmacist.delete({ where: { id } });
};
exports.deletePharmacist = deletePharmacist;
