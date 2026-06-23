import mongoose from "mongoose";

const aiPlanSchema =
  new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      projectTitle: {
        type: String,
      },

      description: {
        type: String,
      },

      plan: {
        type: Object,
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "AIPlan",
  aiPlanSchema
);