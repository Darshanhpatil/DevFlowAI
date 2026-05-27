function DashboardCard({
  title,
  value,
}) {
  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-blue-500 transition-all">

      <h2 className="text-slate-400 text-sm mb-2">
        {title}
      </h2>

      <h1 className="text-4xl font-bold text-white">
        {value}
      </h1>

    </div>
  );
}

export default DashboardCard;