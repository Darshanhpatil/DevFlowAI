import express from "express";

import {
  generatePlan,
  getPlans,
} from "../controllers/aiPlannerController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/generate",
  protect,
  generatePlan
);

router.get(
  "/history",
  protect,
  getPlans
);

export default router;