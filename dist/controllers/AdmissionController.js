"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAdmission = exports.updateAdmission = exports.getAdmissionById = exports.getAllAdmissions = exports.createAdmission = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandler_1 = require("../middlewares/errorHandler");
const sendResponse_1 = require("../utils/sendResponse");
const statusCodes_1 = require("../constants/statusCodes");
const prisma = new client_1.PrismaClient();
const admissionSchema = zod_1.z.object({
    admissionDate: zod_1.z.coerce.date(),
    admissionTime: zod_1.z.string().min(1, "Admission time is required"),
    dischargeDate: zod_1.z.preprocess((val) => (val === "" ? undefined : val), zod_1.z.coerce.date().optional()),
    gsRsRegNo: zod_1.z.string().min(1, "GS/RS Reg No is required"),
    wardNo: zod_1.z.string().min(1, "Ward No is required"),
    bedNo: zod_1.z.string().min(1, "Bed No is required"),
    bloodGroup: zod_1.z.string().min(1, "Blood group is required"),
    aadhaarNo: zod_1.z.string().min(12, "Aadhaar No must be 12 digits").max(12),
    urnNo: zod_1.z.string().optional(),
    patientName: zod_1.z.string().min(1, "Patient name is required"),
    patientAge: zod_1.z.number().int().positive("Age must be positive"),
    patientSex: zod_1.z.string().min(1, "Patient sex is required"),
    guardianType: zod_1.z.string().min(1, "Guardian type is required"),
    guardianName: zod_1.z.string().min(1, "Guardian name is required"),
    phoneNo: zod_1.z.string().min(10, "Phone number must be at least 10 digits"),
    patientAddress: zod_1.z.string().min(1, "Address is required"),
    bodyWeightKg: zod_1.z.number().optional(),
    bodyHeightCm: zod_1.z.number().optional(),
    literacy: zod_1.z.string().min(1, "Literacy status is required"),
    occupation: zod_1.z.string().min(1, "Occupation is required"),
    doctorName: zod_1.z.string().min(1, "Doctor name is required"),
    isDelivery: zod_1.z.boolean().default(false),
});
// CREATE
exports.createAdmission = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const validated = admissionSchema.parse(req.body);
    const admission = await prisma.admission.create({ data: validated });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "Admission created successfully",
        data: admission,
    });
});
// GET ALL
exports.getAllAdmissions = (0, catchAsyncError_1.catchAsyncError)(async (_req, res) => {
    const admissions = await prisma.admission.findMany({
        orderBy: { createdAt: 'desc' }
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "All admissions fetched",
        data: admissions,
    });
});
// GET SINGLE BY ID
exports.getAdmissionById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    const admission = await prisma.admission.findUnique({ where: { id } });
    if (!admission)
        return next(new errorHandler_1.ErrorHandler("Admission not found", statusCodes_1.StatusCodes.NOT_FOUND));
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Admission details fetched",
        data: admission,
    });
});
// UPDATE
exports.updateAdmission = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    // Allow partial update
    const partialSchema = admissionSchema.partial();
    const validatedData = partialSchema.parse(req.body);
    const updatedAdmission = await prisma.admission.update({
        where: { id },
        data: validatedData,
    });
    if (!updatedAdmission)
        return next(new errorHandler_1.ErrorHandler("Admission not found", statusCodes_1.StatusCodes.NOT_FOUND));
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Admission updated successfully",
        data: updatedAdmission,
    });
});
// DELETE
exports.deleteAdmission = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    const deletedAdmission = await prisma.admission.delete({ where: { id } });
    if (!deletedAdmission)
        return next(new errorHandler_1.ErrorHandler("Admission not found", statusCodes_1.StatusCodes.NOT_FOUND));
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Admission deleted successfully",
        data: deletedAdmission,
    });
});
