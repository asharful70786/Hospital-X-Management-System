import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SuperAdminDashboard.css';

function SuperAdminDashboard() {
  const BaseUrl = "http://localhost:4000";
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    staff: 0,
    appointments: 0,
    activeAppointments: 0,
    records: 0,
    beds: 0,
    occupiedBeds: 0,
    departments: 0,
    recentActivity: [],
    systemHealth: 'good'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all data with async/await
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all data in parallel
        const [
          staffRes, 
          appointmentsRes, 
          recordsRes, 
          bedsRes, 
          departmentsRes,
          activityRes
        ] = await Promise.all([
          fetch(`${BaseUrl}/staff/all`, { credentials: "include" }),
          fetch(`${BaseUrl}/appointment`, { credentials: "include" }),
          fetch(`${BaseUrl}/records/all-records`, { credentials: "include" }),
          fetch(`${BaseUrl}/bed/all-beds`, { credentials: "include" }),
          fetch(`${BaseUrl}/department/all`, { credentials: "include" }),
          fetch(`${BaseUrl}/user/admin/logs`, { credentials: "include" })
        ]);

        // Check all responses
        if (!staffRes.ok) throw new Error('Failed to fetch staff');
        if (!appointmentsRes.ok) throw new Error('Failed to fetch appointments');
        if (!recordsRes.ok) throw new Error('Failed to fetch records');
        if (!bedsRes.ok) throw new Error('Failed to fetch beds');
        if (!departmentsRes.ok) throw new Error('Failed to fetch departments');
        if (!activityRes.ok) throw new Error('Failed to fetch activity logs');

        // Parse all JSON responses
        const [staff, appointments, records, beds, departments, activity] = await Promise.all([
          staffRes.json(),
          appointmentsRes.json(),
          recordsRes.json(),
          bedsRes.json(),
          departmentsRes.json(),
          activityRes.json()
        ]);

        setDashboardData({
          staff: staff.length,
          appointments: appointments.length,
          activeAppointments: Array.isArray(appointments) ? 
            appointments.filter(a => a.status === 'active').length : 0,
          records: records.length,
          beds: beds.length,
          occupiedBeds: Array.isArray(beds) ? 
            beds.filter(b => b.status === 'occupied').length : 0,
          departments: departments.length,
          recentActivity: parseActivityLogs(activity.logs).slice(0, 5),
          systemHealth: 'good'
        });

      } catch (err) {
        console.error("Dashboard error:", err);
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const parseActivityLogs = (logs) => {
    if (!Array.isArray(logs)) return [];
    
    return logs.map(log => {
      try {
        const raw = log.raw || '';
        const timestampMatch = raw.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)/);
        const timestamp = timestampMatch ? new Date(timestampMatch[1]) : new Date();
        
        const userMatch = raw.match(/ by (.*?) -/);
        const user = userMatch ? userMatch[1] : 'Unknown';
        
        const emailMatch = raw.match(/\((.*?)\)/);
        const email = emailMatch ? emailMatch[1] : '';
        
        const actionMatch = raw.match(/INFO: (.*?)(?= by|$)/);
        const action = actionMatch ? actionMatch[1] : 'Unknown action';
        
        return {
          raw,
          timestamp,
          user,
          email,
          action,
          formattedTime: timestamp.toLocaleString(),
          message: `${action} by ${user} (${email})`
        };
      } catch (e) {
        return {
          raw: 'Error parsing log',
          timestamp: new Date(),
          user: 'System',
          email: '',
          action: 'Log parsing error',
          formattedTime: new Date().toLocaleString(),
          message: 'Error parsing activity log'
        };
      }
    });
  };

  const quickLinks = [
    { path: "/superadmin/roles", label: "Role Management", icon: "👨‍💼", color: "indigo" },
    { path: "/superadmin/departments", label: "Departments", icon: "🏛️", color: "blue" },
    { path: "/superadmin/bills/summary", label: "Billing Summary", icon: "💰", color: "green" },
    { path: "/superadmin/records", label: "Patient Records", icon: "📋", color: "purple" },
    { path: "/superadmin/prescriptions", label: "Prescriptions", icon: "💊", color: "red" },
    { path: "/superadmin/beds", label: "Bed Management", icon: "🛏️", color: "yellow" },
    { path: "/activity-logs", label: "Activity Logs", icon: "📜", color: "pink" }
  ];

  if (loading) return (
    <div className="dashboard-loading">
      <div className="spinner"></div>
      <p>Loading dashboard data...</p>
    </div>
  );

  if (error) return (
    <div className="dashboard-error">
      <div className="error-icon">⚠️</div>
      <h3>Error Loading Dashboard</h3>
      <p>{error}</p>
      <button 
        className="retry-btn"
        onClick={() => window.location.reload()}
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="superadmin-dashboard">
      {/* Header Section */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Super Admin Dashboard</h1>
          <div className={`health-status ${dashboardData.systemHealth}`}>
            <span className="status-dot"></span>
            System: {dashboardData.systemHealth.charAt(0).toUpperCase() + dashboardData.systemHealth.slice(1)}
          </div>
        </div>
        <div className="header-actions">
          <button className="refresh-btn" onClick={() => window.location.reload()}>
            Refresh Data
          </button>
        </div>
      </header>

      {/* Stats Overview */}
      <section className="stats-section">
        <StatCard 
          title="Staff Members" 
          value={dashboardData.staff} 
          icon="👥"
          trend="up"
          color="indigo"
        />
        <StatCard 
          title="Appointments" 
          value={dashboardData.activeAppointments} 
          secondaryValue={dashboardData.appointments}
          icon="📅"
          trend="neutral"
          color="blue"
        />
        <StatCard 
          title="Bed Occupancy" 
          value={dashboardData.occupiedBeds} 
          secondaryValue={dashboardData.beds}
          icon="🛏️"
          trend={dashboardData.occupiedBeds/dashboardData.beds > 0.7 ? "up" : "down"}
          color="green"
        />
        <StatCard 
          title="Departments" 
          value={dashboardData.departments} 
          icon="🏥"
          trend="neutral"
          color="purple"
        />
        <StatCard 
          title="Patient Records" 
          value={dashboardData.records} 
          icon="📋"
          trend="up"
          color="red"
        />
      </section>

      {/* Main Content Area */}
      <div className="content-grid">
        {/* Recent Activity */}
        <section className="activity-section">
          <div className="section-header">
            <h2>Recent Activity</h2>
            <button 
              className="view-all-btn"
              onClick={() => navigate('/activity-logs')}
            >
              View All →
            </button>
          </div>
          <div className="activity-list">
            {dashboardData.recentActivity.length > 0 ? (
              dashboardData.recentActivity.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">📝</div>
                  <div className="activity-details">
                    <p className="activity-message">{activity.message}</p>
                    <p className="activity-time">{activity.formattedTime}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No recent activity found</p>
              </div>
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions-section">
          <div className="section-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="actions-grid">
            {quickLinks.map((link, index) => (
              <button
                key={index}
                className={`action-card ${link.color}`}
                onClick={() => navigate(link.path)}
              >
                <span className="action-icon">{link.icon}</span>
                <span className="action-label">{link.label}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ title, value, secondaryValue, icon, trend, color }) {
  const trendArrow = {
    up: '↑',
    down: '↓',
    neutral: '→'
  };

  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <h3>{title}</h3>
        <div className="stat-values">
          <span className="main-value">{value}</span>
          {secondaryValue && <span className="secondary-value">/ {secondaryValue}</span>}
        </div>
      </div>
      {trend && (
        <div className={`stat-trend ${trend}`}>
          {trendArrow[trend]}
        </div>
      )}
    </div>
  );
}

export default SuperAdminDashboard;