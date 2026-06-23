import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generatePlan } from "../services/aiPlannerService";

const AIPlanner = () => {

  const navigate = useNavigate();

  const [projectTitle, setProjectTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const data =
        await generatePlan({
          projectTitle,
          description,
        });

      navigate("/plan-result", {
        state: {
          plan: data.plan,
        },
      });

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="container py-4">

      <div className="card shadow p-4">

        <h2 className="mb-4">
          AI Project Planner
        </h2>

        <form onSubmit={handleSubmit}>

          <div className="mb-3">

            <label>
              Project Title
            </label>

            <input
              className="form-control"
              value={projectTitle}
              onChange={(e) =>
                setProjectTitle(
                  e.target.value
                )
              }
            />

          </div>

          <div className="mb-3">

            <label>
              Description
            </label>

            <textarea
              rows="5"
              className="form-control"
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
            />

          </div>

          <button
            className="btn btn-primary"
            disabled={loading}
          >
            {loading
              ? "Generating..."
              : "Generate Plan"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default AIPlanner;