import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import path from "path";
import testRoutes from "./routes/testRoutes.js";
import "./cron/taskReminder.js";
import reportRoutes from "./routes/reportRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

connectDB();

const app = express();

console.log("Gemini Key:", process.env.GEMINI_API_KEY);

app.use(cors());

app.use(express.json());

app.use("/api/users", userRoutes);

app.use("/uploads", express.static(path.join("uploads")));

app.use("/api/reports", reportRoutes);

app.use("/api/test", testRoutes);

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/chat",chatRoutes);

app.get("/", (req, res) => {
  res.send("DevFlow AI API Running");
});

const PORT = process.env.PORT || 5000;

import activityRoutes
from "./routes/activityRoutes.js";

app.use(
  "/api/activity",
  activityRoutes
);

import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });
});

app.set("io", io);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);