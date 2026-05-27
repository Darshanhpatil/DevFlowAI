function Navbar() {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  return (
    <div className="h-[80px] bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8">

      <div>

        <h1 className="text-2xl font-bold text-white">
          Dashboard
        </h1>

        <p className="text-slate-400 text-sm">
          Welcome back 👋
        </p>

      </div>

      <div className="flex items-center gap-3">

        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center font-bold text-lg">

          {user?.name?.charAt(0)}

        </div>

        <div>

          <h2 className="text-white font-semibold">
            {user?.name}
          </h2>

          <p className="text-slate-400 text-sm">
            {user?.email}
          </p>

        </div>

      </div>

    </div>
  );
}

export default Navbar;