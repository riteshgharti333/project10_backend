import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { catchAsyncError } from "../../middlewares/catchAsyncError";
import { ErrorHandler } from "../../middlewares/errorHandler";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "../../constants/statusCodes";
import {
  createProduct,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  updateProduct,
  deleteProduct,
} from "../../services/itemService/productEntryService";

const materialSpecSchema = z.object({
  uom: z.string().min(1, "UOM is required"),
  description: z.string().optional(),
  alterUnit: z.string().optional(),
  alterUnitValue: z.number().optional(),
  serialUniqueNo: z.string().optional(),
});

const productSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  category: z.string().min(1, "Category is required"),
  productName: z.string().min(1, "Product name is required"),
  shortDescription: z.string().optional(),
  hsnCode: z.string().min(1, "HSN Code is required"),
  gstPercentage: z.number().min(0, "GST must be positive"),
  status: z.string().optional().default("Active"),
  specifications: z.array(materialSpecSchema).optional(),
});

export const createProductRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = productSchema.parse(req.body);
    const product = await createProduct(validated);
    
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Product created successfully",
      data: product,
    });
  }
);

export const getAllProductRecords = catchAsyncError(
  async (req: Request, res: Response) => {
    const category = req.query.category as string | undefined;
    
    const products = category 
      ? await getProductsByCategory(category)
      : await getAllProducts();
      
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: category
        ? `Products in ${category} category fetched`
        : "All products fetched",
      data: products,
    });
  }
);

export const getProductRecordById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const product = await getProductById(id);
    if (!product) {
      return next(new ErrorHandler("Product not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Product details fetched",
      data: product,
    });
  }
);

export const updateProductRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const partialSchema = productSchema.partial();
    const validatedData = partialSchema.parse(req.body);

    const updatedProduct = await updateProduct(id, validatedData);
    if (!updatedProduct) {
      return next(new ErrorHandler("Product not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  }
);

export const deleteProductRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const deletedProduct = await deleteProduct(id);
    if (!deletedProduct) {
      return next(new ErrorHandler("Product not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Product deleted successfully",
      data: deletedProduct,
    });
  }
);