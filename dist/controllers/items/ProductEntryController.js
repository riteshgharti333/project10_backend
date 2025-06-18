"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductRecord = exports.updateProductRecord = exports.getProductRecordById = exports.getAllProductRecords = exports.createProductRecord = void 0;
const zod_1 = require("zod");
const catchAsyncError_1 = require("../../middlewares/catchAsyncError");
const errorHandler_1 = require("../../middlewares/errorHandler");
const sendResponse_1 = require("../../utils/sendResponse");
const statusCodes_1 = require("../../constants/statusCodes");
const productEntryService_1 = require("../../services/itemService/productEntryService");
const materialSpecSchema = zod_1.z.object({
    uom: zod_1.z.string().min(1, "UOM is required"),
    description: zod_1.z.string().optional(),
    alterUnit: zod_1.z.string().optional(),
    alterUnitValue: zod_1.z.number().optional(),
    serialUniqueNo: zod_1.z.string().optional(),
});
const productSchema = zod_1.z.object({
    brand: zod_1.z.string().min(1, "Brand is required"),
    category: zod_1.z.string().min(1, "Category is required"),
    productName: zod_1.z.string().min(1, "Product name is required"),
    shortDescription: zod_1.z.string().optional(),
    hsnCode: zod_1.z.string().min(1, "HSN Code is required"),
    gstPercentage: zod_1.z.number().min(0, "GST must be positive"),
    status: zod_1.z.string().optional().default("Active"),
    specifications: zod_1.z.array(materialSpecSchema).optional(),
});
exports.createProductRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const validated = productSchema.parse(req.body);
    const product = await (0, productEntryService_1.createProduct)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "Product created successfully",
        data: product,
    });
});
exports.getAllProductRecords = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const category = req.query.category;
    const products = category
        ? await (0, productEntryService_1.getProductsByCategory)(category)
        : await (0, productEntryService_1.getAllProducts)();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: category
            ? `Products in ${category} category fetched`
            : "All products fetched",
        data: products,
    });
});
exports.getProductRecordById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const product = await (0, productEntryService_1.getProductById)(id);
    if (!product) {
        return next(new errorHandler_1.ErrorHandler("Product not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Product details fetched",
        data: product,
    });
});
exports.updateProductRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const partialSchema = productSchema.partial();
    const validatedData = partialSchema.parse(req.body);
    const updatedProduct = await (0, productEntryService_1.updateProduct)(id, validatedData);
    if (!updatedProduct) {
        return next(new errorHandler_1.ErrorHandler("Product not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Product updated successfully",
        data: updatedProduct,
    });
});
exports.deleteProductRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const deletedProduct = await (0, productEntryService_1.deleteProduct)(id);
    if (!deletedProduct) {
        return next(new errorHandler_1.ErrorHandler("Product not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Product deleted successfully",
        data: deletedProduct,
    });
});
