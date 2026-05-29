import axios from "axios";

const API = "http://localhost:5000/api/tasks";

// CREATE TASK
export const createTask = async (taskData) => {

  const token = localStorage.getItem("token");

  const { data } = await axios.post(
    API,
    taskData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};

// GET TASKS
export const getTasks = async (projectId) => {

  const token = localStorage.getItem("token");

  const { data } = await axios.get(
    `${API}/${projectId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};

// DELETE TASK
export const deleteTask = async (taskId) => {

  const token = localStorage.getItem("token");

  const { data } = await axios.delete(
    `${API}/${taskId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};

// UPDATE TASK
export const updateTask = async (
  taskId,
  updatedData
) => {

  const token = localStorage.getItem("token");

  const { data } = await axios.put(
    `${API}/${taskId}`,
    updatedData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};