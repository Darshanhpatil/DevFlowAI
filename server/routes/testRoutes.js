import express from "express";
import sendEmail from "../utils/sendEmail.js";

const router = express.Router();

router.get("/send-email", async (req, res) => {
  try {
    await sendEmail(
      "darshanhpatil2026@gmail.com",
      "DevFlowAI Test",
      "Email system is working 🚀"
    );

    res.json({
      message: "Email sent",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

export default router;