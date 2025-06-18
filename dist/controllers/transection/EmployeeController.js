"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEmployeeRecord = exports.updateEmployeeRecord = exports.getEmployeeRecordById = exports.getAllEmployeeRecords = exports.createEmployeeRecord = void 0;
const zod_1 = require("zod");
const catchAsyncError_1 = require("../../middlewares/catchAsyncError");
const errorHandler_1 = require("../../middlewares/errorHandler");
const sendResponse_1 = require("../../utils/sendResponse");
const statusCodes_1 = require("../../constants/statusCodes");
const employeeService_1 = require("../../services/transectionService/employeeService");
const employeeSchema = zod_1.z.object({
    employeeName: zod_1.z.string().min(1, "Employee name is required"),
    fathersName: zod_1.z.string().min(1, "Father's name is required"),
    dateOfRegistration: zod_1.z.string().transform((val) => new Date(val)),
    contactNo: zod_1.z.string().min(10, "Contact number must be at least 10 digits"),
    dateOfBirth: zod_1.z.string().transform((val) => new Date(val)),
    email: zod_1.z.string().email().optional(),
    gender: zod_1.z.enum(["Male", "Female", "Other"]),
    maritalStatus: zod_1.z.enum(["Single", "Married", "Divorced", "Widowed"]),
    aadharNo: zod_1.z.string().length(12, "Aadhar must be 12 digits").optional(),
    voterId: zod_1.z.string().min(1, "Voter ID is required").optional(),
    bloodGroup: zod_1.z
        .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
        .optional(),
    department: zod_1.z.string().min(1, "Department is required"),
    photoUrl: zod_1.z.string().optional(),
});
exports.createEmployeeRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const validated = employeeSchema.parse(req.body);
    const file = req.file;
    const employee = await (0, employeeService_1.createEmployee)(validated, file);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "Employee created successfully",
        data: employee,
    });
});
exports.getAllEmployeeRecords = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const department = req.query.department;
    const employees = department
        ? await (0, employeeService_1.getEmployeesByDepartment)(department)
        : await (0, employeeService_1.getAllEmployees)();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: department
            ? `Employees in ${department} department fetched`
            : "All employees fetched",
        data: employees,
    });
});
exports.getEmployeeRecordById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const employee = await (0, employeeService_1.getEmployeeById)(id);
    if (!employee) {
        return next(new errorHandler_1.ErrorHandler("Employee not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Employee details fetched",
        data: employee,
    });
});
exports.updateEmployeeRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const partialSchema = employeeSchema.partial();
    const validatedData = partialSchema.parse(req.body);
    const file = req.file;
    // Check for unique fields if they're being updated
    if (validatedData.email) {
        const existing = await prisma.employee.findFirst({
            where: { email: validatedData.email, NOT: { id } },
        });
        if (existing) {
            return next(new errorHandler_1.ErrorHandler("Email already in use", statusCodes_1.StatusCodes.CONFLICT));
        }
    }
    const updatedEmployee = await (0, employeeService_1.updateEmployee)(id, validatedData, file);
    if (!updatedEmployee) {
        return next(new errorHandler_1.ErrorHandler("Employee not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Employee updated successfully",
        data: updatedEmployee,
    });
});
exports.deleteEmployeeRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const deletedEmployee = await (0, employeeService_1.deleteEmployee)(id);
    if (!deletedEmployee) {
        return next(new errorHandler_1.ErrorHandler("Employee not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Employee deleted successfully",
        data: deletedEmployee,
    });
});
