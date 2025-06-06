// src/middlewares/errorMiddleware.ts

import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import mongoose from "mongoose";
import { ErrorHandler } from "./errorHandler";



export const errorMiddleware = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = 500;
  let message: string | string[] = "Internal Server Error";

  // 1. Handle Zod Validation Error
  if (err instanceof ZodError) {
    statusCode = 400;
    message = err.errors.map((e) => `${e.path.join(".")}: ${e.message}`);
  }

  // 2. Handle Mongoose Validation Error
  else if (err instanceof mongoose.Error.ValidationError) {
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
  else if (err instanceof ErrorHandler) {
    statusCode = err.statusCode || 500;
    message = err.message || "Internal Server Error";
  }

  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
};
