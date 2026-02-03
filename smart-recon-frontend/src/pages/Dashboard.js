import { useEffect, useState } from "react";
import api from "../services/api";
import { isAdmin } from "../utils/auth";

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
  CartesianGrid,
} from "recharts";
import { ClipLoader } from "react-spinners";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalRecords: 0,
    matched: 0,
    unmatched: 0,
    duplicates: 0,
    partial: 0,
    accuracy: 0,
  });

  const [filters, setFilters] = useState({
    from: "",
    to: "",
    status: "",
    user: "",
  });

  const [timeData, setTimeData] = useState([]);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      setLoading(true); // start spinner

      const res = await api.get("/dashboard/summary", { params: filters });
      setData(res.data);

      setTimeData([
        { date: "Jan", count: 40 },
        { date: "Feb", count: 70 },
        { date: "Mar", count: 30 },
        { date: "Apr", count: 90 },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); // stop spinner
    }
  };

  // ⭐ SHOW SPINNER WHILE LOADING
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <ClipLoader size={50} color="#1E3A8A" />
      </div>
    );
  }

  const chartData = [
    { name: "Matched", value: data.matched },
    { name: "Unmatched", value: data.unmatched },
    { name: "Duplicates", value: data.duplicates },
    { name: "Partial", value: data.partial },
  ];

  const COLORS = ["#10B981", "#6B7280", "#EF4444", "#F59E0B"];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold">
          Financial Reconciliation Dashboard
        </h1>
        <p className="text-sm opacity-80">
          Monitor system processing and data integrity
        </p>
      </div>

      {/* FILTERS */}
      {/* <div className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-4">
        <input
          type="date"
          className="border p-2 rounded"
          onChange={(e) => setFilters({ ...filters, from: e.target.value })}
        />

        <input
          type="date"
          className="border p-2 rounded"
          onChange={(e) => setFilters({ ...filters, to: e.target.value })}
        />

        <select
          className="border p-2 rounded"
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">Status</option>
          <option>Matched</option>
          <option>Unmatched</option>
          <option>Duplicate</option>
        </select>

        {isAdmin() && (
          <button
            onClick={fetchSummary}
            className="bg-blue-700 text-white px-4 py-2 rounded"
          >
            Apply Filters
          </button>
        )}
      </div> */}

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        <Card title="Total Records" value={data.totalRecords} />
        <Card title="Matched" value={data.matched} color="border-green-500" />
        <Card
          title="Unmatched"
          value={data.unmatched}
          color="border-gray-500"
        />
        <Card
          title="Duplicates"
          value={data.duplicates}
          color="border-red-500"
        />
        <Card title="Accuracy" value={`${data.accuracy}%`} />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* DONUT CHART */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={chartData} dataKey="value" outerRadius={110}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BAR CHART */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Records Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#1E3A8A" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, color = "border-blue-700" }) {
  return (
    <div className={`bg-white p-5 rounded-xl shadow border-l-4 ${color}`}>
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-2xl font-bold text-gray-800">{value}</h2>
    </div>
  );
}
