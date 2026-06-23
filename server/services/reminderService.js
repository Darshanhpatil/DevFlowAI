import cron from "node-cron";
import Task from "../models/Task.js";
import sendEmail from "../utils/sendEmail.js";

export const startReminderJob = () => {

  cron.schedule("0 9 * * *", async () => {

    console.log(
      "Checking due tasks..."
    );

    const tomorrow = new Date();

    tomorrow.setDate(
      tomorrow.getDate() + 1
    );

    const start = new Date(
      tomorrow.setHours(
        0,
        0,
        0,
        0
      )
    );

    const end = new Date(
      tomorrow.setHours(
        23,
        59,
        59,
        999
      )
    );

    const tasks =
      await Task.find({
        dueDate: {
          $gte: start,
          $lte: end,
        },
      })
      .populate(
        "assignedTo",
        "name email"
      );

    for (const task of tasks) {

      if (
        !task.assignedTo
      )
        continue;

      await sendEmail(
        task.assignedTo.email,

        "Task Due Tomorrow ⏰",

        `
Hello ${task.assignedTo.name},

Reminder:

Task: ${task.title}

Due Date:
${new Date(
  task.dueDate
).toDateString()}

Please complete it on time.

Regards,
DevFlow AI
`
      );
    }
  });
};