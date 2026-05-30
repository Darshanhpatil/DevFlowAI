import axios from "axios";

const API = "http://localhost:5000/api/ai";

export const generateAITasks = async (projectTitle) => {
  const token = localStorage.getItem("token");

  const res = await axios.post(
    `${API}/generate-tasks`,
    { projectTitle },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};