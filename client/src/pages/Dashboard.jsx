import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import TaskCalendar from "../components/TaskCalendar";

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
  updateTask,
} from "../services/taskService";

import {
  FolderKanban,
  Search,
  LogOut,
  Pencil,
  Trash2,
  Plus,
  Bell,
  CheckCircle2,
  Clock3,
  Loader2,
  ListTodo,
  User,
  Sun,
  Moon,
  Settings,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

import {
  getNotifications,
  markNotificationRead,
} from "../services/notificationService";

import { getMessages, sendMessage } from "../services/chatService";

import { generateAITasks } from "../services/aiService";

import { uploadTaskFile } from "../services/taskService";

import { downloadReport } from "../services/reportService";

import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [editId, setEditId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [tasks, setTasks] = useState({});
  const [editingTask, setEditingTask] = useState(null);
  const [memberEmail, setMemberEmail] = useState("");
  const [assignedUser, setAssignedUser] = useState("");
  const [messages, setMessages] = useState({});
  const [chatInput, setChatInput] = useState({});
  const allTasks = Object.values(tasks).flat();
  const [editTaskData, setEditTaskData] = useState({
    title: "",
    description: "",
    status: "Pending",
  });

  const fetchMessages = async (projectId) => {
    try {
      const { data } = await getMessages(projectId);

      setMessages((prev) => ({
        ...prev,
        [projectId]: data,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const { data } = await getNotifications();

      setNotifications(data);
    } catch (error) {
      console.log(error);
    }
  };

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
      alert(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
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
    socket.on("taskCreated", () => {
      fetchProjects();
    });

    socket.on("taskUpdated", () => {
      fetchProjects();
    });

    socket.on("taskDeleted", () => {
      fetchProjects();
    });

    return () => {
      socket.off("taskCreated");
      socket.off("taskUpdated");
      socket.off("taskDeleted");
    };
  }, []);

  useEffect(() => {
    fetchProjects();
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // FILTER PROJECTS
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "All" ? true : project.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  // STATS
  const stats = useMemo(() => {
    let totalTasks = 0;
    let completedTasks = 0;

    Object.values(tasks).forEach((projectTasks) => {
      totalTasks += projectTasks.length;
      completedTasks += projectTasks.filter(
        (task) => task.status === "Completed",
      ).length;
    });

    return {
      totalProjects: projects.length,
      totalTasks,
      completedTasks,
    };
  }, [projects, tasks]);

  const comletationRate =
    stats.totalTasks > 0
      ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
      : 0;

  const projectAnalytics = [
    {
      name: "Pending",
      value: projects.filter((p) => p.status === "Pending").length,
    },
    {
      name: "In Progress",
      value: projects.filter((p) => p.status === "In Progress").length,
    },
    {
      name: "Completed",
      value: projects.filter((p) => p.status === "Completed").length,
    },
  ];

  const taskAnalytics = [
    {
      name: "Pending",
      value: allTasks.filter((t) => t.status === "Pending").length,
    },
    {
      name: "In Progress",
      value: allTasks.filter((t) => t.status === "In Progress").length,
    },
    {
      name: "Completed",
      value: allTasks.filter((t) => t.status === "Completed").length,
    },
  ];

  const overdueTasks = allTasks.filter(
    (task) =>
      task.dueDate &&
      new Date(task.dueDate) < new Date() &&
      task.status !== "Completed",
  ).length;

  const priorityAnalytics = [
    {
      name: "Low",
      value: allTasks.filter((t) => t.priority === "Low").length,
    },
    {
      name: "Medium",
      value: allTasks.filter((t) => t.priority === "Medium").length,
    },
    {
      name: "High",
      value: allTasks.filter((t) => t.priority === "High").length,
    },
  ];

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
      "Are you sure you want to delete this project?",
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
  const handleTaskInputChange = (projectId, field, value) => {
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

      if (!currentTask?.title || !currentTask?.description) {
        return toast.error("Please fill all task fields");
      }

      console.log("Current Task:", currentTask);

      await createTask({
        title: currentTask.title,
        description: currentTask.description,
        status: currentTask.status || "Pending",
        priority: currentTask.priority || "Medium",
        dueDate: currentTask.dueDate || null,
        project: projectId,
        assignedTo: currentTask.assignedTo, // <-- ADD THIS
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

  // EDIT TASK
  const handleTaskEdit = (task) => {
    setEditingTask(task._id);
    setEditTaskData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
    });
  };

  // UPDATE TASK
  const handleTaskUpdate = async (taskId, projectId) => {
    try {
      console.log("Updating Task:", taskId, editTaskData);

      await updateTask(taskId, editTaskData);

      toast.success("Task Updated");

      setEditingTask(null);

      fetchTasks(projectId);
    } catch (error) {
      toast.error("Task Update Failed");
    }
  };

  // DELETE TASK
  const handleTaskDelete = async (taskId, projectId) => {
    try {
      await deleteTask(taskId);
      toast.success("Task Deleted");
      fetchTasks(projectId);
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const handleFileUpload = async (e, taskId, projectId) => {
    try {
      const file = e.target.files[0];

      if (!file) return;

      const formData = new FormData();

      formData.append("file", file);

      await uploadTaskFile(taskId, formData);

      toast.success("File Uploaded");

      fetchTasks(projectId);
    } catch (error) {
      console.log(error);

      toast.error("Upload Failed");
    }
  };

  const handleSendMessage = async (projectId) => {
    try {
      console.log("Sending message...");

      const message = chatInput[projectId];

      if (!message) return;

      await sendMessage({
        projectId,
        text: message,
      });

      setChatInput((prev) => ({
        ...prev,
        [projectId]: "",
      }));

      fetchMessages(projectId);
    } catch (error) {
      console.log(error);
    }
  };

  // DRAG & DROP
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId;

    try {
      await updateTask(taskId, {
        status: newStatus,
      });
      toast.success("Task Status Updated");
      fetchProjects();
    } catch (error) {
      toast.error("Drag update failed");
    }
  };

  // GENERATE AI TASKs
  const handleGenerateAI = async (projectId, projectTitle) => {
    try {
      const data = await generateAITasks(projectTitle);

      console.log("AI Tasks:", data.tasks);

      for (const task of data.tasks) {
        console.log("Creating:", task);

        await createTask({
          title: task.title,
          description: task.description,
          status: task.status,
          project: projectId,
        });
      }

      toast.success("AI Tasks Generated");

      fetchTasks(projectId);
    } catch (error) {
      console.log(error);
    }
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleAddMember = async (projectId, email) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:5000/api/projects/${projectId}/member`,
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Member Added");

      fetchProjects();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message);
    }
  };

  return (
    <div
      className={`min-h-screen p-4 md:p-8 ${
        darkMode ? "bg-slate-900 text-white" : "bg-white text-black"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* TOP BAR */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-black flex items-center gap-3">
              <FolderKanban className="text-blue-500" size={40} />
              Welcome {user?.name}
            </h1>
            <p className="text-slate-400 mt-3 text-lg">DevFlowAI Dashboard</p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative"
            >
              <Bell size={28} />

              {notifications.filter((n) => !n.isRead).length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
                  {notifications.filter((n) => !n.isRead).length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-slate-900 border border-slate-700 rounded-xl p-4 z-50 max-h-96 overflow-y-auto">
                <h3 className="font-bold mb-3">Notifications</h3>

                {notifications.length === 0 ? (
                  <p className="text-slate-400">No notifications</p>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className="p-3 border-b border-slate-800"
                    >
                      <p>{notification.message}</p>

                      {!notification.isRead && (
                        <button
                          onClick={async () => {
                            await markNotificationRead(notification._id);

                            fetchNotifications();
                          }}
                          className="text-blue-400 text-sm mt-1"
                        >
                          Mark as Read
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-5 py-3 rounded-xl transition-all font-semibold"
            >
              {darkMode ? (
                <>
                  <Sun size={18} />
                  Dark Mode
                </>
              ) : (
                <>
                  <Moon size={18} />
                  Light Mode
                </>
              )}
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl transition-all font-semibold"
            >
              <User size={18} />
              Profile
            </button>

            <button
              onClick={() => navigate("/settings")}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-5 py-3 rounded-xl transition-all font-semibold"
            >
              <Settings size={18} />
              Settings
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-5 py-3 rounded-xl transition-all font-semibold"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Projects</p>
                <h2 className="text-3xl font-bold mt-2">
                  {stats.totalProjects}
                </h2>
              </div>
              <FolderKanban className="text-blue-500" size={35} />
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Tasks</p>
                <h2 className="text-3xl font-bold mt-2">{stats.totalTasks}</h2>
              </div>
              <ListTodo className="text-yellow-400" size={35} />
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Completed Tasks</p>
                <h2 className="text-3xl font-bold mt-2">
                  {stats.completedTasks}
                </h2>
              </div>
              <CheckCircle2 className="text-green-500" size={35} />
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Overdue Tasks</p>
                <h2 className="text-3xl font-bold mt-2">{overdueTasks}</h2>
              </div>
              <Clock3 className="text-red-500" size={35} />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl mb-10">
          <div className="flex justify-between mb-2">
            <h3 className="font-semibol">Task Completion Rate</h3>

            <span className="text-green-400 font-bold">{comletationRate}%</span>
          </div>

          <div className="w-full bg-slate-700 rounded-full h-4">
            <div
              className="bg-green-500 h-4 rounded-full transition-all duration-500"
              style={{
                width: `${comletationRate}%`,
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          {/* PROJECT Chart */}

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <h3 className="text-xl font-bold mb-3">
              Project Status Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={projectAnalytics}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {projectAnalytics.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={["#facc15", "#3b82f6", "#22c55e"][index]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* TASK Chart */}

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <h3 className="text-xl font-bold mb-3">Task Status Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={taskAnalytics}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value">
                  {taskAnalytics.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={["#facc15", "#3b82f6", "#22c55e"][index]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upload File */}

        <div className="mt-3">
          <label className="cursor-pointer text-blue-400 text-sm">
            Upload File
          </label>

          <input
            type="file"
            hidden
            onChange={(e) => handleFileUpload(e, "taskId", "projectId")}
          />
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <h3 className="text-xl font-bold mb-3">Task Priority Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={priorityAnalytics}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value">
                {priorityAnalytics.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={["#22c55e", "#eab308", "#ef4444"][index]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PROJECT FORM */}
        <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl mb-10 shadow-2xl border border-slate-800">
          <h2 className="text-2xl font-bold mb-5">
            {editId ? "Update Project" : "Create Project"}
          </h2>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              name="title"
              placeholder="Project title"
              value={formData.title}
              onChange={handleChange}
              className="p-3 rounded-xl bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="description"
              placeholder="Project description"
              value={formData.description}
              onChange={handleChange}
              className="p-3 rounded-xl bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="p-3 rounded-xl bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
            <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 transition-all py-3 rounded-xl col-span-1 md:col-span-3 font-semibold">
              <Plus size={18} />
              {editId ? "Update Project" : "Create Project"}
            </button>
          </form>
        </div>

        <div className="bg-[#0B1739] border border-[#1E2A4A] rounded-3xl p-8 mt-8">
          <h2 className="text-4xl font-bold text-white mb-3">
            🤖 AI Project Planner
          </h2>

          <p className="text-gray-400 mb-6">
            Generate complete project blueprints using AI. Get Features, Tech
            Stack, Database Design, Development Roadmap and Deployment Plan
            instantly.
          </p>

          <button
            onClick={() => navigate("/ai-planner")}
            className="
      bg-linear-to-r
      from-purple-600
      to-blue-600
      hover:scale-105
      transition
      px-8
      py-4
      rounded-xl
      text-white
      font-semibold
    "
          >
            🚀 Generate AI Plan
          </button>
        </div>

        {/* SEARCH + FILTER */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-3.5 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search Projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 p-3 rounded-2xl bg-slate-900 outline-none border border-slate-700 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-3 rounded-2xl bg-slate-900 outline-none border border-slate-700 focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="animate-spin text-blue-500" size={50} />
            <p className="text-slate-400 mt-4 text-xl">Loading Projects...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <div
                  key={project._id}
                  className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-5 rounded-3xl shadow-xl hover:-translate-y-2 hover:shadow-blue-500/10 transition-all duration-300"
                >
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <h2 className="text-2xl font-bold wrap-break-word">
                        {project.title}
                      </h2>
                      <button
                        onClick={() => downloadReport(project._id)}
                        className="bg-purple-600 px-4 py-2 rounded-xl"
                      >
                        📄 Export PDF
                      </button>
                      <input
                        type="email"
                        placeholder="Member email"
                        className="w-full p-2 rounded bg-slate-800 mt-2"
                        value={project.memberEmail || ""}
                        onChange={(e) => {
                          setProjects((prev) =>
                            prev.map((p) =>
                              p._id === project._id
                                ? { ...p, memberEmail: e.target.value }
                                : p,
                            ),
                          );
                        }}
                      />

                      <button
                        onClick={() =>
                          handleAddMember(project._id, project.memberEmail)
                        }
                        className="bg-blue-600 px-3 py-2 rounded mt-2"
                      >
                        Add Member
                      </button>
                      <div className="mt-3">
                        <h4 className="font-semibold">Team Members</h4>

                        {project.members?.map((member) => (
                          <div key={member._id}>👤 {member.name}</div>
                        ))}
                      </div>
                      <p className="text-slate-400 mt-2 text-sm wrap-break-word">
                        {project.description}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap
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
                  </div>

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
                          e.target.value,
                        )
                      }
                      className="w-full p-3 rounded-xl bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Task description"
                      value={taskFormData[project._id]?.description || ""}
                      onChange={(e) =>
                        handleTaskInputChange(
                          project._id,
                          "description",
                          e.target.value,
                        )
                      }
                      className="w-full p-3 rounded-xl bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={taskFormData[project._id]?.status || "Pending"}
                      onChange={(e) =>
                        handleTaskInputChange(
                          project._id,
                          "status",
                          e.target.value,
                        )
                      }
                      className="w-full p-3 rounded-xl bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>

                    <select
                      value={taskFormData[project._id]?.assignedTo || ""}
                      onChange={(e) =>
                        handleTaskInputChange(
                          project._id,
                          "assignedTo",
                          e.target.value,
                        )
                      }
                      className="w-full p-3 rounded-xl bg-slate-800"
                    >
                      <option value="">Assign Member</option>

                      {project.members?.map((member) => (
                        <option key={member._id} value={member._id}>
                          {member.name}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => handleTaskCreate(project._id)}
                      className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 w-full py-3 rounded-xl transition-all font-semibold"
                    >
                      <Plus size={18} />
                      Add Task
                    </button>
                  </div>

                  <select
                    value={taskFormData[project._id]?.priority || "Medium"}
                    onChange={(e) =>
                      handleTaskInputChange(
                        project._id,
                        "priority",
                        e.target.value,
                      )
                    }
                    className="w-full p-3 rounded-xl bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500 mt-3"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>

                  <input
                    type="date"
                    value={taskFormData[project._id]?.dueDate || ""}
                    onChange={(e) =>
                      handleTaskInputChange(
                        project._id,
                        "dueDate",
                        e.target.value,
                      )
                    }
                    className="w-full p-3 rounded-xl bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500 mt-3"
                  />

                  {/* KANBAN BOARD */}
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <div className="mt-6 grid gap-4">
                      {["Pending", "In Progress", "Completed"].map((status) => (
                        <Droppable droppableId={status} key={status}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className="bg-slate-800 p-4 rounded-2xl min-h-40"
                            >
                              <h3
                                className={`text-lg font-bold mb-4 flex items-center gap-2
                                ${
                                  status === "Pending"
                                    ? "text-yellow-400"
                                    : status === "In Progress"
                                      ? "text-blue-400"
                                      : "text-green-400"
                                }`}
                              >
                                {status === "Pending" && <Clock3 size={18} />}
                                {status === "In Progress" && (
                                  <Loader2 size={18} />
                                )}
                                {status === "Completed" && (
                                  <CheckCircle2 size={18} />
                                )}
                                {status}
                              </h3>
                              {tasks[project._id]
                                ?.filter((task) => task.status === status)
                                .map((task, index) => (
                                  <Draggable
                                    key={task._id}
                                    draggableId={String(task._id)}
                                    index={index}
                                  >
                                    {(provided) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className="bg-slate-700 p-4 rounded-2xl mb-3 hover:bg-slate-600 transition-all"
                                      >
                                        {editingTask === task._id ? (
                                          <div className="space-y-3">
                                            <input
                                              type="text"
                                              value={editTaskData.title}
                                              onChange={(e) =>
                                                setEditTaskData({
                                                  ...editTaskData,
                                                  title: e.target.value,
                                                })
                                              }
                                              className="w-full p-2 rounded-lg bg-slate-800 outline-none"
                                            />
                                            <input
                                              type="text"
                                              value={editTaskData.description}
                                              onChange={(e) =>
                                                setEditTaskData({
                                                  ...editTaskData,
                                                  description: e.target.value,
                                                })
                                              }
                                              className="w-full p-2 rounded-lg bg-slate-800 outline-none"
                                            />
                                            <select
                                              value={editTaskData.status}
                                              onChange={(e) =>
                                                setEditTaskData({
                                                  ...editTaskData,
                                                  status: e.target.value,
                                                })
                                              }
                                              className="w-full p-2 rounded-lg bg-slate-800 outline-none"
                                            >
                                              <option>Pending</option>
                                              <option>In Progress</option>
                                              <option>Completed</option>
                                            </select>
                                            <div className="flex gap-2">
                                              <button
                                                onClick={() =>
                                                  handleTaskUpdate(
                                                    task._id,
                                                    project._id,
                                                  )
                                                }
                                                className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg text-sm"
                                              >
                                                Save
                                              </button>
                                              <button
                                                onClick={() =>
                                                  setEditingTask(null)
                                                }
                                                className="bg-gray-500 hover:bg-gray-600 px-3 py-2 rounded-lg text-sm"
                                              >
                                                Cancel
                                              </button>
                                            </div>
                                            <select
                                              value={editTaskData.priority}
                                              onChange={(e) =>
                                                setEditTaskData({
                                                  ...editTaskData,
                                                  priority: e.target.value,
                                                })
                                              }
                                              className="w-full p-2 rounded-lg bg-slate-800 outline-none mt-2"
                                            >
                                              <option>Low</option>
                                              <option>Medium</option>
                                              <option>High</option>
                                            </select>
                                          </div>
                                        ) : (
                                          <>
                                            <h3 className="font-semibold wrap-break-word">
                                              {task.title}
                                            </h3>
                                            <div className="text-blue-400 text-sm mt-1">
                                              👤 Assigned To:
                                              {task.assignedTo?.name ||
                                                "Not Assigned"}
                                            </div>

                                            <span
                                              className={`inline-block mt-2 text-xs px-2 py-1 rounded-full
                                                ${
                                                  task.priority === "High"
                                                    ? "bg-red-500 text-white"
                                                    : task.priority === "Medium"
                                                      ? "bg-yellow-500 text-black"
                                                      : "bg-green-500 text-white"
                                                }`}
                                            >
                                              {task.priority}
                                            </span>

                                            <p className="text-sm text-slate-300 mt-1 wrap-break-word">
                                              {task.description}
                                            </p>

                                            {/* FILE UPLOAD */}
                                            <div className="mt-3">
                                              <label className="cursor-pointer text-blue-400 text-sm">
                                                📎 Upload Attachment
                                                <input
                                                  type="file"
                                                  hidden
                                                  onChange={(e) =>
                                                    handleFileUpload(
                                                      e,
                                                      task._id,
                                                      project._id,
                                                    )
                                                  }
                                                />
                                              </label>
                                            </div>

                                            {/* ATTACHMENTS */}
                                            {task.attachments?.length > 0 && (
                                              <div className="mt-2 space-y-2">
                                                {task.attachments.map(
                                                  (file, index) => (
                                                    <div key={index}>
                                                      <img
                                                        src={file.url}
                                                        alt={file.filename}
                                                        className="w-full h-32 object-cover rounded-lg mb-1"
                                                      />

                                                      <a
                                                        href={file.url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="block text-xs text-green-400 hover:underline"
                                                      >
                                                        📄 {file.filename}
                                                      </a>
                                                    </div>
                                                  ),
                                                )}
                                              </div>
                                            )}

                                            {task.dueDate && (
                                              <p className="text-xs text-slate-400 mt-2">
                                                Due:{" "}
                                                {new Date(
                                                  task.dueDate,
                                                ).toLocaleDateString()}
                                              </p>
                                            )}
                                            <div className="flex flex-wrap gap-2 mt-4">
                                              <button
                                                onClick={() =>
                                                  handleTaskEdit(task)
                                                }
                                                className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded-lg text-sm"
                                              >
                                                <Pencil size={14} />
                                                Edit
                                              </button>
                                              <button
                                                onClick={() =>
                                                  handleTaskDelete(
                                                    task._id,
                                                    project._id,
                                                  )
                                                }
                                                className="flex items-center gap-1 bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg text-sm"
                                              >
                                                <Trash2 size={14} />
                                                Delete
                                              </button>
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                              {provided.placeholder}
                              {tasks[project._id]?.filter(
                                (task) => task.status === status,
                              ).length === 0 && (
                                <p className="text-slate-500 text-sm">
                                  No tasks
                                </p>
                              )}
                            </div>
                          )}
                        </Droppable>
                      ))}
                    </div>
                  </DragDropContext>

                  {
                    <div className="mt-6">
                      <h3 className="font-bold mb-2">Team Chat</h3>

                      <div className="bg-slate-800 rounded-xl p-3 h-48 overflow-y-auto">
                        {messages[project._id]?.map((msg) => (
                          <div key={msg._id} className="mb-2">
                            <span className="text-blue-400">
                              {msg.sender?.name}
                            </span>

                            <p>{msg.text}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex mt-2">
                        <input
                          type="text"
                          placeholder="Type message..."
                          value={chatInput[project._id] || ""}
                          onChange={(e) =>
                            setChatInput((prev) => ({
                              ...prev,
                              [project._id]: e.target.value,
                            }))
                          }
                        />

                        <button
                          onClick={() => {
                            console.log("SEND CLICKED");
                            handleSendMessage(project._id);
                          }}
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  }

                  {/* FOOTER */}
                  <div className="flex justify-between items-center mt-6 gap-3">
                    <button
                      onClick={() =>
                        handleGenerateAI(project._id, project.title)
                      }
                      className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl transition-all w-full"
                    >
                      <Plus size={16} />
                      Generate AI Tasks
                    </button>
                    <button
                      onClick={() => handleEdit(project)}
                      className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-xl transition-all w-full"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl transition-all w-full"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-24">
                <FolderKanban className="mx-auto text-slate-600" size={70} />
                <h2 className="text-3xl font-bold text-slate-300 mt-5">
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
      {/* CALENDAR VIEW */}
      <div className="mt-12">
        <div className="bg-linear-to-br from-slate-900 to-slate-950 border border-slate-700 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-bold text-white">
                📅 Calendar View
              </h2>

              <p className="text-slate-400 mt-2">
                Track deadlines and upcoming project tasks
              </p>
            </div>

            <div className="bg-blue-600 px-4 py-2 rounded-xl text-white font-semibold">
              {allTasks.length} Tasks
            </div>
          </div>

          <TaskCalendar tasks={allTasks} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
