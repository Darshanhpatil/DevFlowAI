import axios from "axios";

const API = "http://localhost:5000/api/tasks";

// GET TOKEN
const getToken = () => {
  return localStorage.getItem("token");
};

// CREATE TASK
export const createTask = async (taskData) => {

  const response = await axios.post(
    API,
    taskData,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};

// GET TASKS
export const getTasks = async (projectId) => {

  const response = await axios.get(
    `${API}/${projectId}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};

// DELETE TASK
export const deleteTask = async (taskId) => {

  const response = await axios.delete(
    `${API}/${taskId}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};