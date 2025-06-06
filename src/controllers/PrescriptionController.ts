import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import { ErrorHandler } from "../middlewares/errorHandler";
import { sendResponse } from "../utils/sendResponse";
import { StatusCodes } from "../constants/statusCodes";
import {
  createPrescription,
  getAllPrescriptions,
  getPrescriptionById,
  getPrescriptionsByPatient,
  updatePrescription,
  deletePrescription,
} from "../services/prescriptionService";

const medicineSchema = z.object({
  medicineName: z.string().min(1, "Medicine name is required"),
  description: z.string().min(1, "Description is required"),
});

const prescriptionSchema = z.object({
  prescriptionDate: z.coerce.date(),
  doctorId: z.number().min(1, "Doctor ID is required"),
  patientId: z.number().min(1, "Patient ID is required"),
  prescriptionDoc: z.string().optional(),
  status: z.string().optional().default("Active"),
  medicines: z.array(medicineSchema).min(1, "At least one medicine is required"),
});

export const createPrescriptionRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = prescriptionSchema.parse({
      ...req.body,
      prescriptionDate: new Date(req.body.prescriptionDate)
    });

    const prescription = await createPrescription(validated);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Prescription created successfully",
      data: prescription,
    });
  }
);

export const getAllPrescriptionRecords = catchAsyncError(
  async (req: Request, res: Response) => {
    const patientId = req.query.patientId ? Number(req.query.patientId) : undefined;
    
    const prescriptions = patientId
      ? await getPrescriptionsByPatient(patientId)
      : await getAllPrescriptions();
      
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: patientId
        ? `Prescriptions for patient ${patientId} fetched`
        : "All prescriptions fetched",
      data: prescriptions,
    });
  }
);

export const getPrescriptionRecordById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const prescription = await getPrescriptionById(id);
    if (!prescription) {
      return next(new ErrorHandler("Prescription not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Prescription details fetched",
      data: prescription,
    });
  }
);

export const updatePrescriptionRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const partialSchema = prescriptionSchema.partial();
    const validatedData = partialSchema.parse({
      ...req.body,
      prescriptionDate: req.body.prescriptionDate ? new Date(req.body.prescriptionDate) : undefined
    });

    const updatedPrescription = await updatePrescription(id, validatedData);
    if (!updatedPrescription) {
      return next(new ErrorHandler("Prescription not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Prescription updated successfully",
      data: updatedPrescription,
    });
  }
);

export const deletePrescriptionRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const deletedPrescription = await deletePrescription(id);
    if (!deletedPrescription) {
      return next(new ErrorHandler("Prescription not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Prescription deleted successfully",
      data: deletedPrescription,
    });
  }
);