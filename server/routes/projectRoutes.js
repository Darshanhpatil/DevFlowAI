import express from "express";

const router = express.Router();

import {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";

import { protect } from "../middleware/authMiddleware.js";

router.post("/", protect, createProject);

router.get("/", protect, getProjects);

router.put("/:id", protect, updateProject);

router.delete("/:id", protect, deleteProject);

export default router;