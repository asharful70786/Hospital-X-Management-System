import React, { useState, useEffect } from 'react';
import './LabReportManagement.css';

function LabReportManagement() {
  const BaseUrl = "http://localhost:4000/report";
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'completed'
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all lab reports
  async function fetchAllReports() {
    setLoading(true);
    try {
      const res = await fetch(`${BaseUrl}/all`, {
        credentials: "include"
      });
      if (!res.ok) throw new Error('Failed to fetch lab reports');
      const data = await res.json();
      setReports(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Update report status (LabTech only)
  async function updateReportStatus(id, newStatus) {
    setLoading(true);
    try {
      const res = await fetch(`${BaseUrl}/update/${id}`, {
        credentials: "include",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        if (res.status === 403) throw new Error('Access denied. Lab Technician privileges required.');
        throw new Error('Failed to update report status');
      }
      await fetchAllReports();
      setSelectedReport(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Filter and search reports
  const filteredReports = reports.filter(report => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'pending' && report.status === 'Pending') || 
                         (filter === 'completed' && report.status === 'Completed');
    
    const matchesSearch = searchTerm === '' || 
                         report.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         report.patient.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    fetchAllReports();
  }, []);

  return (
    <div className="lab-report-management">
      <div className="header">
        <h2>Lab Report Management</h2>
        <div className="controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="search-icon">🔍</i>
          </div>
          <div className="filter-tabs">
            <button 
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              All Reports
            </button>
            <button 
              className={filter === 'pending' ? 'active' : ''}
              onClick={() => setFilter('pending')}
            >
              Pending
            </button>
            <button 
              className={filter === 'completed' ? 'active' : ''}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-spinner">Loading...</div>}

      {/* Reports List */}
      <div className="reports-container">
        {filteredReports.length === 0 ? (
          <div className="empty-state">
            <i className="empty-icon">📄</i>
            <p>No reports found matching your criteria</p>
          </div>
        ) : (
          <div className="reports-grid">
            {filteredReports.map(report => (
              <div key={report._id} className={`report-card ${report.status.toLowerCase()}`}>
                <div className="patient-info">
                  <div className="patient-avatar">
                    {report.patient.name.charAt(0)}
                  </div>
                  <div className="patient-details">
                    <h3>{report.patient.name}</h3>
                    <p>{report.patient.email}</p>
                  </div>
                </div>
                
                <div className="report-meta">
                  <span className={`status-badge ${report.status.toLowerCase()}`}>
                    {report.status}
                  </span>
                  <span className="report-date">
                    {formatDate(report.createdAt)}
                  </span>
                </div>
                
                <div className="report-actions">
                  <button 
                    className="view-btn"
                    onClick={() => setSelectedReport(report)}
                  >
                    View Details
                  </button>
                  {report.status === 'Pending' && (
                    <button 
                      className="complete-btn"
                      onClick={() => updateReportStatus(report._id, 'Completed')}
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Report Details Modal */}
      {selectedReport && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Report Details</h3>
              <button 
                className="close-btn"
                onClick={() => setSelectedReport(null)}
              >
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              <div className="patient-info">
                <div className="patient-avatar large">
                  {selectedReport.patient.name.charAt(0)}
                </div>
                <div>
                  <h4>{selectedReport.patient.name}</h4>
                  <p>{selectedReport.patient.email}</p>
                </div>
              </div>
              
              <div className="report-details">
                <div className="detail-row">
                  <span className="detail-label">Status:</span>
                  <span className={`status-badge ${selectedReport.status.toLowerCase()}`}>
                    {selectedReport.status}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Date:</span>
                  <span>{formatDate(selectedReport.createdAt)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Report ID:</span>
                  <span>{selectedReport._id}</span>
                </div>
                {selectedReport.resultUrl && (
                  <div className="detail-row">
                    <span className="detail-label">Results:</span>
                    <a 
                      href={selectedReport.resultUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="result-link"
                    >
                      View Full Report
                    </a>
                  </div>
                )}
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="close-btn"
                onClick={() => setSelectedReport(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LabReportManagement;