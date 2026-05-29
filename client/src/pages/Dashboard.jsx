import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import {
  getProjects,
  createProject,
  deleteProject,
  updateProject,
} from "../services/projectService";

import {
  createTask,
  getTasks,
  deleteTask,
} from "../services/taskService";

function Dashboard() {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  const [filterStatus, setFilterStatus] = useState("All");

  const [editId, setEditId] = useState(null);

  const [tasks, setTasks] = useState({});

  // PROJECT FORM
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Pending",
  });

  // TASK FORM
  const [taskFormData, setTaskFormData] = useState({});

  // FETCH TASKS
  const fetchTasks = async (projectId) => {

    try {

      const data = await getTasks(projectId);

      setTasks((prev) => ({
        ...prev,
        [projectId]: data,
      }));

    } catch (error) {

      console.log(error);

    }
  };

  // FETCH PROJECTS
  const fetchProjects = async () => {

    try {

      setLoading(true);

      const data = await getProjects();

      setProjects(data);

      data.forEach((project) => {
        fetchTasks(project._id);
      });

    } catch (error) {

      toast.error("Failed to load projects");

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // FILTERED PROJECTS
  const filteredProjects = projects.filter((project) => {

    const matchesSearch =
      project.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "All"
        ? true
        : project.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  // PROJECT INPUT CHANGE
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  // CREATE / UPDATE PROJECT
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (editId) {

        await updateProject(editId, formData);

        toast.success("Project Updated");

        setEditId(null);

      } else {

        await createProject(formData);

        toast.success("Project Created");

      }

      setFormData({
        title: "",
        description: "",
        status: "Pending",
      });

      fetchProjects();

    } catch (error) {

      toast.error("Something went wrong");

    }
  };

  // DELETE PROJECT
  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmDelete) return;

    try {

      await deleteProject(id);

      toast.success("Project Deleted");

      fetchProjects();

    } catch (error) {

      toast.error("Delete failed");

    }
  };

  // EDIT PROJECT
  const handleEdit = (project) => {

    setEditId(project._id);

    setFormData({
      title: project.title,
      description: project.description,
      status: project.status,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // TASK INPUT CHANGE
  const handleTaskInputChange = (
    projectId,
    field,
    value
  ) => {

    setTaskFormData((prev) => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        [field]: value,
      },
    }));

  };

  // CREATE TASK
  const handleTaskCreate = async (projectId) => {

    try {

      const currentTask = taskFormData[projectId];

      if (
        !currentTask?.title ||
        !currentTask?.description
      ) {
        return toast.error("Please fill all task fields");
      }

      await createTask({
        title: currentTask.title,
        description: currentTask.description,
        status: currentTask.status || "Pending",
        project: projectId,
      });

      toast.success("Task Created");

      setTaskFormData((prev) => ({
        ...prev,
        [projectId]: {
          title: "",
          description: "",
          status: "Pending",
        },
      }));

      fetchTasks(projectId);

    } catch (error) {

      console.log(error);

      toast.error("Failed to create task");

    }
  };

  // DELETE TASK
  const handleTaskDelete = async (
    taskId,
    projectId
  ) => {

    try {

      await deleteTask(taskId);

      toast.success("Task Deleted");

      fetchTasks(projectId);

    } catch (error) {

      toast.error("Failed to delete task");

    }
  };

  // LOGOUT
  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/login");

  };

  return (

    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">

      <div className="max-w-7xl mx-auto">

        {/* TOP BAR */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-5 mb-10">

          <div>

            <h1 className="text-3xl md:text-4xl font-bold">
              Welcome {user?.name}
            </h1>

            <p className="text-slate-400 mt-2">
              DevFlowAI Dashboard
            </p>

          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg transition-all"
          >
            Logout
          </button>

        </div>

        {/* PROJECT FORM */}
        <div className="bg-slate-900 p-6 rounded-2xl mb-10 shadow-lg">

          <h2 className="text-2xl font-bold mb-5">

            {editId ? "Update Project" : "Create Project"}

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
              className="p-3 rounded-lg bg-slate-800 outline-none border border-transparent focus:border-blue-500"
              required
            />

            <input
              type="text"
              name="description"
              placeholder="Project description"
              value={formData.description}
              onChange={handleChange}
              className="p-3 rounded-lg bg-slate-800 outline-none border border-transparent focus:border-blue-500"
              required
            />

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="p-3 rounded-lg bg-slate-800 outline-none border border-transparent focus:border-blue-500"
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>

            <button
              className="bg-blue-600 hover:bg-blue-700 transition-all py-3 rounded-lg col-span-1 md:col-span-3 font-semibold"
            >
              {editId ? "Update Project" : "Create Project"}
            </button>

          </form>

        </div>

        {/* SEARCH + FILTER */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">

          <input
            type="text"
            placeholder="Search Projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-3 rounded-xl bg-slate-900 outline-none border border-slate-700"
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-3 rounded-xl bg-slate-900 outline-none border border-slate-700"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

        </div>

        {/* LOADING */}
        {loading ? (

          <div className="text-center text-2xl text-slate-400 py-20 animate-pulse">
            Loading Projects...
          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

            {filteredProjects.length > 0 ? (

              filteredProjects.map((project) => (

                <div
                  key={project._id}
                  className="bg-slate-900 p-5 rounded-2xl shadow-lg hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 ease-in-out"
                >

                  <h2 className="text-2xl font-bold">
                    {project.title}
                  </h2>

                  <p className="text-slate-400 mt-2">
                    {project.description}
                  </p>

                  {/* TASK FORM */}
                  <div className="mt-5 space-y-3">

                    <input
                      type="text"
                      placeholder="Task title"
                      value={taskFormData[project._id]?.title || ""}
                      onChange={(e) =>
                        handleTaskInputChange(
                          project._id,
                          "title",
                          e.target.value
                        )
                      }
                      className="w-full p-2 rounded-lg bg-slate-800 outline-none"
                    />

                    <input
                      type="text"
                      placeholder="Task description"
                      value={taskFormData[project._id]?.description || ""}
                      onChange={(e) =>
                        handleTaskInputChange(
                          project._id,
                          "description",
                          e.target.value
                        )
                      }
                      className="w-full p-2 rounded-lg bg-slate-800 outline-none"
                    />

                    <select
                      value={
                        taskFormData[project._id]?.status || "Pending"
                      }
                      onChange={(e) =>
                        handleTaskInputChange(
                          project._id,
                          "status",
                          e.target.value
                        )
                      }
                      className="w-full p-2 rounded-lg bg-slate-800 outline-none"
                    >
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>

                    <button
                      onClick={() => handleTaskCreate(project._id)}
                      className="bg-blue-600 hover:bg-blue-700 w-full py-2 rounded-lg transition-all"
                    >
                      Add Task
                    </button>

                  </div>

                  {/* TASK LIST */}
                  <div className="mt-5 space-y-3">

                    {tasks[project._id]?.length > 0 ? (

                      tasks[project._id].map((task) => (

                        <div
                          key={task._id}
                          className="bg-slate-800 p-3 rounded-lg"
                        >

                          <h3 className="font-semibold">
                            {task.title}
                          </h3>

                          <p className="text-sm text-slate-400 mt-1">
                            {task.description}
                          </p>

                          <div className="flex justify-between items-center mt-3">

                            <span
                              className={`px-2 py-1 rounded text-xs
                              ${
                                task.status === "Completed"
                                  ? "bg-green-600"
                                  : task.status === "In Progress"
                                  ? "bg-blue-600"
                                  : "bg-yellow-500 text-black"
                              }`}
                            >
                              {task.status}
                            </span>

                            <button
                              onClick={() =>
                                handleTaskDelete(
                                  task._id,
                                  project._id
                                )
                              }
                              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg text-sm transition-all"
                            >
                              Delete
                            </button>

                          </div>

                        </div>

                      ))

                    ) : (

                      <p className="text-slate-500 text-sm">
                        No Tasks Yet
                      </p>

                    )}

                  </div>

                  {/* FOOTER */}
                  <div className="flex justify-between items-center mt-5">

                    <span
                      className={`px-3 py-1 rounded-lg text-sm
                      ${
                        project.status === "Completed"
                          ? "bg-green-600"
                          : project.status === "In Progress"
                          ? "bg-blue-600"
                          : "bg-yellow-500 text-black"
                      }`}
                    >
                      {project.status}
                    </span>

                    <div className="flex gap-2">

                      <button
                        onClick={() => handleEdit(project)}
                        className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg transition-all"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(project._id)}
                        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-all"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </div>

              ))

            ) : (

              <div className="col-span-full text-center py-20">

                <h2 className="text-3xl font-bold text-slate-300">
                  No Projects Found
                </h2>

                <p className="text-slate-500 mt-3">
                  Create your first project 🚀
                </p>

              </div>

            )}

          </div>

        )}

      </div>

    </div>

  );
}

export default Dashboard;