import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Viewer",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ---------------- PASSWORD STRENGTH ---------------- */
  const getStrength = (pwd) => {
    if (pwd.length < 6) return "Weak";
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd) && pwd.length >= 8)
      return "Strong";
    return "Medium";
  };

  const strength = getStrength(form.password);

  /* ---------------- FORM VALIDATION ---------------- */
  const validate = () => {
    let newErrors = {};

    if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Invalid email format";

    if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- SIGNUP ---------------- */
  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });

      toast.success("Account created successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-indigo-900 p-6">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        <form onSubmit={handleSignup} className="space-y-4">
          {/* NAME */}
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />

          {/* EMAIL */}
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}

          {/* PASSWORD */}
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={handleChange}
              className="w-full border p-3 rounded pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500"
            >
              👁
            </button>
          </div>

          {/* STRENGTH METER */}
          <p
            className={`text-sm ${
              strength === "Strong"
                ? "text-green-600"
                : strength === "Medium"
                  ? "text-yellow-600"
                  : "text-red-600"
            }`}
          >
            Strength: {strength}
          </p>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}

          {/* CONFIRM PASSWORD */}
          <div className="relative">
            <input
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              onChange={handleChange}
              className="w-full border p-3 rounded pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-3 text-gray-500"
            >
              👁
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
          )}

          {/* ROLE */}
          <select
            name="role"
            onChange={handleChange}
            className="w-full border p-3 rounded"
          >
            <option>Viewer</option>
            <option>Analyst</option>
            <option>Admin</option>
          </select>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading || Object.keys(errors).length > 0}
            className={`w-full py-3 rounded text-white font-semibold ${
              loading ? "bg-gray-400" : "bg-blue-700 hover:bg-blue-800"
            }`}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/" className="text-blue-700 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
