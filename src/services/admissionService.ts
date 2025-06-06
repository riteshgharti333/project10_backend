import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createAdmission = async (data: any) => {
  return prisma.admission.create({ data });
};

export const getAllAdmissions = async () => {
  return prisma.admission.findMany({ orderBy: { createdAt: 'desc' } });
};

export const getAdmissionById = async (id: number) => {
  return prisma.admission.findUnique({ where: { id } });
};

export const updateAdmission = async (id: number, data: any) => {
  return prisma.admission.update({
    where: { id },
    data,
  });
};

export const deleteAdmission = async (id: number) => {
  return prisma.admission.delete({ where: { id } });
};
