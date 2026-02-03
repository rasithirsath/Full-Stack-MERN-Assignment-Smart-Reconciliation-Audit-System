import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import { FiUser } from "react-icons/fi";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

export default function Audit() {
  const { recordId } = useParams();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/audit/${recordId}`);
        setLogs(res.data);
      } catch (err) {
        setError("Failed to load audit history");
        toast.error("Could not fetch audit logs");
      } finally {
        setLoading(false);
      }
    };

    if (recordId) fetchLogs();
  }, [recordId]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold">Audit Timeline</h1>
        <p className="text-sm opacity-80">
          Change history for record{" "}
          <span className="font-semibold">{recordId}</span>
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg shadow text-center">
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <div className="flex justify-center py-12">
          <ClipLoader size={40} color="#1e3a8a" />
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow relative">
          {logs.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p className="text-lg font-medium">No Audit Activity</p>
              <p className="text-sm mt-2">
                This record has not been modified yet.
              </p>
            </div>
          ) : (
            <div className="border-l-2 border-gray-200 pl-6 space-y-10">
              {logs.map((log) => (
                <div
                  key={log._id}
                  className="relative transition hover:bg-gray-50 p-4 rounded-lg"
                >
                  {/* Timeline Dot */}
                  <div className="absolute -left-3 top-2 w-6 h-6 bg-blue-700 rounded-full flex items-center justify-center text-white shadow">
                    <FiUser size={14} />
                  </div>

                  {/* Log Content */}
                  <p className="text-sm text-gray-800">
                    <strong className="text-blue-700">
                      {log.changedBy?.name || "User"}
                    </strong>{" "}
                    modified <strong>{log.field}</strong>
                  </p>

                  <div className="mt-2 text-sm flex items-center gap-2">
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded line-through">
                      {log.oldValue}
                    </span>
                    <span className="text-gray-400 font-bold">→</span>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                      {log.newValue}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
