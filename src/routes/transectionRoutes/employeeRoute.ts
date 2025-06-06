import express from "express";
import multer from "multer";
import {
  createEmployeeRecord,
  getAllEmployeeRecords,
  getEmployeeRecordById,
  updateEmployeeRecord,
  deleteEmployeeRecord,
} from "../../controllers/transection/EmployeeController";

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.route("/")
  .post(upload.single('photo'), createEmployeeRecord)
  .get(getAllEmployeeRecords);

router.route("/:id")
  .get(getEmployeeRecordById)
  .patch(upload.single('photo'), updateEmployeeRecord)
  .delete(deleteEmployeeRecord);

export default router;