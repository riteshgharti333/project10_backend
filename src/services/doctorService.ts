import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createDoctor = async (data: {
  fullName: string;
  mobileNumber: string;
  registrationNo: string;
  qualification: string;
  designation: string;
  department: string;
  specialization: string;
  status?: string;
}) => {
  return prisma.doctor.create({ data });
};

export const getAllDoctors = async () => {
  return prisma.doctor.findMany({ 
    orderBy: { createdAt: "desc" } 
  });
};

export const getDoctorById = async (id: number) => {
  return prisma.doctor.findUnique({ where: { id } });
};

export const getDoctorByRegistration = async (registrationNo: string) => {
  return prisma.doctor.findUnique({ where: { registrationNo } });
};

export const getDoctorsByDepartment = async (department: string) => {
  return prisma.doctor.findMany({ 
    where: { department },
    orderBy: { fullName: "asc" }
  });
};

export const updateDoctor = async (
  id: number,
  data: {
    fullName?: string;
    mobileNumber?: string;
    registrationNo?: string;
    qualification?: string;
    designation?: string;
    department?: string;
    specialization?: string;
    status?: string;
  }
) => {
  return prisma.doctor.update({
    where: { id },
    data,
  });
};

export const deleteDoctor = async (id: number) => {
  return prisma.doctor.delete({ where: { id } });
};