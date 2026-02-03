import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { isAdmin } from "../utils/auth";

export default function Reconciliation() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await api.get("/reconciliation");
      setRecords(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = records.filter(
    (r) =>
      r.transactionId?.toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter ? r.status === statusFilter : true),
  );

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="text-blue-700 font-semibold">Loading records...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold">Reconciliation Records</h1>
        <p className="text-sm opacity-80">Analyze system comparison results</p>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl shadow flex gap-4">
        <input
          placeholder="Search Transaction ID..."
          className="border p-2 rounded w-64"
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option>Matched</option>
          <option>Unmatched</option>
          <option>Duplicate</option>
          <option>Partial</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Transaction</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Reference</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-10 text-gray-500">
                  No reconciliation records found
                </td>
              </tr>
            ) : (
              paginated.map((r) => (
                <tr key={r._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{r.transactionId}</td>
                  <td className="p-3">₹{r.amount}</td>
                  <td className="p-3">{r.referenceNumber}</td>
                  <td className="p-3">
                    {new Date(r.date).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <StatusBadge status={r.status} />
                  </td>

                  <td className="p-3 text-right">
                    {isAdmin() && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected(r);
                        }}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Edit
                      </button>
                    )}
                  </td>

                  <td className="p-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/audit/${r._id}`);
                      }}
                      className="text-indigo-600 text-sm font-medium"
                    >
                      View Audit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="px-3 py-1 border rounded"
        >
          Prev
        </button>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded"
        >
          Next
        </button>
      </div>

      {/* DETAIL PANEL */}
      {selected && (
        <DetailPanel
          record={selected}
          onClose={() => setSelected(null)}
          refreshRecords={fetchRecords}
        />
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Matched: "bg-green-100 text-green-800",
    "Partially Matched": "bg-amber-100 text-amber-800",
    "Not Matched": "bg-gray-200 text-gray-800",
    Duplicate: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || "bg-gray-100 text-gray-800"}`}
      style={{ color: "#1f2937" }}
    >
      {status}
    </span>
  );
}

function DetailPanel({ record, onClose, refreshRecords }) {
  const [amount, setAmount] = useState(record.amount);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.put(`/reconciliation/${record._id}`, { amount });
      refreshRecords();
      onClose();
    } catch (err) {
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl p-6 overflow-auto">
      <button onClick={onClose} className="text-red-500 mb-4">
        Close
      </button>
      <h2 className="text-lg font-bold mb-4">Edit Record</h2>

      <DetailRow label="Transaction ID" value={record.transactionId} />

      <div className="mb-3">
        <strong>Amount:</strong>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 w-full mt-1 rounded"
        />
      </div>

      <DetailRow label="Reference" value={record.referenceNumber} />
      <DetailRow
        label="Date"
        value={new Date(record.date).toLocaleDateString()}
      />

      <button
        onClick={handleSave}
        disabled={saving}
        className={`mt-6 w-full py-2 rounded text-white ${
          saving ? "bg-gray-400" : "bg-blue-700"
        }`}
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="p-2 mb-2 rounded bg-gray-50">
      <strong>{label}:</strong> {value}
    </div>
  );
}
