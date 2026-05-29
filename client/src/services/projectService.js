import axios from "axios";

const API = "http://localhost:5000/api/projects";

// GET TOKEN
const getToken = () => {
  return localStorage.getItem("token");
};

// GET PROJECTS
export const getProjects = async () => {

  const response = await axios.get(API, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};

// CREATE PROJECT
export const createProject = async (projectData) => {

  const response = await axios.post(
    API,
    projectData,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};

// DELETE PROJECT
export const deleteProject = async (id) => {

  const response = await axios.delete(
    `${API}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};

// UPDATE PROJECT
export const updateProject = async (id, projectData) => {

  const response = await axios.put(
    `${API}/${id}`,
    projectData,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};