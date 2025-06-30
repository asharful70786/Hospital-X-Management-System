import React, { useState, useEffect } from 'react';
import "./LogView.css"

function LogsViewer() {
  const BaseUrl = "http://localhost:4000";
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch logs data
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BaseUrl}/user/admin/logs`, { credentials: "include" });
        const data = await response.json();
        setLogs(data.logs || []);
      } catch (err) {
        console.error("Failed to fetch logs:", err);
        setError("Failed to load logs");
      } finally {
        setLoading(false);
      }
    };
    
    fetchLogs();
  }, []);

  // Parse log entry
  const parseLogEntry = (raw) => {
    try {
      const timestampMatch = raw.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)/);
      const timestamp = timestampMatch ? new Date(timestampMatch[1]) : new Date();
      
      const levelMatch = raw.match(/\[app\] (\w+):/);
      const level = levelMatch ? levelMatch[1].toLowerCase() : 'info';
      
      const actionMatch = raw.match(/INFO: (.*?) by/);
      const action = actionMatch ? actionMatch[1] : '';
      
      const userMatch = raw.match(/ by (.*?) -/);
      const user = userMatch ? userMatch[1] : '';
      
      const emailMatch = raw.match(/\((.*?)\)/);
      const email = emailMatch ? emailMatch[1] : '';
      
      return {
        raw,
        timestamp,
        level,
        action,
        user,
        email,
        formattedTime: timestamp.toLocaleString()
      };
    } catch (e) {
      return {
        raw,
        timestamp: new Date(),
        level: 'info',
        action: '',
        user: '',
        email: '',
        formattedTime: ''
      };
    }
  };

  // Filter and search logs
  const filteredLogs = logs
    .map(log => parseLogEntry(log.raw))
    .filter(log => {
      // Apply level filter
      if (filter !== 'all' && log.level !== filter) return false;
      
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          log.user.toLowerCase().includes(query) ||
          log.email.toLowerCase().includes(query) ||
          log.action.toLowerCase().includes(query) ||
          log.raw.toLowerCase().includes(query)
        );
      }
      
      return true;
    })
    .sort((a, b) => b.timestamp - a.timestamp); // Newest first

  if (loading) return <div className="logs-loading">Loading logs...</div>;
  if (error) return <div className="logs-error">{error}</div>;

  return (
    <div className="logs-viewer">
      <div className="logs-header">
        <h2>System Activity Logs</h2>
        <div className="logs-controls">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="log-filter"
          >
            <option value="all">All Levels</option>
            <option value="info">Info</option>
            <option value="warn">Warning</option>
            <option value="error">Error</option>
          </select>
          
          <input
            type="text"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="log-search"
          />
        </div>
      </div>
      
      <div className="logs-container">
        {filteredLogs.length === 0 ? (
          <div className="no-logs">No logs match your criteria</div>
        ) : (
          <table className="logs-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Level</th>
                <th>User</th>
                <th>Email</th>
                <th>Action</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, index) => (
                <tr key={index} className={`log-entry level-${log.level}`}>
                  <td className="log-time">{log.formattedTime}</td>
                  <td className="log-level">
                    <span className={`level-badge ${log.level}`}>{log.level}</span>
                  </td>
                  <td className="log-user">{log.user}</td>
                  <td className="log-email">{log.email}</td>
                  <td className="log-action">{log.action}</td>
                  <td className="log-details">
                    <details>
                      <summary>Raw log</summary>
                      <pre>{log.raw}</pre>
                    </details>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default LogsViewer;