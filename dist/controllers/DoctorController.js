"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDoctorRecord = exports.updateDoctorRecord = exports.getDoctorRecordById = exports.getAllDoctorRecords = exports.createDoctorRecord = void 0;
const zod_1 = require("zod");
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandler_1 = require("../middlewares/errorHandler");
const sendResponse_1 = require("../utils/sendResponse");
const statusCodes_1 = require("../constants/statusCodes");
const doctorService_1 = require("../services/doctorService");
const doctorSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(1, "Full name is required"),
    mobileNumber: zod_1.z.string().min(10, "Mobile number must be at least 10 digits"),
    registrationNo: zod_1.z.string().min(1, "Registration number is required"),
    qualification: zod_1.z.string().min(1, "Qualification is required"),
    designation: zod_1.z.string().min(1, "Designation is required"),
    department: zod_1.z.string().min(1, "Department is required"),
    specialization: zod_1.z.string().min(1, "Specialization is required"),
    status: zod_1.z.string().optional().default("Active"),
});
exports.createDoctorRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const validated = doctorSchema.parse(req.body);
    // Check if registration number already exists
    const existingDoctor = await (0, doctorService_1.getDoctorByRegistration)(validated.registrationNo);
    if (existingDoctor) {
        return next(new errorHandler_1.ErrorHandler("Doctor with this registration number already exists", statusCodes_1.StatusCodes.CONFLICT));
    }
    const doctor = await (0, doctorService_1.createDoctor)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "Doctor created successfully",
        data: doctor,
    });
});
exports.getAllDoctorRecords = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const department = req.query.department;
    const doctors = department
        ? await (0, doctorService_1.getDoctorsByDepartment)(department)
        : await (0, doctorService_1.getAllDoctors)();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: department
            ? `Doctors in ${department} department fetched`
            : "All doctors fetched",
        data: doctors,
    });
});
exports.getDoctorRecordById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const doctor = await (0, doctorService_1.getDoctorById)(id);
    if (!doctor) {
        return next(new errorHandler_1.ErrorHandler("Doctor not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Doctor details fetched",
        data: doctor,
    });
});
exports.updateDoctorRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const partialSchema = doctorSchema.partial();
    const validatedData = partialSchema.parse(req.body);
    // Check if updating registration number to an existing one
    if (validatedData.registrationNo) {
        const existingDoctor = await (0, doctorService_1.getDoctorByRegistration)(validatedData.registrationNo);
        if (existingDoctor && existingDoctor.id !== id) {
            return next(new errorHandler_1.ErrorHandler("Another doctor with this registration number already exists", statusCodes_1.StatusCodes.CONFLICT));
        }
    }
    const updatedDoctor = await (0, doctorService_1.updateDoctor)(id, validatedData);
    if (!updatedDoctor) {
        return next(new errorHandler_1.ErrorHandler("Doctor not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Doctor updated successfully",
        data: updatedDoctor,
    });
});
exports.deleteDoctorRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const deletedDoctor = await (0, doctorService_1.deleteDoctor)(id);
    if (!deletedDoctor) {
        return next(new errorHandler_1.ErrorHandler("Doctor not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Doctor deleted successfully",
        data: deletedDoctor,
    });
});
