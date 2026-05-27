import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">

      <h1 className="text-4xl font-bold mb-4">
        Welcome {user?.name}
      </h1>

      <p className="text-gray-400 mb-8">
        DevFlowAI Dashboard
      </p>

      <button
        onClick={handleLogout}
        className="bg-red-500 px-6 py-3 rounded-lg"
      >
        Logout
      </button>

    </div>
  );
};

export default Dashboard;