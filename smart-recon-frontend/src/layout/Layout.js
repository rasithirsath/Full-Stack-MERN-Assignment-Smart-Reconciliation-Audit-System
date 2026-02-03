import { NavLink, Outlet } from "react-router-dom";
import { FiHome, FiUpload, FiList, FiClock, FiLogOut } from "react-icons/fi";

export default function Layout() {
  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: <FiHome /> },
    { name: "Upload", path: "/upload", icon: <FiUpload /> },
    { name: "Reconciliation", path: "/reconciliation", icon: <FiList /> },
    // { name: "Audit Timeline", path: "/audit", icon: <FiClock /> },
  ];

  return (
    <div className="flex h-screen">
      {/* SIDEBAR */}
      <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col justify-between">
        {/* Logo */}
        <div>
          <div className="p-6 text-xl font-bold border-b border-gray-700">
            Settyl Recon
          </div>

          {/* Nav Items */}
          <nav className="mt-6 space-y-2 px-4">
            {menu.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${isActive ? "bg-blue-700" : "hover:bg-gray-700"}`
                }
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-red-600 transition"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </div>

      {/* MAIN AREA */}
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="bg-white shadow p-4 text-right">
          <span className="text-gray-600">
            Role: {localStorage.getItem("role")}
          </span>
        </div>

        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
