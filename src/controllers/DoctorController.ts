import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import { ErrorHandler } from "../middlewares/errorHandler";
import { sendResponse } from "../utils/sendResponse";
import { StatusCodes } from "../constants/statusCodes";
import {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  getDoctorByRegistration,
  getDoctorsByDepartment,
  updateDoctor,
  deleteDoctor,
} from "../services/doctorService";

const doctorSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  mobileNumber: z.string().min(10, "Mobile number must be at least 10 digits"),
  registrationNo: z.string().min(1, "Registration number is required"),
  qualification: z.string().min(1, "Qualification is required"),
  designation: z.string().min(1, "Designation is required"),
  department: z.string().min(1, "Department is required"),
  specialization: z.string().min(1, "Specialization is required"),
  status: z.string().optional().default("Active"),
});

export const createDoctorRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = doctorSchema.parse(req.body);

    // Check if registration number already exists
    const existingDoctor = await getDoctorByRegistration(validated.registrationNo);
    if (existingDoctor) {
      return next(
        new ErrorHandler(
          "Doctor with this registration number already exists",
          StatusCodes.CONFLICT
        )
      );
    }

    const doctor = await createDoctor(validated);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Doctor created successfully",
      data: doctor,
    });
  }
);

export const getAllDoctorRecords = catchAsyncError(
  async (req: Request, res: Response) => {
    const department = req.query.department as string | undefined;
    
    const doctors = department 
      ? await getDoctorsByDepartment(department)
      : await getAllDoctors();
      
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: department
        ? `Doctors in ${department} department fetched`
        : "All doctors fetched",
      data: doctors,
    });
  }
);

export const getDoctorRecordById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const doctor = await getDoctorById(id);
    if (!doctor) {
      return next(new ErrorHandler("Doctor not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Doctor details fetched",
      data: doctor,
    });
  }
);

export const updateDoctorRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const partialSchema = doctorSchema.partial();
    const validatedData = partialSchema.parse(req.body);

    // Check if updating registration number to an existing one
    if (validatedData.registrationNo) {
      const existingDoctor = await getDoctorByRegistration(validatedData.registrationNo);
      if (existingDoctor && existingDoctor.id !== id) {
        return next(
          new ErrorHandler(
            "Another doctor with this registration number already exists",
            StatusCodes.CONFLICT
          )
        );
      }
    }

    const updatedDoctor = await updateDoctor(id, validatedData);
    if (!updatedDoctor) {
      return next(new ErrorHandler("Doctor not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Doctor updated successfully",
      data: updatedDoctor,
    });
  }
);

export const deleteDoctorRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const deletedDoctor = await deleteDoctor(id);
    if (!deletedDoctor) {
      return next(new ErrorHandler("Doctor not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Doctor deleted successfully",
      data: deletedDoctor,
    });
  }
);