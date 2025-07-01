import React, { useState , useEffect } from 'react';

function ViewReport() {
  const BaseUrl = "http://localhost:4000";
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllReports = async () => {
    try {
      const res = await fetch(`${BaseUrl}/report/all`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch lab reports");
      const data = await res.json();
      setReports(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${BaseUrl}/report/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete report");
      setReports(reports.filter((r) => r._id !== id));
    } catch (err) {
      alert("Error deleting report: " + err.message);
    }
  };

  useEffect(() => {
    fetchAllReports();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-blue-900">🧪 Lab Reports</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : reports.length === 0 ? (
        <p>No lab reports found.</p>
      ) : (
        <ul className="space-y-4">
          {reports.map((r) => (
            <li key={r._id} className="bg-white p-4 rounded shadow-md">
              <p><strong>👤 Patient:</strong> {r.patient?.name || r.patient}</p>
              <p><strong>📧 Email:</strong> {r.patient?.email || "N/A"}</p>
              <p><strong>🧪 Status:</strong> <span className={r.status === "Completed" ? "text-green-600" : "text-yellow-600"}>{r.status}</span></p>
              <p><strong>📝 Notes:</strong> {r.notes || "N/A"}</p>
              {r.resultUrl && (
                <p>
                  <a href={r.resultUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">🔗 View Report</a>
                </p>
              )}
              <button
                onClick={() => handleDelete(r._id)}
                className="mt-2 text-sm text-red-600 hover:underline"
              >
                ❌ Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ViewReport;
