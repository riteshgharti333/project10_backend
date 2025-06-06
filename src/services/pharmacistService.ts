import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createPharmacist = async (data: {
  fullName: string;
  mobileNumber: string;
  registrationNo: string;
  address: string;
  department: string;
  status?: string;
}) => {
  return prisma.pharmacist.create({ data });
};

export const getAllPharmacists = async () => {
  return prisma.pharmacist.findMany({ 
    orderBy: { createdAt: "desc" } 
  });
};

export const getPharmacistById = async (id: number) => {
  return prisma.pharmacist.findUnique({ where: { id } });
};

export const getPharmacistByRegistration = async (registrationNo: string) => {
  return prisma.pharmacist.findUnique({ where: { registrationNo } });
};

export const getPharmacistsByDepartment = async (department: string) => {
  return prisma.pharmacist.findMany({ 
    where: { department },
    orderBy: { fullName: "asc" }
  });
};

export const updatePharmacist = async (
  id: number,
  data: {
    fullName?: string;
    mobileNumber?: string;
    registrationNo?: string;
    address?: string;
    department?: string;
    status?: string;
  }
) => {
  return prisma.pharmacist.update({
    where: { id },
    data,
  });
};

export const deletePharmacist = async (id: number) => {
  return prisma.pharmacist.delete({ where: { id } });
};