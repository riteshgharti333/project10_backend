"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLedgerEntryRecord = exports.updateLedgerEntryRecord = exports.getPatientBalanceRecord = exports.getLedgerEntryRecordById = exports.getAllLedgerEntryRecords = exports.createLedgerEntryRecord = void 0;
const zod_1 = require("zod");
const catchAsyncError_1 = require("../../middlewares/catchAsyncError");
const errorHandler_1 = require("../../middlewares/errorHandler");
const sendResponse_1 = require("../../utils/sendResponse");
const statusCodes_1 = require("../../constants/statusCodes");
const patientLedgerService_1 = require("../../services/ledgerService/patientLedgerService");
const ledgerEntrySchema = zod_1.z.object({
    patientName: zod_1.z.string().min(1, "Patient name is required"),
    date: zod_1.z.coerce.date(),
    description: zod_1.z.string().min(1, "Description is required"),
    amountType: zod_1.z.enum(["Credit", "Debit"]),
    amount: zod_1.z.number().positive("Amount must be positive"),
    paymentMode: zod_1.z.string().min(1, "Payment mode is required"),
    transactionId: zod_1.z.string().optional(),
    remarks: zod_1.z.string().optional(),
});
exports.createLedgerEntryRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const validated = ledgerEntrySchema.parse({
        ...req.body,
        date: new Date(req.body.date)
    });
    const entry = await (0, patientLedgerService_1.createLedgerEntry)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "Ledger entry created successfully",
        data: entry,
    });
});
exports.getAllLedgerEntryRecords = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const filters = {
        patientName: req.query.patientName,
        startDate: req.query.startDate ? new Date(req.query.startDate) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate) : undefined,
        amountType: req.query.amountType
    };
    const entries = await (0, patientLedgerService_1.getAllLedgerEntries)(filters);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Ledger entries fetched successfully",
        data: entries,
    });
});
exports.getLedgerEntryRecordById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const entry = await (0, patientLedgerService_1.getLedgerEntryById)(id);
    if (!entry) {
        return next(new errorHandler_1.ErrorHandler("Ledger entry not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Ledger entry details fetched",
        data: entry,
    });
});
exports.getPatientBalanceRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const patientName = req.query.patientName;
    if (!patientName) {
        return next(new errorHandler_1.ErrorHandler("Patient name is required", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const balance = await (0, patientLedgerService_1.getPatientBalance)(patientName);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Patient balance calculated",
        data: { patientName, balance },
    });
});
exports.updateLedgerEntryRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const partialSchema = ledgerEntrySchema.partial();
    const validatedData = partialSchema.parse({
        ...req.body,
        date: req.body.date ? new Date(req.body.date) : undefined
    });
    const updatedEntry = await (0, patientLedgerService_1.updateLedgerEntry)(id, validatedData);
    if (!updatedEntry) {
        return next(new errorHandler_1.ErrorHandler("Ledger entry not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Ledger entry updated successfully",
        data: updatedEntry,
    });
});
exports.deleteLedgerEntryRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const deletedEntry = await (0, patientLedgerService_1.deleteLedgerEntry)(id);
    if (!deletedEntry) {
        return next(new errorHandler_1.ErrorHandler("Ledger entry not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Ledger entry deleted successfully",
        data: deletedEntry,
    });
});
