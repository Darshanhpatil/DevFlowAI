import cron from "node-cron";
import Task from "../models/Task.js";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

cron.schedule("0 9 * * *", async () => {
  console.log("Checking due tasks...");

  const tomorrow = new Date();

  tomorrow.setDate(
    tomorrow.getDate() + 1
  );

  const tasks = await Task.find();

  for (const task of tasks) {
    if (!task.dueDate) continue;

    const dueDate = new Date(
      task.dueDate
    );

    if (
      dueDate.toDateString() ===
      tomorrow.toDateString()
    ) {
      const user = await User.findById(
        task.user
      );

      if (user) {
        await sendEmail(
          user.email,
          "Task Reminder",
          `Your task "${task.title}" is due tomorrow.`
        );
      }
    }
  }
});