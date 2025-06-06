import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createNurse = async (data: {
  fullName: string;
  mobileNumber: string;
  registrationNo: string;
  department: string;
  address: string;
  shift: string;
  status?: string;
}) => {
  return prisma.nurse.create({ data });
};

export const getAllNurses = async () => {
  return prisma.nurse.findMany({ orderBy: { createdAt: "desc" } });
};

export const getNurseById = async (id: number) => {
  return prisma.nurse.findUnique({ where: { id } });
};

export const getNurseByRegistration = async (registrationNo: string) => {
  return prisma.nurse.findUnique({ where: { registrationNo } });
};

export const updateNurse = async (
  id: number,
  data: {
    fullName?: string;
    mobileNumber?: string;
    registrationNo?: string;
    department?: string;
    address?: string;
    shift?: string;
    status?: string;
  }
) => {
  return prisma.nurse.update({
    where: { id },
    data,
  });
};

export const deleteNurse = async (id: number) => {
  return prisma.nurse.delete({ where: { id } });
};