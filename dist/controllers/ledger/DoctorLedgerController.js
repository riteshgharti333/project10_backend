"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDoctorLedgerRecord = exports.updateDoctorLedgerRecord = exports.getDoctorBalanceRecord = exports.getDoctorLedgerRecordById = exports.getAllDoctorLedgerRecords = exports.createDoctorLedgerRecord = void 0;
const zod_1 = require("zod");
const catchAsyncError_1 = require("../../middlewares/catchAsyncError");
const errorHandler_1 = require("../../middlewares/errorHandler");
const sendResponse_1 = require("../../utils/sendResponse");
const statusCodes_1 = require("../../constants/statusCodes");
const doctorLedgerService_1 = require("../../services/ledgerService/doctorLedgerService");
const doctorLedgerSchema = zod_1.z.object({
    doctorName: zod_1.z.string().min(1, "Doctor name is required"),
    date: zod_1.z.coerce.date(),
    description: zod_1.z.string().min(1, "Description is required"),
    amountType: zod_1.z.enum(["Credit", "Debit"]),
    amount: zod_1.z.number().positive("Amount must be positive"),
    paymentMode: zod_1.z.string().min(1, "Payment mode is required"),
    transactionId: zod_1.z.string().optional(),
    remarks: zod_1.z.string().optional(),
});
exports.createDoctorLedgerRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const validated = doctorLedgerSchema.parse({
        ...req.body,
        date: new Date(req.body.date)
    });
    const entry = await (0, doctorLedgerService_1.createDoctorLedgerEntry)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "Doctor ledger entry created successfully",
        data: entry,
    });
});
exports.getAllDoctorLedgerRecords = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const filters = {
        doctorName: req.query.doctorName,
        startDate: req.query.startDate ? new Date(req.query.startDate) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate) : undefined,
        amountType: req.query.amountType
    };
    const entries = await (0, doctorLedgerService_1.getAllDoctorLedgerEntries)(filters);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Doctor ledger entries fetched successfully",
        data: entries,
    });
});
exports.getDoctorLedgerRecordById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const entry = await (0, doctorLedgerService_1.getDoctorLedgerEntryById)(id);
    if (!entry) {
        return next(new errorHandler_1.ErrorHandler("Doctor ledger entry not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Doctor ledger entry details fetched",
        data: entry,
    });
});
exports.getDoctorBalanceRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const doctorName = req.query.doctorName;
    if (!doctorName) {
        return next(new errorHandler_1.ErrorHandler("Doctor name is required", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const balance = await (0, doctorLedgerService_1.getDoctorBalance)(doctorName);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Doctor balance calculated",
        data: { doctorName, balance },
    });
});
exports.updateDoctorLedgerRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const partialSchema = doctorLedgerSchema.partial();
    const validatedData = partialSchema.parse({
        ...req.body,
        date: req.body.date ? new Date(req.body.date) : undefined
    });
    const updatedEntry = await (0, doctorLedgerService_1.updateDoctorLedgerEntry)(id, validatedData);
    if (!updatedEntry) {
        return next(new errorHandler_1.ErrorHandler("Doctor ledger entry not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Doctor ledger entry updated successfully",
        data: updatedEntry,
    });
});
exports.deleteDoctorLedgerRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const deletedEntry = await (0, doctorLedgerService_1.deleteDoctorLedgerEntry)(id);
    if (!deletedEntry) {
        return next(new errorHandler_1.ErrorHandler("Doctor ledger entry not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Doctor ledger entry deleted successfully",
        data: deletedEntry,
    });
});
