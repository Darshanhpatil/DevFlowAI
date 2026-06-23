import {
  generateProjectTasks,
} from "../services/aiService.js";

export const generateTasks = async (
  req,
  res
) => {
  try {
    const { projectTitle } = req.body;

    console.log("Project:", projectTitle);

    const result =
      await generateProjectTasks(
        projectTitle
      );

    console.log(
      "AI Response:",
      result
    );

    const tasks =
      JSON.parse(result);

    res.json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.log("AI ERROR:");
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};