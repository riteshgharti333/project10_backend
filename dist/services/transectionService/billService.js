"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBill = exports.updateBill = exports.getBillsByPatient = exports.getBillById = exports.getAllBills = exports.createBill = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createBill = async (data) => {
    return prisma.bill.create({
        data: {
            ...data,
            billItems: {
                create: data.billItems
            }
        },
        include: { billItems: true }
    });
};
exports.createBill = createBill;
const getAllBills = async () => {
    return prisma.bill.findMany({
        orderBy: { createdAt: "desc" },
        include: { billItems: true }
    });
};
exports.getAllBills = getAllBills;
const getBillById = async (id) => {
    return prisma.bill.findUnique({
        where: { id },
        include: { billItems: true }
    });
};
exports.getBillById = getBillById;
const getBillsByPatient = async (mobile) => {
    return prisma.bill.findMany({
        where: { mobile },
        orderBy: { billDate: "desc" },
        include: { billItems: true }
    });
};
exports.getBillsByPatient = getBillsByPatient;
const updateBill = async (id, data) => {
    return prisma.bill.update({
        where: { id },
        data,
        include: { billItems: true }
    });
};
exports.updateBill = updateBill;
const deleteBill = async (id) => {
    return prisma.bill.delete({
        where: { id },
        include: { billItems: true }
    });
};
exports.deleteBill = deleteBill;
