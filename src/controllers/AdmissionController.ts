import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import { ErrorHandler } from "../middlewares/errorHandler";
import { sendResponse } from "../utils/sendResponse";
import { StatusCodes } from "../constants/statusCodes";

const prisma = new PrismaClient();

const admissionSchema = z.object({
  admissionDate: z.coerce.date(),
  admissionTime: z.string().min(1, "Admission time is required"),
 dischargeDate: z.preprocess(
  (val) => (val === "" ? undefined : val),
  z.coerce.date().optional()
),

  gsRsRegNo: z.string().min(1, "GS/RS Reg No is required"),
  wardNo: z.string().min(1, "Ward No is required"),
  bedNo: z.string().min(1, "Bed No is required"),
  bloodGroup: z.string().min(1, "Blood group is required"),
  aadhaarNo: z.string().min(12, "Aadhaar No must be 12 digits").max(12),
  urnNo: z.string().optional(),
  patientName: z.string().min(1, "Patient name is required"),
  patientAge: z.number().int().positive("Age must be positive"),
  patientSex: z.string().min(1, "Patient sex is required"),
  guardianType: z.string().min(1, "Guardian type is required"),
  guardianName: z.string().min(1, "Guardian name is required"),
  phoneNo: z.string().min(10, "Phone number must be at least 10 digits"),
  patientAddress: z.string().min(1, "Address is required"),
  bodyWeightKg: z.number().optional(),
  bodyHeightCm: z.number().optional(),
  literacy: z.string().min(1, "Literacy status is required"),
  occupation: z.string().min(1, "Occupation is required"),
  doctorName: z.string().min(1, "Doctor name is required"),
  isDelivery: z.boolean().default(false),
});

// CREATE
export const createAdmission = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = admissionSchema.parse(req.body);
    const admission = await prisma.admission.create({ data: validated });

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Admission created successfully",
      data: admission,
    });
  }
);

// GET ALL
export const getAllAdmissions = catchAsyncError(async (_req, res) => {
  const admissions = await prisma.admission.findMany({ 
    orderBy: { createdAt: 'desc' } 
  });

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "All admissions fetched",
    data: admissions,
  });
});

// GET SINGLE BY ID
export const getAdmissionById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id))
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));

    const admission = await prisma.admission.findUnique({ where: { id } });
    if (!admission)
      return next(new ErrorHandler("Admission not found", StatusCodes.NOT_FOUND));

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Admission details fetched",
      data: admission,
    });
  }
);

// UPDATE
export const updateAdmission = catchAsyncError(

  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id))
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));

    // Allow partial update
    const partialSchema = admissionSchema.partial();
    const validatedData = partialSchema.parse(req.body);

    const updatedAdmission = await prisma.admission.update({
      where: { id },
      data: validatedData,
    });

    if (!updatedAdmission)
      return next(new ErrorHandler("Admission not found", StatusCodes.NOT_FOUND));

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Admission updated successfully",
      data: updatedAdmission,
    });
  }
);

// DELETE
export const deleteAdmission = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id))
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));

    const deletedAdmission = await prisma.admission.delete({ where: { id } });
    if (!deletedAdmission)
      return next(new ErrorHandler("Admission not found", StatusCodes.NOT_FOUND));

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Admission deleted successfully",
      data: deletedAdmission,
    });
  }
);