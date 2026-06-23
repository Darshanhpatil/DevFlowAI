import axios from "axios";

const API = "http://localhost:5000/api/ai-planner";

export const generatePlan = async (data) => {
  const token = localStorage.getItem("token");

  const res = await axios.post(
    `${API}/generate`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const getHistory = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get(
    `${API}/history`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};