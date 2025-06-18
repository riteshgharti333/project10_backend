"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePatientRecord = exports.updatePatientRecord = exports.getPatientRecordById = exports.getAllPatientRecords = exports.createPatientRecord = void 0;
const zod_1 = require("zod");
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandler_1 = require("../middlewares/errorHandler");
const sendResponse_1 = require("../utils/sendResponse");
const statusCodes_1 = require("../constants/statusCodes");
const patientService_1 = require("../services/patientService");
const patientSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(1, "Full name is required"),
    age: zod_1.z.number().int().positive("Age must be positive"),
    mobileNumber: zod_1.z.string().min(10, "Mobile number must be 10 digits"),
    gender: zod_1.z.string().min(1, "Gender is required"),
    bedNumber: zod_1.z.string().min(1, "Bed number is required"),
    aadhaarNumber: zod_1.z.string().length(12, "Aadhaar must be 12 digits"),
    address: zod_1.z.string().min(1, "Address is required"),
    medicalHistory: zod_1.z.string().min(1, "Medical history is required"),
});
exports.createPatientRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const validated = patientSchema.parse(req.body);
    const patient = await (0, patientService_1.createPatient)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "Patient record created successfully",
        data: patient,
    });
});
exports.getAllPatientRecords = (0, catchAsyncError_1.catchAsyncError)(async (_req, res) => {
    const patients = await (0, patientService_1.getAllPatients)();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "All patient records fetched",
        data: patients,
    });
});
exports.getPatientRecordById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const patient = await (0, patientService_1.getPatientById)(id);
    if (!patient) {
        return next(new errorHandler_1.ErrorHandler("Patient not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Patient details fetched",
        data: patient,
    });
});
exports.updatePatientRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const partialSchema = patientSchema.partial();
    const validatedData = partialSchema.parse(req.body);
    // Check if updating Aadhaar to an existing one
    if (validatedData.aadhaarNumber) {
        const existingPatient = await (0, patientService_1.getPatientByAadhaar)(validatedData.aadhaarNumber);
        if (existingPatient && existingPatient.id !== id) {
            return next(new errorHandler_1.ErrorHandler("Another patient with this Aadhaar already exists", statusCodes_1.StatusCodes.CONFLICT));
        }
    }
    const updatedPatient = await (0, patientService_1.updatePatient)(id, validatedData);
    if (!updatedPatient) {
        return next(new errorHandler_1.ErrorHandler("Patient not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Patient updated successfully",
        data: updatedPatient,
    });
});
exports.deletePatientRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const deletedPatient = await (0, patientService_1.deletePatient)(id);
    if (!deletedPatient) {
        return next(new errorHandler_1.ErrorHandler("Patient not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Patient deleted successfully",
        data: deletedPatient,
    });
});
