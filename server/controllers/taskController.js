import Task from "../models/Task.js";
import Activity from "../models/Activity.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

// CREATE TASK
export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      dueDate,
      project,
      assignedTo,
    } = req.body;

    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      priority: req.body.priority,
      dueDate: req.body.dueDate,
      project: req.body.project,
      assignedTo: req.body.assignedTo, // <-- IMPORTANT
      user: req.user.id,
    });

    if (task.assignedTo) {
      const assignedUser = await User.findById(task.assignedTo);

      if (assignedUser) {
        await sendEmail(
          assignedUser.email,

          "New Task Assigned - DevFlow AI",

          `
Hello ${assignedUser.name},

You have been assigned a new task.

Task: ${task.title}

Description:
${task.description}

Priority: ${task.priority}

Due Date:
${task.dueDate ? new Date(task.dueDate).toDateString() : "Not Set"}

Please login to DevFlow AI
to view details.

Regards,
DevFlow AI Team
`,
        );
      }
    }

    if (assignedTo) {
      await Notification.create({
        user: assignedTo,
        message: `You have been assigned task "${title}"`,
      });
    }

    await Activity.create({
      action: `Added task "${task.title}"`,
      user: req.user.id,
    });

    const io = req.app.get("io");
    io.emit("taskCreated");

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET TASKS
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      project: req.params.projectId,
      user: req.user.id,
    })
      .populate("assignedTo", "name email profilePic")
      .sort({
        createdAt: -1,
      });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE TASK
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    await Activity.create({
      action: `Updated task "${updatedTask.title}"`,
      user: req.user.id,
    });

    const io = req.app.get("io");
    io.emit("taskUpdated");

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE TASK
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    await Activity.create({
      action: `Deleted task "${task.title}"`,
      user: req.user.id,
    });

    await task.deleteOne();

    const io = req.app.get("io");
    io.emit("taskDeleted");

    res.status(200).json({
      message: "Task deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPLOAD TASK FILE
export const uploadTaskFile = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;

    if (!task.attachments) {
      task.attachments = [];
    }

    task.attachments.push({
      filename: req.file.originalname,
      url: fileUrl,
    });

    await task.save();

    await Activity.create({
      action: `Added attachment to task "${task.title}"`,
      user: req.user.id,
    });

    res.status(200).json({
      message: "Attachment added",
      url: fileUrl,
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateTaskFile = async (req, res) => {
  try {
    const task = await Task.findById(req.body.taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const fileData = {
      filename: req.file.filename,
      url: `http://localhost:5000/uploads/${req.file.filename}`,
    };

    task.attachments.push(fileData);

    await task.save();

    res.status(200).json({
      message: "File uploaded successfully",
      file: fileData,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
