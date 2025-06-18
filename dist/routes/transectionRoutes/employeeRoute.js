"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const EmployeeController_1 = require("../../controllers/transection/EmployeeController");
const upload = (0, multer_1.default)({ dest: 'uploads/' });
const router = express_1.default.Router();
router.route("/")
    .post(upload.single('photo'), EmployeeController_1.createEmployeeRecord)
    .get(EmployeeController_1.getAllEmployeeRecords);
router.route("/:id")
    .get(EmployeeController_1.getEmployeeRecordById)
    .patch(upload.single('photo'), EmployeeController_1.updateEmployeeRecord)
    .delete(EmployeeController_1.deleteEmployeeRecord);
exports.default = router;
