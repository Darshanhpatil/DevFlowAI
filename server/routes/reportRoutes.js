import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { exportProjectReport } from "../controllers/reportController.js";

const router = express.Router();

router.get(
  "/:projectId",
  protect,
  exportProjectReport
);

export default router;