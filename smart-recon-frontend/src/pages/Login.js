import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-gray-900 p-6">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 relative">
        {/* BRAND */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-800">SmartRecon</h1>
          <p className="text-gray-500 text-sm">
            Financial Reconciliation Platform
          </p>
        </div>

        {/* EMAIL */}
        <div className="relative mb-4">
          <FiMail className="absolute left-3 top-3 text-gray-400" />
          <input
            type="email"
            placeholder="Email address"
            className="w-full border rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-600 outline-none"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* PASSWORD */}
        <div className="relative mb-2">
          <FiLock className="absolute left-3 top-3 text-gray-400" />
          <input
            type={show ? "text" : "password"}
            placeholder="Password"
            className="w-full border rounded-lg pl-10 pr-10 py-2 focus:ring-2 focus:ring-blue-600 outline-none"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-2.5 text-gray-500"
          >
            {show ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        {/* LOGIN BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full mt-4 py-2 rounded-lg font-semibold text-white transition ${
            loading ? "bg-gray-400" : "bg-blue-700 hover:bg-blue-800 shadow-md"
          }`}
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        {/* SIGNUP LINK */}
        <p className="text-sm text-center mt-5 text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-700 font-semibold hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
