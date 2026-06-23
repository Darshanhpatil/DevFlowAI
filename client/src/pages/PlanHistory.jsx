import { useEffect, useState } from "react";
import { getHistory } from "../services/aiPlannerService";

function PlanHistory() {

  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {

    try {

      const data = await getHistory();

      setPlans(data.plans);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container py-4">

      <h2 className="mb-4">
        AI Plan History
      </h2>

      {plans.length === 0 ? (

        <div className="alert alert-info">
          No AI Plans Found
        </div>

      ) : (

        plans.map((plan) => (

          <div
            key={plan._id}
            className="card shadow-sm mb-3 p-3"
          >
            <h4>
              {plan.projectTitle}
            </h4>

            <p>
              {plan.description}
            </p>

            <small className="text-muted">
              {new Date(
                plan.createdAt
              ).toLocaleString()}
            </small>
          </div>

        ))

      )}

    </div>
  );
}

export default PlanHistory;