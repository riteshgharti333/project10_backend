"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBillRecord = exports.updateBillRecord = exports.getBillRecordById = exports.getAllBillRecords = exports.createBillRecord = void 0;
const zod_1 = require("zod");
const catchAsyncError_1 = require("../../middlewares/catchAsyncError");
const errorHandler_1 = require("../../middlewares/errorHandler");
const sendResponse_1 = require("../../utils/sendResponse");
const statusCodes_1 = require("../../constants/statusCodes");
const billService_1 = require("../../services/transectionService/billService");
const billItemSchema = zod_1.z.object({
    company: zod_1.z.string().min(1, "Company is required"),
    itemOrService: zod_1.z.string().min(1, "Item/Service is required"),
    quantity: zod_1.z.number().min(1, "Quantity must be at least 1"),
});
const billSchema = zod_1.z.object({
    billDate: zod_1.z.string().transform((val) => new Date(val)),
    billType: zod_1.z.string().min(1, "Bill type is required"),
    mobile: zod_1.z.string().min(10, "Mobile must be at least 10 digits"),
    admissionNo: zod_1.z.string().min(1, "Admission number is required"),
    admissionDate: zod_1.z.string().transform((val) => new Date(val)),
    dateOfBirth: zod_1.z.string().transform((val) => new Date(val)),
    gender: zod_1.z.enum(["Male", "Female", "Other"]),
    dischargeDate: zod_1.z.string().transform((val) => new Date(val)).optional(),
    address: zod_1.z.string().min(1, "Address is required"),
    doctorName: zod_1.z.string().min(1, "Doctor name is required"),
    wardNo: zod_1.z.string().min(1, "Ward number is required"),
    bedNo: zod_1.z.string().min(1, "Bed number is required"),
    status: zod_1.z.string().optional().default("Pending"),
    billItems: zod_1.z.array(billItemSchema).min(1, "At least one bill item is required"),
});
exports.createBillRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const validated = billSchema.parse(req.body);
    const bill = await (0, billService_1.createBill)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "Bill created successfully",
        data: bill,
    });
});
exports.getAllBillRecords = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const mobile = req.query.mobile;
    const bills = mobile
        ? await (0, billService_1.getBillsByPatient)(mobile)
        : await (0, billService_1.getAllBills)();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: mobile
            ? `Bills for patient ${mobile} fetched`
            : "All bills fetched",
        data: bills,
    });
});
exports.getBillRecordById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const bill = await (0, billService_1.getBillById)(id);
    if (!bill) {
        return next(new errorHandler_1.ErrorHandler("Bill not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Bill details fetched",
        data: bill,
    });
});
exports.updateBillRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const partialSchema = billSchema.partial();
    const validatedData = partialSchema.parse(req.body);
    const updatedBill = await (0, billService_1.updateBill)(id, validatedData);
    if (!updatedBill) {
        return next(new errorHandler_1.ErrorHandler("Bill not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Bill updated successfully",
        data: updatedBill,
    });
});
exports.deleteBillRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const deletedBill = await (0, billService_1.deleteBill)(id);
    if (!deletedBill) {
        return next(new errorHandler_1.ErrorHandler("Bill not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Bill deleted successfully",
        data: deletedBill,
    });
});
