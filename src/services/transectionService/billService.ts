import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface BillItemInput {
  company: string;
  itemOrService: string;
  quantity: number;
}

interface BillCreateInput {
  billDate: Date;
  billType: string;
  mobile: string;
  admissionNo: string;
  admissionDate: Date;
  dateOfBirth: Date;
  gender: string;
  dischargeDate?: Date;
  address: string;
  doctorName: string;
  wardNo: string;
  bedNo: string;
  status?: string;
  billItems: BillItemInput[];
}

export const createBill = async (data: BillCreateInput) => {
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

export const getAllBills = async () => {
  return prisma.bill.findMany({ 
    orderBy: { createdAt: "desc" },
    include: { billItems: true }
  });
};

export const getBillById = async (id: number) => {
  return prisma.bill.findUnique({ 
    where: { id },
    include: { billItems: true }
  });
};

export const getBillsByPatient = async (mobile: string) => {
  return prisma.bill.findMany({ 
    where: { mobile },
    orderBy: { billDate: "desc" },
    include: { billItems: true }
  });
};

export const updateBill = async (
  id: number,
  data: {
    billDate?: Date;
    billType?: string;
    mobile?: string;
    admissionNo?: string;
    admissionDate?: Date;
    dateOfBirth?: Date;
    gender?: string;
    dischargeDate?: Date | null;
    address?: string;
    doctorName?: string;
    wardNo?: string;
    bedNo?: string;
    status?: string;
    billItems?: {
      create?: BillItemInput[];
      update?: {
        where: { id: number };
        data: BillItemInput;
      }[];
      delete?: { id: number }[];
    };
  }
) => {
  return prisma.bill.update({
    where: { id },
    data,
    include: { billItems: true }
  });
};

export const deleteBill = async (id: number) => {
  return prisma.bill.delete({ 
    where: { id },
    include: { billItems: true }
  });
};