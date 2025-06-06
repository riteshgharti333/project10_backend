import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { catchAsyncError } from "../../middlewares/catchAsyncError";
import { ErrorHandler } from "../../middlewares/errorHandler";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "../../constants/statusCodes";
import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  getEmployeesByDepartment,
  updateEmployee,
  deleteEmployee,
} from "../../services/transectionService/employeeService";

const employeeSchema = z.object({
  employeeName: z.string().min(1, "Employee name is required"),
  fathersName: z.string().min(1, "Father's name is required"),
  dateOfRegistration: z.string().transform((val) => new Date(val)),
  contactNo: z.string().min(10, "Contact number must be at least 10 digits"),
  dateOfBirth: z.string().transform((val) => new Date(val)),
  email: z.string().email().optional(),
  gender: z.enum(["Male", "Female", "Other"]),
  maritalStatus: z.enum(["Single", "Married", "Divorced", "Widowed"]),
  aadharNo: z.string().length(12, "Aadhar must be 12 digits").optional(),
  voterId: z.string().min(1, "Voter ID is required").optional(),
  bloodGroup: z
    .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
    .optional(),
  department: z.string().min(1, "Department is required"),
  photoUrl: z.string().optional(),
});

export const createEmployeeRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = employeeSchema.parse(req.body);
    const file = req.file;

    const employee = await createEmployee(validated, file);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Employee created successfully",
      data: employee,
    });
  }
);

export const getAllEmployeeRecords = catchAsyncError(
  async (req: Request, res: Response) => {
    const department = req.query.department as string | undefined;

    const employees = department
      ? await getEmployeesByDepartment(department)
      : await getAllEmployees();

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: department
        ? `Employees in ${department} department fetched`
        : "All employees fetched",
      data: employees,
    });
  }
);

export const getEmployeeRecordById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const employee = await getEmployeeById(id);
    if (!employee) {
      return next(
        new ErrorHandler("Employee not found", StatusCodes.NOT_FOUND)
      );
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Employee details fetched",
      data: employee,
    });
  }
);

export const updateEmployeeRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const partialSchema = employeeSchema.partial();
    const validatedData = partialSchema.parse(req.body);
    const file = req.file;

    // Check for unique fields if they're being updated
    if (validatedData.email) {
      const existing = await prisma.employee.findFirst({
        where: { email: validatedData.email, NOT: { id } },
      });
      if (existing) {
        return next(
          new ErrorHandler("Email already in use", StatusCodes.CONFLICT)
        );
      }
    }

    const updatedEmployee = await updateEmployee(id, validatedData, file);
    if (!updatedEmployee) {
      return next(
        new ErrorHandler("Employee not found", StatusCodes.NOT_FOUND)
      );
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Employee updated successfully",
      data: updatedEmployee,
    });
  }
);

export const deleteEmployeeRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const deletedEmployee = await deleteEmployee(id);
    if (!deletedEmployee) {
      return next(
        new ErrorHandler("Employee not found", StatusCodes.NOT_FOUND)
      );
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Employee deleted successfully",
      data: deletedEmployee,
    });
  }
);
