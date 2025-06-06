import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface MoneyReceiptCreateInput {
  date: Date;
  patientName: string;
  mobile: string;
  amount: number;
  paymentMode: string;
  remarks?: string;
  receivedBy: string;
  status?: string;
}

export const createMoneyReceipt = async (data: MoneyReceiptCreateInput) => {
  return prisma.moneyReceipt.create({ data });
};

export const getAllMoneyReceipts = async (searchParams: {
  mobile?: string;
  patientName?: string;
  amount?: number;
  paymentMode?: string;
}) => {
  const whereClause: any = {};
  
  if (searchParams.mobile) {
    whereClause.mobile = { contains: searchParams.mobile };
  }
  
  if (searchParams.patientName) {
    whereClause.patientName = { contains: searchParams.patientName, mode: 'insensitive' };
  }
  
  if (searchParams.amount) {
    whereClause.amount = searchParams.amount;
  }
  
  if (searchParams.paymentMode) {
    whereClause.paymentMode = searchParams.paymentMode;
  }

  return prisma.moneyReceipt.findMany({ 
    where: whereClause,
    orderBy: { date: "desc" } 
  });
};

export const getMoneyReceiptById = async (id: number) => {
  return prisma.moneyReceipt.findUnique({ where: { id } });
};

export const getMoneyReceiptsByDateRange = async (startDate: Date, endDate: Date) => {
  return prisma.moneyReceipt.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate
      }
    },
    orderBy: { date: "desc" }
  });
};

export const updateMoneyReceipt = async (
  id: number,
  data: {
    date?: Date;
    patientName?: string;
    mobile?: string;
    amount?: number;
    paymentMode?: string;
    remarks?: string;
    receivedBy?: string;
    status?: string;
  }
) => {
  return prisma.moneyReceipt.update({
    where: { id },
    data,
  });
};

export const deleteMoneyReceipt = async (id: number) => {
  return prisma.moneyReceipt.delete({ where: { id } });
};