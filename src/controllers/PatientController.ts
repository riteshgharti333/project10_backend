import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import { ErrorHandler } from "../middlewares/errorHandler";
import { sendResponse } from "../utils/sendResponse";
import { StatusCodes } from "../constants/statusCodes";
import {
  createPatient,
  getAllPatients,
  getPatientById,
  getPatientByAadhaar,
  updatePatient,
  deletePatient,
} from "../services/patientService";

const patientSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  age: z.number().int().positive("Age must be positive"),
  mobileNumber: z.string().min(10, "Mobile number must be 10 digits"),
  gender: z.string().min(1, "Gender is required"),
  bedNumber: z.string().min(1, "Bed number is required"),
  aadhaarNumber: z.string().length(12, "Aadhaar must be 12 digits"),
  address: z.string().min(1, "Address is required"),
  medicalHistory: z.string().min(1, "Medical history is required"),
});

export const createPatientRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = patientSchema.parse(req.body);

    const patient = await createPatient(validated);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Patient record created successfully",
      data: patient,
    });
  }
);

export const getAllPatientRecords = catchAsyncError(async (_req, res) => {
  const patients = await getAllPatients();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "All patient records fetched",
    data: patients,
  });
});

export const getPatientRecordById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const patient = await getPatientById(id);
    if (!patient) {
      return next(new ErrorHandler("Patient not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Patient details fetched",
      data: patient,
    });
  }
);

export const updatePatientRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const partialSchema = patientSchema.partial();
    const validatedData = partialSchema.parse(req.body);

    // Check if updating Aadhaar to an existing one
    if (validatedData.aadhaarNumber) {
      const existingPatient = await getPatientByAadhaar(
        validatedData.aadhaarNumber
      );
      if (existingPatient && existingPatient.id !== id) {
        return next(
          new ErrorHandler(
            "Another patient with this Aadhaar already exists",
            StatusCodes.CONFLICT
          )
        );
      }
    }

    const updatedPatient = await updatePatient(id, validatedData);
    if (!updatedPatient) {
      return next(new ErrorHandler("Patient not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Patient updated successfully",
      data: updatedPatient,
    });
  }
);

export const deletePatientRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const deletedPatient = await deletePatient(id);
    if (!deletedPatient) {
      return next(new ErrorHandler("Patient not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Patient deleted successfully",
      data: deletedPatient,
    });
  }
);
