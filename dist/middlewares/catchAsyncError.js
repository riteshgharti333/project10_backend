"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAsyncError = void 0;
/**
 * Wraps async route handlers to catch unhandled promise rejections.
 */
const catchAsyncError = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.catchAsyncError = catchAsyncError;
