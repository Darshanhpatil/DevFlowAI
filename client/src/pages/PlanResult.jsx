import { useLocation } from "react-router-dom";

function PlanResult() {
  const location = useLocation();

  const plan = location.state?.plan;

  console.log(plan);

  if (!plan) {
    return (
      <div className="p-10 text-white">
        No plan found
      </div>
    );
  }

  return (
    <div className="p-8 text-white">

      <h1 className="text-4xl font-bold mb-8">
        🚀 Generated Project Plan
      </h1>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-3">
          Overview
        </h2>

        <p>{plan.overview}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-3">
          Features
        </h2>

        <ul>
          {plan.features?.map((item, index) => (
            <li key={index}>
              ✅ {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-3">
          Tech Stack
        </h2>

        <ul>
          {plan.techStack?.map((item, index) => (
            <li key={index}>
              ⚙️ {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-3">
          Database Tables
        </h2>

        <ul>
          {plan.databaseTables?.map((item, index) => (
            <li key={index}>
              🗄️ {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-3">
          Development Roadmap
        </h2>

        <ul>
          {plan.roadmap?.map((item, index) => (
            <li key={index}>
              📌 {item}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-3">
          Deployment Plan
        </h2>

        <p>{plan.deployment}</p>
      </div>

    </div>
  );
}

export default PlanResult;