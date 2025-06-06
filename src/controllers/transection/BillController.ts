import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { catchAsyncError } from "../../middlewares/catchAsyncError";
import { ErrorHandler } from "../../middlewares/errorHandler";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "../../constants/statusCodes";
import {
  createBill,
  getAllBills,
  getBillById,
  getBillsByPatient,
  updateBill,
  deleteBill,
} from "../../services/transectionService/billService";

const billItemSchema = z.object({
  company: z.string().min(1, "Company is required"),
  itemOrService: z.string().min(1, "Item/Service is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

const billSchema = z.object({
  billDate: z.string().transform((val) => new Date(val)),
  billType: z.string().min(1, "Bill type is required"),
  mobile: z.string().min(10, "Mobile must be at least 10 digits"),
  admissionNo: z.string().min(1, "Admission number is required"),
  admissionDate: z.string().transform((val) => new Date(val)),
  dateOfBirth: z.string().transform((val) => new Date(val)),
  gender: z.enum(["Male", "Female", "Other"]),
  dischargeDate: z.string().transform((val) => new Date(val)).optional(),
  address: z.string().min(1, "Address is required"),
  doctorName: z.string().min(1, "Doctor name is required"),
  wardNo: z.string().min(1, "Ward number is required"),
  bedNo: z.string().min(1, "Bed number is required"),
  status: z.string().optional().default("Pending"),
  billItems: z.array(billItemSchema).min(1, "At least one bill item is required"),
});

export const createBillRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = billSchema.parse(req.body);
    const bill = await createBill(validated);
    
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Bill created successfully",
      data: bill,
    });
  }
);

export const getAllBillRecords = catchAsyncError(
  async (req: Request, res: Response) => {
    const mobile = req.query.mobile as string | undefined;
    
    const bills = mobile 
      ? await getBillsByPatient(mobile)
      : await getAllBills();
      
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: mobile
        ? `Bills for patient ${mobile} fetched`
        : "All bills fetched",
      data: bills,
    });
  }
);

export const getBillRecordById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const bill = await getBillById(id);
    if (!bill) {
      return next(new ErrorHandler("Bill not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Bill details fetched",
      data: bill,
    });
  }
);

export const updateBillRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const partialSchema = billSchema.partial();
    const validatedData = partialSchema.parse(req.body);

    const updatedBill = await updateBill(id, validatedData);
    if (!updatedBill) {
      return next(new ErrorHandler("Bill not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Bill updated successfully",
      data: updatedBill,
    });
  }
);

export const deleteBillRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const deletedBill = await deleteBill(id);
    if (!deletedBill) {
      return next(new ErrorHandler("Bill not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Bill deleted successfully",
      data: deletedBill,
    });
  }
);