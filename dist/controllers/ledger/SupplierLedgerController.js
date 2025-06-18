"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSupplierLedgerRecord = exports.updateSupplierLedgerRecord = exports.getSupplierSummaryReport = exports.getSupplierOutstandingBalance = exports.getSupplierLedgerRecordById = exports.getAllSupplierLedgerRecords = exports.createSupplierLedgerRecord = void 0;
const zod_1 = require("zod");
const catchAsyncError_1 = require("../../middlewares/catchAsyncError");
const errorHandler_1 = require("../../middlewares/errorHandler");
const sendResponse_1 = require("../../utils/sendResponse");
const statusCodes_1 = require("../../constants/statusCodes");
const supplierLedgerService_1 = require("../../services/ledgerService/supplierLedgerService");
const supplierLedgerSchema = zod_1.z.object({
    supplierName: zod_1.z.string().min(1, "Supplier name is required"),
    date: zod_1.z.coerce.date(),
    invoiceNo: zod_1.z.string().min(1, "Invoice number is required"),
    description: zod_1.z.string().min(1, "Description is required"),
    amountType: zod_1.z.enum(["Credit", "Debit"]),
    amount: zod_1.z.number().positive("Amount must be positive"),
    paymentMode: zod_1.z.string().optional(),
    transactionId: zod_1.z.string().optional(),
    attachBill: zod_1.z.string().optional(),
    remarks: zod_1.z.string().optional(),
});
exports.createSupplierLedgerRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const validated = supplierLedgerSchema.parse({
        ...req.body,
        date: new Date(req.body.date)
    });
    const entry = await (0, supplierLedgerService_1.createSupplierLedgerEntry)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "Supplier ledger record created successfully",
        data: entry,
    });
});
exports.getAllSupplierLedgerRecords = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const filters = {
        supplierName: req.query.supplierName,
        startDate: req.query.startDate ? new Date(req.query.startDate) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate) : undefined,
        invoiceNo: req.query.invoiceNo,
        amountType: req.query.amountType
    };
    const entries = await (0, supplierLedgerService_1.getAllSupplierLedgerEntries)(filters);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Supplier ledger records fetched successfully",
        data: entries,
    });
});
exports.getSupplierLedgerRecordById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const entry = await (0, supplierLedgerService_1.getSupplierLedgerEntryById)(id);
    if (!entry) {
        return next(new errorHandler_1.ErrorHandler("Supplier ledger record not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Supplier ledger record details fetched",
        data: entry,
    });
});
exports.getSupplierOutstandingBalance = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const supplierName = req.query.supplierName;
    if (!supplierName) {
        return next(new errorHandler_1.ErrorHandler("Supplier name is required", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const balance = await (0, supplierLedgerService_1.getSupplierOutstanding)(supplierName);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Supplier outstanding balance calculated",
        data: { supplierName, balance },
    });
});
exports.getSupplierSummaryReport = (0, catchAsyncError_1.catchAsyncError)(async (_req, res) => {
    const summary = await (0, supplierLedgerService_1.getSupplierSummary)();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Supplier summary report generated",
        data: summary,
    });
});
exports.updateSupplierLedgerRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const partialSchema = supplierLedgerSchema.partial();
    const validatedData = partialSchema.parse({
        ...req.body,
        date: req.body.date ? new Date(req.body.date) : undefined
    });
    const updatedEntry = await (0, supplierLedgerService_1.updateSupplierLedgerEntry)(id, validatedData);
    if (!updatedEntry) {
        return next(new errorHandler_1.ErrorHandler("Supplier ledger record not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Supplier ledger record updated successfully",
        data: updatedEntry,
    });
});
exports.deleteSupplierLedgerRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const deletedEntry = await (0, supplierLedgerService_1.deleteSupplierLedgerEntry)(id);
    if (!deletedEntry) {
        return next(new errorHandler_1.ErrorHandler("Supplier ledger record not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Supplier ledger record deleted successfully",
        data: deletedEntry,
    });
});
