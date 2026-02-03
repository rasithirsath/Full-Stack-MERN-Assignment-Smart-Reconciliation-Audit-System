import { useState } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import api from "../services/api";
import { FiUploadCloud } from "react-icons/fi";
import { toast } from "react-toastify";
import { isAdmin, isAnalyst } from "../utils/auth";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [progress, setProgress] = useState(0);
  const [jobId, setJobId] = useState("");
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const onDrop = (acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);

    Papa.parse(selectedFile, {
      header: true,
      preview: 20,
      complete: (result) => setPreview(result.data),
    });
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (p) =>
          setProgress(Math.round((p.loaded * 100) / p.total)),
      });

      setJobId(res.data.jobId);
      setStatus("Processing...");
      checkStatus(res.data.jobId);
    } catch (err) {
      if (err.response?.status === 409) {
        toast.warning("This file was already processed. Upload a new file.");
        setProgress(0);
        setFile(null);
        return;
      }

      toast.error("Upload failed. Try again.");
    }
  };

  const checkStatus = async (id) => {
    const interval = setInterval(async () => {
      const res = await api.get(`/files/${id}`);
      setStatus(res.data.status);
      if (res.data.status === "Completed") {
        toast.success("Reconciliation completed!");
        clearInterval(interval);
      }
    }, 2000);
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold">Upload Transaction Data</h1>
        <p className="text-sm opacity-80">
          Import CSV files to start reconciliation. Ensure correct column
          mapping.
        </p>
      </div>

      {/* ERROR BANNER */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg shadow">
          {error}
        </div>
      )}

      {/* STEPS */}
      <div className="bg-white p-4 rounded-xl shadow text-sm text-gray-600">
        <strong>Steps:</strong> 1. Upload File → 2. Verify Preview → 3. Map
        Columns → 4. Processing
      </div>

      {/* DROP ZONE */}
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-blue-500 p-12 text-center rounded-xl bg-white shadow hover:bg-blue-50 transition cursor-pointer"
      >
        <input {...getInputProps()} />
        <FiUploadCloud className="mx-auto text-4xl text-blue-700 mb-3" />
        <p className="text-gray-600 font-medium">Drag & drop CSV file here</p>
        <p className="text-xs text-gray-400">or click to select file</p>
        {file && (
          <p className="mt-3 text-blue-700 font-semibold">{file.name}</p>
        )}
      </div>

      {/* FILE INFO + BUTTON */}
      {file && (
        <div className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
          <div>
            <p className="font-semibold">{file.name}</p>
            <p className="text-sm text-gray-500">
              {(file.size / 1024).toFixed(2)} KB
            </p>
          </div>
          {(isAdmin() || isAnalyst()) && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className={`px-6 py-2 rounded-lg shadow transition ${
                uploading
                  ? "bg-gray-400 text-white"
                  : "bg-blue-700 text-white hover:bg-blue-800"
              }`}
            >
              {uploading ? "Uploading..." : "Upload File"}
            </button>
          )}
        </div>
      )}

      {/* PROGRESS */}
      {progress > 0 && (
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="mb-2 font-medium">Upload Progress</p>
          <div className="w-full bg-gray-200 h-3 rounded">
            <div
              style={{ width: `${progress}%` }}
              className="bg-blue-700 h-3 rounded transition-all"
            ></div>
          </div>
          <p className="text-sm mt-1">{progress}%</p>
        </div>
      )}

      {/* STATUS */}
      {jobId && (
        <div className="bg-white p-4 rounded-xl shadow">
          <p>
            <strong>Job ID:</strong> {jobId}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                status === "Completed"
                  ? "bg-green-100 text-green-700"
                  : status === "Processing..."
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-200 text-gray-700"
              }`}
            >
              {status}
            </span>
          </p>
        </div>
      )}

      {/* EMPTY PREVIEW */}
      {file && preview.length === 0 && (
        <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500">
          No preview available
        </div>
      )}

      {/* PREVIEW TABLE */}
      {preview.length > 0 && (
        <div className="bg-white p-4 rounded-xl shadow overflow-auto">
          <h3 className="font-semibold mb-3">Preview (First 20 Rows)</h3>
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                {Object.keys(preview[0]).map((h) => (
                  <th key={h} className="border p-2 text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preview.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  {Object.values(row).map((v, j) => (
                    <td key={j} className="border p-2">
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
