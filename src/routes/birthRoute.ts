import express from "express";
import {
  createBirthRecord,
  getAllBirthRecords,
  getBirthRecordById,
  updateBirthRecord,
  deleteBirthRecord,
} from "../controllers/BirthController";

const router = express.Router();

router.route("/")
  .post(createBirthRecord)
  .get(getAllBirthRecords);

router.route("/:id")
  .get(getBirthRecordById)
  .patch(updateBirthRecord)
  .delete(deleteBirthRecord);

export default router;