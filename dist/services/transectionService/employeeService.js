"use strict";
// import { PrismaClient } from "@prisma/client";
// import { uploadFileToStorage } from "../utils/fileUpload"; 
// const prisma = new PrismaClient();
// interface EmployeeCreateInput {
//   photoUrl?: string;
//   employeeName: string;
//   fathersName: string;
//   dateOfRegistration: Date;
//   contactNo: string;
//   dateOfBirth: Date;
//   email?: string;
//   gender: string;
//   maritalStatus: string;
//   aadharNo?: string;
//   voterId?: string;
//   bloodGroup?: string;
//   department: string;
// }
// export const createEmployee = async (data: EmployeeCreateInput, file?: Express.Multer.File) => {
//   let photoUrl = data.photoUrl;
//   if (file) {
//     photoUrl = await uploadFileToStorage(file, 'employee-photos');
//   }
//   return prisma.employee.create({
//     data: {
//       ...data,
//       photoUrl
//     }
//   });
// };
// export const getAllEmployees = async () => {
//   return prisma.employee.findMany({ 
//     orderBy: { createdAt: "desc" } 
//   });
// };
// export const getEmployeeById = async (id: number) => {
//   return prisma.employee.findUnique({ where: { id } });
// };
// export const getEmployeesByDepartment = async (department: string) => {
//   return prisma.employee.findMany({ 
//     where: { department },
//     orderBy: { employeeName: "asc" }
//   });
// };
// export const updateEmployee = async (
//   id: number,
//   data: {
//     photoUrl?: string;
//     employeeName?: string;
//     fathersName?: string;
//     dateOfRegistration?: Date;
//     contactNo?: string;
//     dateOfBirth?: Date;
//     email?: string | null;
//     gender?: string;
//     maritalStatus?: string;
//     aadharNo?: string | null;
//     voterId?: string | null;
//     bloodGroup?: string | null;
//     department?: string;
//   },
//   file?: Express.Multer.File
// ) => {
//   let updateData = { ...data };
//   if (file) {
//     updateData.photoUrl = await uploadFileToStorage(file, 'employee-photos');
//   }
//   return prisma.employee.update({
//     where: { id },
//     data: updateData
//   });
// };
// export const deleteEmployee = async (id: number) => {
//   return prisma.employee.delete({ where: { id } });
// };
