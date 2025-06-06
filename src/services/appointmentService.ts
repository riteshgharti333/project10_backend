import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createAppointment = async (data: {
  appointmentDate: Date;
  doctorName: string;
  department: string;
  appointmentTime: string;
}) => {
  return prisma.appointment.create({ data });
};

export const getAllAppointments = async () => {
  return prisma.appointment.findMany({
    orderBy: { appointmentDate: 'asc' }
  });
};

export const getAppointmentById = async (id: number) => {
  return prisma.appointment.findUnique({ where: { id } });
};

export const updateAppointment = async (
  id: number, 
  data: {
    appointmentDate?: Date;
    doctorName?: string;
    department?: string;
    appointmentTime?: string;
  }
) => {
  return prisma.appointment.update({
    where: { id },
    data,
  });
};

export const deleteAppointment = async (id: number) => {
  return prisma.appointment.delete({ where: { id } });
};