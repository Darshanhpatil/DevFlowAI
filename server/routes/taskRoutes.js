import express from "express";

import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  updateTaskFile,
} from "../controllers/taskController.js";

import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();


// CREATE TASK
router.post("/", protect, createTask);

// GET TASKS
router.get("/:projectId", protect, getTasks);

// UPDATE TASK
router.put("/:id", protect, updateTask);

// DELETE TASK
router.delete("/:id", protect, deleteTask);

// ADD ATTACHMENT
router.post(
  "/upload/:id",
  protect,
  upload.single("file"),
  uploadTaskFile
);

export default router;