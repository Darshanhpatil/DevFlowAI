import { generateProjectPlan } from "../services/aiPlannerService.js";

import AIPlan from "../models/AIPlan.js";

export const generatePlan = async (req, res) => {
  console.log("AI PLANNER HIT");

  try {
    const { projectTitle, description } = req.body;

    const plan = await generateProjectPlan(projectTitle, description);

    const savedPlan = await AIPlan.create({
      user: req.user._id,
      projectTitle,
      description,
      plan,
    });

    console.log("PLAN SAVED:", savedPlan);

    res.json({
      success: true,
      plan,
    });
  } catch (error) {
    console.log("AI PLANNER ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPlans = async (req, res) => {
  try {
    const plans = await AIPlan.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      plans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
