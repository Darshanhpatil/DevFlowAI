import Task from "../models/Task.js";
import Activity from "../models/Activity.js";

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
    } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      project,
      user: req.user.id,
    });

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
    }).sort({
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
    const task = await Task.findById(
      req.params.id
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (
      task.user.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    const updatedTask =
      await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

    await Activity.create({
      action: `Updated task "${updatedTask.title}"`,
      user: req.user.id,
    });

    const io = req.app.get("io");
    io.emit("taskUpdated");

    res.status(200).json(
      updatedTask
    );

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE TASK
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(
      req.params.id
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (
      task.user.toString() !==
      req.user.id
    ) {
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
export const uploadTaskFile = async (
  req,
  res
) => {
  try {
    const task = await Task.findById(
      req.params.id
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (
      task.user.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    const fileUrl =
      `http://localhost:5000/uploads/${req.file.filename}`;

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