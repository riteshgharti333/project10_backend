"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePrescriptionRecord = exports.updatePrescriptionRecord = exports.getPrescriptionRecordById = exports.getAllPrescriptionRecords = exports.createPrescriptionRecord = void 0;
const zod_1 = require("zod");
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandler_1 = require("../middlewares/errorHandler");
const sendResponse_1 = require("../utils/sendResponse");
const statusCodes_1 = require("../constants/statusCodes");
const prescriptionService_1 = require("../services/prescriptionService");
const medicineSchema = zod_1.z.object({
    medicineName: zod_1.z.string().min(1, "Medicine name is required"),
    description: zod_1.z.string().min(1, "Description is required"),
});
const prescriptionSchema = zod_1.z.object({
    prescriptionDate: zod_1.z.coerce.date(),
    doctorId: zod_1.z.number().min(1, "Doctor ID is required"),
    patientId: zod_1.z.number().min(1, "Patient ID is required"),
    prescriptionDoc: zod_1.z.string().optional(),
    status: zod_1.z.string().optional().default("Active"),
    medicines: zod_1.z.array(medicineSchema).min(1, "At least one medicine is required"),
});
exports.createPrescriptionRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const validated = prescriptionSchema.parse({
        ...req.body,
        prescriptionDate: new Date(req.body.prescriptionDate)
    });
    const prescription = await (0, prescriptionService_1.createPrescription)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "Prescription created successfully",
        data: prescription,
    });
});
exports.getAllPrescriptionRecords = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const patientId = req.query.patientId ? Number(req.query.patientId) : undefined;
    const prescriptions = patientId
        ? await (0, prescriptionService_1.getPrescriptionsByPatient)(patientId)
        : await (0, prescriptionService_1.getAllPrescriptions)();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: patientId
            ? `Prescriptions for patient ${patientId} fetched`
            : "All prescriptions fetched",
        data: prescriptions,
    });
});
exports.getPrescriptionRecordById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const prescription = await (0, prescriptionService_1.getPrescriptionById)(id);
    if (!prescription) {
        return next(new errorHandler_1.ErrorHandler("Prescription not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Prescription details fetched",
        data: prescription,
    });
});
exports.updatePrescriptionRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const partialSchema = prescriptionSchema.partial();
    const validatedData = partialSchema.parse({
        ...req.body,
        prescriptionDate: req.body.prescriptionDate ? new Date(req.body.prescriptionDate) : undefined
    });
    const updatedPrescription = await (0, prescriptionService_1.updatePrescription)(id, validatedData);
    if (!updatedPrescription) {
        return next(new errorHandler_1.ErrorHandler("Prescription not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Prescription updated successfully",
        data: updatedPrescription,
    });
});
exports.deletePrescriptionRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const deletedPrescription = await (0, prescriptionService_1.deletePrescription)(id);
    if (!deletedPrescription) {
        return next(new errorHandler_1.ErrorHandler("Prescription not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Prescription deleted successfully",
        data: deletedPrescription,
    });
});
