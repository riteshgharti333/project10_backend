"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInsuranceLedgerRecord = exports.updateInsuranceLedgerRecord = exports.getInsuranceSummaryReport = exports.getInsuranceLedgerRecordById = exports.getAllInsuranceLedgerRecords = exports.createInsuranceLedgerRecord = void 0;
const zod_1 = require("zod");
const catchAsyncError_1 = require("../../middlewares/catchAsyncError");
const errorHandler_1 = require("../../middlewares/errorHandler");
const sendResponse_1 = require("../../utils/sendResponse");
const statusCodes_1 = require("../../constants/statusCodes");
const insuranceLedgerService_1 = require("../../services/ledgerService/insuranceLedgerService");
const insuranceLedgerSchema = zod_1.z.object({
    patientName: zod_1.z.string().min(1, "Patient name is required"),
    tpaInsuranceCompany: zod_1.z.string().min(1, "TPA/Insurance Company is required"),
    claimAmount: zod_1.z.number().positive("Claim amount must be positive"),
    approvedAmount: zod_1.z.number().min(0).optional(),
    settledAmount: zod_1.z.number().min(0).optional(),
    status: zod_1.z.enum(["Pending", "Approved", "Rejected", "Partially Approved", "Settled"]),
    remarks: zod_1.z.string().optional(),
    claimDate: zod_1.z.coerce.date(),
    approvalDate: zod_1.z.coerce.date().optional(),
    settlementDate: zod_1.z.coerce.date().optional(),
});
exports.createInsuranceLedgerRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const validated = insuranceLedgerSchema.parse({
        ...req.body,
        claimDate: new Date(req.body.claimDate),
        approvalDate: req.body.approvalDate ? new Date(req.body.approvalDate) : undefined,
        settlementDate: req.body.settlementDate ? new Date(req.body.settlementDate) : undefined
    });
    const entry = await (0, insuranceLedgerService_1.createInsuranceLedgerEntry)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "Insurance ledger record created successfully",
        data: entry,
    });
});
exports.getAllInsuranceLedgerRecords = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const filters = {
        patientName: req.query.patientName,
        tpaInsuranceCompany: req.query.tpaInsuranceCompany,
        status: req.query.status,
        startDate: req.query.startDate ? new Date(req.query.startDate) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate) : undefined
    };
    const entries = await (0, insuranceLedgerService_1.getAllInsuranceLedgerEntries)(filters);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Insurance ledger records fetched successfully",
        data: entries,
    });
});
exports.getInsuranceLedgerRecordById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const entry = await (0, insuranceLedgerService_1.getInsuranceLedgerEntryById)(id);
    if (!entry) {
        return next(new errorHandler_1.ErrorHandler("Insurance ledger record not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Insurance ledger record details fetched",
        data: entry,
    });
});
exports.getInsuranceSummaryReport = (0, catchAsyncError_1.catchAsyncError)(async (_req, res) => {
    const report = await (0, insuranceLedgerService_1.getInsuranceSummary)();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Insurance summary report generated",
        data: report,
    });
});
exports.updateInsuranceLedgerRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const partialSchema = insuranceLedgerSchema.partial();
    const validatedData = partialSchema.parse({
        ...req.body,
        claimDate: req.body.claimDate ? new Date(req.body.claimDate) : undefined,
        approvalDate: req.body.approvalDate ? new Date(req.body.approvalDate) : undefined,
        settlementDate: req.body.settlementDate ? new Date(req.body.settlementDate) : undefined
    });
    const updatedEntry = await (0, insuranceLedgerService_1.updateInsuranceLedgerEntry)(id, validatedData);
    if (!updatedEntry) {
        return next(new errorHandler_1.ErrorHandler("Insurance ledger record not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Insurance ledger record updated successfully",
        data: updatedEntry,
    });
});
exports.deleteInsuranceLedgerRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const deletedEntry = await (0, insuranceLedgerService_1.deleteInsuranceLedgerEntry)(id);
    if (!deletedEntry) {
        return next(new errorHandler_1.ErrorHandler("Insurance ledger record not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Insurance ledger record deleted successfully",
        data: deletedEntry,
    });
});
