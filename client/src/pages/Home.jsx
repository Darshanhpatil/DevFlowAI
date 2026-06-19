import { Link } from "react-router-dom";
import {
  Brain,
  FolderKanban,
  Users,
  MessageSquare,
  FileText,
  ArrowRight,
} from "lucide-react";

function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-5 border-b border-slate-800">
        <h1 className="text-3xl font-bold text-blue-500">
          DevFlow AI
        </h1>

        <div className="flex gap-4">
          <Link
            to="/login"
            className="px-5 py-2 border border-slate-700 rounded-lg hover:bg-slate-800"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-5 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-8 py-24 grid md:grid-cols-2 gap-16 items-center">

        <div>
          <div className="inline-block px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            🚀 AI Powered Project Management
          </div>

          <h1 className="text-6xl font-bold mt-8 leading-tight">
            Build Projects
            <span className="text-blue-500">
              {" "}Faster
            </span>
            <br />
            With DevFlow AI
          </h1>

          <p className="text-slate-400 text-lg mt-6">
            Manage projects, assign tasks, collaborate with teams,
            generate AI-powered workflows and track progress
            in real-time.
          </p>

          <div className="flex gap-4 mt-8">
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 px-7 py-4 rounded-xl flex items-center gap-2"
            >
              Get Started
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/login"
              className="border border-slate-700 hover:bg-slate-800 px-7 py-4 rounded-xl"
            >
              Login
            </Link>
          </div>
        </div>

        {/* DASHBOARD MOCKUP */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">

          <div className="flex gap-2 mb-5">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>

          <div className="grid grid-cols-3 gap-4">

            <div className="bg-slate-800 p-4 rounded-xl">
              <h3 className="text-yellow-400 font-semibold">
                Pending
              </h3>

              <div className="bg-slate-700 p-3 rounded-lg mt-3">
                UI Design
              </div>

              <div className="bg-slate-700 p-3 rounded-lg mt-3">
                Team Setup
              </div>
            </div>

            <div className="bg-slate-800 p-4 rounded-xl">
              <h3 className="text-blue-400 font-semibold">
                In Progress
              </h3>

              <div className="bg-slate-700 p-3 rounded-lg mt-3">
                Backend APIs
              </div>

              <div className="bg-slate-700 p-3 rounded-lg mt-3">
                Team Chat
              </div>
            </div>

            <div className="bg-slate-800 p-4 rounded-xl">
              <h3 className="text-green-400 font-semibold">
                Completed
              </h3>

              <div className="bg-slate-700 p-3 rounded-lg mt-3">
                Authentication
              </div>

              <div className="bg-slate-700 p-3 rounded-lg mt-3">
                Dashboard
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-8 py-24">

        <h2 className="text-4xl font-bold text-center">
          Everything You Need
        </h2>

        <p className="text-center text-slate-400 mt-4">
          Powerful features inspired by Jira, Trello and Notion.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-16">

          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
            <FolderKanban size={40} />
            <h3 className="text-xl font-bold mt-4">
              Project Management
            </h3>
            <p className="text-slate-400 mt-3">
              Create projects and manage workflows easily.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
            <Users size={40} />
            <h3 className="text-xl font-bold mt-4">
              Team Collaboration
            </h3>
            <p className="text-slate-400 mt-3">
              Invite members and assign tasks instantly.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
            <Brain size={40} />
            <h3 className="text-xl font-bold mt-4">
              AI Task Generation
            </h3>
            <p className="text-slate-400 mt-3">
              Generate project plans with AI in seconds.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
            <MessageSquare size={40} />
            <h3 className="text-xl font-bold mt-4">
              Team Chat
            </h3>
            <p className="text-slate-400 mt-3">
              Real-time communication with Socket.IO.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
            <FileText size={40} />
            <h3 className="text-xl font-bold mt-4">
              Reports & PDF
            </h3>
            <p className="text-slate-400 mt-3">
              Export project reports instantly.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
            📎
            <h3 className="text-xl font-bold mt-4">
              File Attachments
            </h3>
            <p className="text-slate-400 mt-3">
              Upload and manage project documents.
            </p>
          </div>

        </div>
      </section>

      {/* STATS */}
      <section className="bg-slate-900 py-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10 text-center">

          <div>
            <h2 className="text-5xl font-bold text-blue-500">
              500+
            </h2>
            <p className="text-slate-400 mt-2">
              Projects Managed
            </p>
          </div>

          <div>
            <h2 className="text-5xl font-bold text-green-500">
              10K+
            </h2>
            <p className="text-slate-400 mt-2">
              Tasks Completed
            </p>
          </div>

          <div>
            <h2 className="text-5xl font-bold text-purple-500">
              50+
            </h2>
            <p className="text-slate-400 mt-2">
              Teams
            </p>
          </div>

          <div>
            <h2 className="text-5xl font-bold text-yellow-500">
              99.9%
            </h2>
            <p className="text-slate-400 mt-2">
              Uptime
            </p>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center">
        <h2 className="text-5xl font-bold">
          Ready To Build Faster?
        </h2>

        <p className="text-slate-400 mt-5">
          Join DevFlow AI and manage projects smarter.
        </p>

        <Link
          to="/register"
          className="inline-block mt-8 bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl"
        >
          Start Free
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 py-8 text-center text-slate-500">
        © 2026 DevFlow AI • Built with MERN + AI
      </footer>

    </div>
  );
}

export default Home;