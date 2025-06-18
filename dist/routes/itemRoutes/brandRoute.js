"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const BrandController_1 = require("../../controllers/items/BrandController");
const router = express_1.default.Router();
router.route("/")
    .post(BrandController_1.createBrandRecord)
    .get(BrandController_1.getAllBrandRecords);
router.route("/:id")
    .get(BrandController_1.getBrandRecordById)
    .patch(BrandController_1.updateBrandRecord)
    .delete(BrandController_1.deleteBrandRecord);
exports.default = router;
