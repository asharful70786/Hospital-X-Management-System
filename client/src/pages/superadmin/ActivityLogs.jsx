import { useEffect, useState } from "react";

function Adminlogs() {
  const [adminLogs, setAdminLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BaseUrl = "http://localhost:4000";

  async function fetchAdminLogs() {
    try {
      const response = await fetch(`${BaseUrl}/user/admin/logs`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch logs");
      const data = await response.json();
      setAdminLogs(data.logs || []);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAdminLogs();
  }, []);

  const parseLog = (rawLog) => {
    const logPattern = /^(\d{4}-\d{2}-\d{2}T[\d:.]+Z) \[.*\] (\w+): (.*?)(?:\r)?$/;
    const match = rawLog.match(logPattern);

    if (!match) return null;

    const [, isoTime, level, message] = match;
    return {
      time: new Date(isoTime).toLocaleString(),
      level,
      message,
    };
  };

  const levelColor = {
    INFO: "text-green-600",
    WARN: "text-yellow-600",
    ERROR: "text-red-600",
    DEBUG: "text-blue-600",
  };

  if (loading) return <div className="p-6 text-center text-lg">🔄 Loading logs...</div>;
  if (error) return <div className="p-6 text-center text-red-500">❌ {error}</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📜 Admin Activity Logs</h1>

      {adminLogs.length === 0 ? (
        <div className="text-gray-500 text-center">No logs available.</div>
      ) : (
        <div className="space-y-4">
          {adminLogs.map((log, idx) => {
            const parsed = parseLog(log.raw);
            if (!parsed) return null;

            return (
              <div
                key={idx}
                className="bg-white dark:bg-gray-900 shadow-sm p-4 rounded-xl border border-gray-200 dark:border-gray-800"
              >
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
                  <span>{parsed.time}</span>
                  <span className={`font-semibold ${levelColor[parsed.level] || "text-gray-600"}`}>
                    {parsed.level}
                  </span>
                </div>
                <p className="text-gray-800 dark:text-gray-100 text-base">{parsed.message}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Adminlogs;
