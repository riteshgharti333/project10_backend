"use strict";
// src/middlewares/errorMiddleware.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
const errorHandler_1 = require("./errorHandler");
const errorMiddleware = (err, _req, res, _next) => {
    let statusCode = 500;
    let message = "Internal Server Error";
    // 1. Handle Zod Validation Error
    if (err instanceof zod_1.ZodError) {
        statusCode = 400;
        message = err.errors.map((e) => `${e.path.join(".")}: ${e.message}`);
    }
    // 2. Handle Mongoose Validation Error
    else if (err instanceof mongoose_1.default.Error.ValidationError) {
        statusCode = 400;
        message = Object.values(err.errors).map((val) => val.message);
    }
    // 3. Handle Duplicate Key Error (unique constraints)
    else if (err.code === 11000) {
        statusCode = 409;
        const duplicateField = Object.keys(err.keyValue)[0];
        message = `Duplicate entry for ${duplicateField}: "${err.keyValue[duplicateField]}"`;
    }
    // 4. Custom Error Handler
    else if (err instanceof errorHandler_1.ErrorHandler) {
        statusCode = err.statusCode || 500;
        message = err.message || "Internal Server Error";
    }
    res.status(statusCode).json({
        success: false,
        message,
        statusCode,
    });
};
exports.errorMiddleware = errorMiddleware;
