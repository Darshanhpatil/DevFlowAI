import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import {
  createProject,
  getProjects,
  deleteProject,
} from "../services/projectService";

function Dashboard() {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [projects, setProjects] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Pending",
  });


  // FETCH PROJECTS
  const fetchProjects = async () => {

    try {

      const data = await getProjects();

      setProjects(data);

    } catch (error) {

      toast.error("Failed to load projects");

    }
  };


  useEffect(() => {
    fetchProjects();
  }, []);


  // HANDLE CHANGE
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };


  // CREATE PROJECT
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await createProject(formData);

      toast.success("Project Created");

      setFormData({
        title: "",
        description: "",
        status: "Pending",
      });

      fetchProjects();

    } catch (error) {

      toast.error("Failed to create project");

    }
  };


  // DELETE PROJECT
  const handleDelete = async (id) => {

    try {

      await deleteProject(id);

      toast.success("Project Deleted");

      fetchProjects();

    } catch (error) {

      toast.error("Delete failed");

    }
  };


  // LOGOUT
  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/login");

  };


  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">

      <div className="max-w-6xl mx-auto">

        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-10">

          <div>
            <h1 className="text-4xl font-bold">
              Welcome {user?.name}
            </h1>

            <p className="text-slate-400 mt-2">
              DevFlowAI Dashboard
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 px-5 py-2 rounded-lg"
          >
            Logout
          </button>

        </div>


        {/* CREATE PROJECT */}
        <div className="bg-slate-900 p-6 rounded-2xl mb-10">

          <h2 className="text-2xl font-bold mb-5">
            Create Project
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid md:grid-cols-3 gap-4"
          >

            <input
              type="text"
              name="title"
              placeholder="Project title"
              value={formData.title}
              onChange={handleChange}
              className="p-3 rounded-lg bg-slate-800 outline-none"
            />

            <input
              type="text"
              name="description"
              placeholder="Project description"
              value={formData.description}
              onChange={handleChange}
              className="p-3 rounded-lg bg-slate-800 outline-none"
            />

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="p-3 rounded-lg bg-slate-800 outline-none"
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>

            <button
              className="bg-blue-600 py-3 rounded-lg col-span-1 md:col-span-3"
            >
              Create Project
            </button>

          </form>

        </div>


        {/* PROJECT LIST */}
        <div className="grid md:grid-cols-3 gap-5">

          {projects.map((project) => (

            <div
              key={project._id}
              className="bg-slate-900 p-5 rounded-2xl"
            >

              <h2 className="text-2xl font-bold">
                {project.title}
              </h2>

              <p className="text-slate-400 mt-3">
                {project.description}
              </p>

              <div className="flex justify-between items-center mt-5">

                <span className="bg-slate-800 px-3 py-1 rounded-lg text-sm">
                  {project.status}
                </span>

                <button
                  onClick={() => handleDelete(project._id)}
                  className="bg-red-500 px-4 py-2 rounded-lg"
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default Dashboard;