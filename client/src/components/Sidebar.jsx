import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Settings,
} from "lucide-react";

function Sidebar() {
  return (
    <div className="w-65 h-screen bg-slate-900 border-r border-slate-800 p-5">

      <h1 className="text-3xl font-bold text-blue-500 mb-10">
        DevFlow AI
      </h1>

      <div className="space-y-3">

        <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-lg cursor-pointer hover:bg-slate-700 transition-all">

          <LayoutDashboard size={20} />

          <span>Dashboard</span>

        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-slate-800 transition-all">

          <ClipboardList size={20} />

          <span>Projects</span>

        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-slate-800 transition-all">

          <Users size={20} />

          <span>Teams</span>

        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-slate-800 transition-all">

          <Settings size={20} />

          <span>Settings</span>

        </div>

      </div>

    </div>
  );
}

export default Sidebar;