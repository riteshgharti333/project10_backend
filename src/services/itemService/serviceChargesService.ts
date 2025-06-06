import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createServiceCharge = async (data: {
  serviceName: string;
  category: string;
  chargeType: string;
  baseAmount: number;
  taxApplicable?: boolean;
  taxPercentage?: number;
  status?: string;
  notes?: string;
}) => {
  return prisma.serviceCharge.create({ data });
};

export const getAllServiceCharges = async () => {
  return prisma.serviceCharge.findMany({ 
    orderBy: { createdAt: "desc" } 
  });
};

export const getServiceChargeById = async (id: number) => {
  return prisma.serviceCharge.findUnique({ where: { id } });
};

export const getServiceChargesByCategory = async (category: string) => {
  return prisma.serviceCharge.findMany({ 
    where: { category },
    orderBy: { serviceName: "asc" }
  });
};

export const updateServiceCharge = async (
  id: number,
  data: {
    serviceName?: string;
    category?: string;
    chargeType?: string;
    baseAmount?: number;
    taxApplicable?: boolean;
    taxPercentage?: number;
    status?: string;
    notes?: string;
  }
) => {
  return prisma.serviceCharge.update({
    where: { id },
    data,
  });
};

export const deleteServiceCharge = async (id: number) => {
  return prisma.serviceCharge.delete({ where: { id } });
};