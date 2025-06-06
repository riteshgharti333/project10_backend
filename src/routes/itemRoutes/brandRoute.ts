import express from "express";
import {
  createBrandRecord,
  getAllBrandRecords,
  getBrandRecordById,
  updateBrandRecord,
  deleteBrandRecord,
} from "../../controllers/items/BrandController";

const router = express.Router();

router.route("/")
  .post(createBrandRecord)
  .get(getAllBrandRecords);

router.route("/:id")
  .get(getBrandRecordById)
  .patch(updateBrandRecord)
  .delete(deleteBrandRecord);

export default router;
