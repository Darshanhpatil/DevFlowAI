import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  FolderKanban,
  ListTodo,
  CheckCircle2,
  Lock,
  Save,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { getProjects } from "../services/projectService";
import { getTasks } from "../services/taskService";

import { getActivities } from "../services/activityService";

import {
  getProfile,
  updateProfile,
  changePassword,
} from "../services/userService";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [productivityScore, setProductivityScore] =
  useState(0);

  const [stats, setStats] = useState({
    projects: 0,
    tasks: 0,
    completedTasks: 0,
  });

  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [activities, setActivities] = useState([]);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    fetchProfile();
    fetchStats();
    fetchActivities(); 
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getProfile();

      setUser(data);
      setName(data.name);
      setProfilePic(data.profilePic || "");

    } catch (error) {
      console.log(error);
    }
  };

  const fetchStats = async () => {
    try {
      const projects = await getProjects();

      let totalTasks = 0;
      let completedTasks = 0;

      for (const project of projects) {
        const tasks = await getTasks(project._id);

        totalTasks += tasks.length;

        completedTasks += tasks.filter(
          (task) => task.status === "Completed"
        ).length;
      }

      const score =
        totalTasks === 0
          ? 0
          : Math.round(
             (completedTasks / totalTasks) * 100
            );
      setProductivityScore(score);


      setStats({
        projects: projects.length,
        tasks: totalTasks,
        completedTasks,
      });

    } catch (error) {
      console.log(error);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const formData = new FormData();

      formData.append("name", name);

      if (selectedFile) {
        formData.append("profilePic", selectedFile);
      }

      const updatedUser = await updateProfile(formData);

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      toast.success("Profile Updated");

      fetchProfile();

    } catch (error) {
      console.log(error);
      toast.error("Update Failed");
    }
  };

  const handlePasswordChange = async () => {
    try {
      await changePassword(passwordData);

      toast.success("Password Updated");

      setPasswordData({
        oldPassword: "",
        newPassword: "",
      });

    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        "Password Change Failed"
      );
    }
  };

  const fetchActivities = async () => {
    try {
      const data =
        await getActivities();
      setActivities(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto">

        {/* TOP BAR */}

        <div className="flex justify-between items-center mb-8">

          <h1 className="text-4xl font-bold">
            My Profile
          </h1>

          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl"
          >
            <ArrowLeft size={18} />
            Dashboard
          </button>

        </div>

        {/* PROFILE CARD */}

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 mb-8">

          <div className="flex flex-col md:flex-row items-center gap-6">

            {profilePic ? (
              <img
                src={profilePic}
                alt="profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-blue-600 flex items-center justify-center text-5xl font-bold">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
            )}

            <div>

              <h2 className="text-3xl font-bold">
                {user?.name}
              </h2>

              <p className="text-slate-400 mt-2">
                {user?.email}
              </p>

            </div>

          </div>

        </div>

        {/* STATS */}

        <div className="grid md:grid-cols-3 gap-5 mb-8">

          <div className="bg-slate-900 p-6 rounded-2xl">
            <FolderKanban
              size={35}
              className="text-blue-500"
            />
            <h3 className="mt-3">Projects</h3>
            <p className="text-3xl font-bold">
              {stats.projects}
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl">
            <ListTodo
              size={35}
              className="text-yellow-500"
            />
            <h3 className="mt-3">Tasks</h3>
            <p className="text-3xl font-bold">
              {stats.tasks}
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl">
            <CheckCircle2
              size={35}
              className="text-green-500"
            />
            <h3 className="mt-3">Completed</h3>
            <p className="text-3xl font-bold">
              {stats.completedTasks}
            </p>
          </div>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mb-8">

          <h2 className="text-2xl font-bold mb-5">
            Ai Productivity Score
          </h2>

          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32">

              <div
                className="absolute inset-0 rounded-full bg-slate-800 flex items-center justify-center"
                style={{
                  background: `conic-gradient(
                    #4ade80 ${productivityScore * 3.6}deg,
                    #1e293b
                  )`,
                }}
                />

              <div className="absolute inset-4 rounded-full bg-slate-900 flex items-center justify-center">
                <span className="text-2xl font-bold">
                  {productivityScore}%
                </span>
              </div>
            </div>

            <div>

              <h3 className="text-xl font-bold">
                Productivity Analysis
              </h3>

              <p className="text-slate-400 mt-2">
                Based on completed tasks across all
                projects.
              </p>

              {productivityScore > 80 && (
                <p className="text-green-400 mt-2">
                  Excellent productivity! Keep up the
                  great work 🚀.
                </p>
              )}

              {productivityScore > 50 &&
                productivityScore <= 80 && (
                  <p className="text-yellow-400 mt-2">
                    Great progress! Keep it up 🔥.
                  </p>
                )} 

              {productivityScore <= 50 && (
                <p className="text-red-400 mt-2">
                  Needs Improvement. Focus on
                  completing tasks 📈.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* RECENT ACTIVITY */}

<div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mt-8 mb-8">

  <h2 className="text-2xl font-bold mb-5">
    Recent Activity
  </h2>

  <div className="space-y-4">

    {activities.length > 0 ? (
      activities.map((activity) => (
        <div
          key={activity._id}
          className="border-l-2 border-blue-500 pl-4"
        >
          <p>{activity.action}</p>

          <p className="text-slate-400 text-sm">
            {new Date(
              activity.createdAt
            ).toLocaleString()}
          </p>
        </div>
      ))
    ) : (
      <p className="text-slate-400">
        No recent activity found
      </p>
    )}

  </div>

</div>

        {/* EDIT PROFILE */}

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mb-8">

          <h2 className="text-2xl font-bold mb-5">
            Edit Profile
          </h2>

          <div className="space-y-4">

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Enter Name"
              className="w-full p-3 rounded-xl bg-slate-800 outline-none"
            />

            <div>
              <label className="block mb-2 text-slate-400">
                Upload Profile Picture
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setSelectedFile(e.target.files[0])
                }
                className="w-full p-3 rounded-xl bg-slate-800"
              />
            </div>

            <button
              onClick={handleProfileUpdate}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl"
            >
              <Save size={18} />
              Save Profile
            </button>

          </div>

        </div>

        {/* CHANGE PASSWORD */}

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mt-6">

          <h2 className="text-2xl font-bold mb-5">
            Change Password
          </h2>

          <div className="space-y-4">

            <input
              type="password"
              placeholder="Old Password"
              value={passwordData.oldPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  oldPassword: e.target.value,
                })
              }
              className="w-full p-3 rounded-xl bg-slate-800 outline-none"
            />

            <input
              type="password"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
              className="w-full p-3 rounded-xl bg-slate-800 outline-none"
            />

            <button
              onClick={handlePasswordChange}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-5 py-3 rounded-xl"
            >
              <Lock size={18} />
              Update Password
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Profile;