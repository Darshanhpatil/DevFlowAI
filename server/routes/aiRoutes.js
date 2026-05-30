import express from "express";
import { generateTasks } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js"; // Make sure authMiddleware exists and is exported correctly!

const router = express.Router();

router.post("/generate-tasks", protect, generateTasks);


export default router;