import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createPatient = async (data: any) => {
  return prisma.patient.create({ data });
};

export const getAllPatients = async () => {
  return prisma.patient.findMany({ orderBy: { createdAt: 'desc' } });
};

export const getPatientById = async (id: number) => {
  return prisma.patient.findUnique({ where: { id } });
};

export const getPatientByAadhaar = async (aadhaarNumber: string) => {
  return prisma.patient.findUnique({ where: { aadhaarNumber } });
};

export const updatePatient = async (id: number, data: any) => {
  return prisma.patient.update({
    where: { id },
    data,
  });
};

export const deletePatient = async (id: number) => {
  return prisma.patient.delete({ where: { id } });
};