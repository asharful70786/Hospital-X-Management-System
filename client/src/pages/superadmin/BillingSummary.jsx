import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BillingSummary.css'; 

function BillingSummary() {
  const BaseUrl = "http://localhost:4000";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [summaryData, setSummaryData] = useState({
    today: null,
    monthly: null,
    byDepartment: [],
    dailyIncome: [],
    paymentModeSummary: [],
    monthlyTrend: []
  });
  const [activeTab, setActiveTab] = useState('today');
  const navigate = useNavigate();

  // Check user role and fetch appropriate data
  const fetchData = async (endpoint) => {
    setLoading(true);
    try {
      const res = await fetch(`${BaseUrl}/bills/${endpoint}`, {
        credentials: "include"
      });
      
      if (!res.ok) {
        if (res.status === 403) {
          throw new Error('Access denied. You need higher privileges.');
        }
        throw new Error('Failed to fetch data');
      }
      
      const data = await res.json();
      setSummaryData(prev => ({ ...prev, [endpoint]: data }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create new bill
  const handleCreateBill = () => {
    navigate('/bills/create');
  };

  // Tab change handler
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (!summaryData[tab]) {
      fetchData(tab);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  return (
    <div className="billing-summary-container">
      <h2 className="summary-header">Billing Summary</h2>
      
      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-spinner">Loading...</div>}

      {/* Create Bill Button (for Receptionist) */}
      <div className="action-buttons">
        <button 
          className="create-bill-btn"
          onClick={handleCreateBill}
        >
          + Create New Bill
        </button>
      </div>

      {/* Summary Tabs */}
      <div className="summary-tabs">
        <button
          className={`tab-btn ${activeTab === 'today' ? 'active' : ''}`}
          onClick={() => handleTabChange('today')}
        >
          Today's Collection
        </button>
        <button
          className={`tab-btn ${activeTab === 'monthly' ? 'active' : ''}`}
          onClick={() => handleTabChange('monthly')}
        >
          Monthly Collection
        </button>
        <button
          className={`tab-btn ${activeTab === 'by-department' ? 'active' : ''}`}
          onClick={() => handleTabChange('by-department')}
        >
          Department-wise
        </button>
        <button
          className={`tab-btn ${activeTab === 'daily-income' ? 'active' : ''}`}
          onClick={() => handleTabChange('daily-income')}
        >
          Daily Income
        </button>
        <button
          className={`tab-btn ${activeTab === 'payment-mode-summary' ? 'active' : ''}`}
          onClick={() => handleTabChange('payment-mode-summary')}
        >
          Payment Modes
        </button>
        <button
          className={`tab-btn ${activeTab === 'monthly-trend' ? 'active' : ''}`}
          onClick={() => handleTabChange('monthly-trend')}
        >
          Monthly Trend
        </button>
      </div>

      {/* Summary Content */}
      <div className="summary-content">
        {activeTab === 'today' && (
          <div className="today-summary">
            <h3>Today's Collection</h3>
            {summaryData.today ? (
              <div className="summary-card">
                <div className="summary-value">{formatCurrency(summaryData.today.total)}</div>
                <div className="summary-meta">
                  <span>{summaryData.today.count} transactions</span>
                  <span>Updated: {new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            ) : (
              <p>No data available or access denied</p>
            )}
          </div>
        )}

        {activeTab === 'monthly' && (
          <div className="monthly-summary">
            <h3>Monthly Collection</h3>
            {summaryData.monthly ? (
              <div className="summary-card">
                <div className="summary-value">{formatCurrency(summaryData.monthly.total)}</div>
                <div className="summary-meta">
                  <span>{summaryData.monthly.count} transactions</span>
                  <span>{new Date().toLocaleString('default', { month: 'long' })}</span>
                </div>
              </div>
            ) : (
              <p>No data available or access denied</p>
            )}
          </div>
        )}

        {activeTab === 'by-department' && (
          <div className="department-summary">
            <h3>Department-wise Billing</h3>
            {summaryData.byDepartment.length > 0 ? (
              <table className="summary-table">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Total Amount</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {summaryData.byDepartment.map((dept, index) => (
                    <tr key={index}>
                      <td>{dept._id || 'Unknown'}</td>
                      <td>{formatCurrency(dept.total)}</td>
                      <td>{dept.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No data available or access denied</p>
            )}
          </div>
        )}

        {activeTab === 'daily-income' && (
          <div className="daily-income-summary">
            <h3>Daily Income (Last 30 Days)</h3>
            {summaryData.dailyIncome.length > 0 ? (
              <div className="chart-container">
                <div className="bar-chart">
                  {summaryData.dailyIncome.map((day, index) => (
                    <div key={index} className="bar-item">
                      <div className="bar-label">{formatDate(day.date)}</div>
                      <div 
                        className="bar" 
                        style={{ height: `${(day.total / Math.max(...summaryData.dailyIncome.map(d => d.total))) * 100}%` }}
                      >
                        <span className="bar-value">{formatCurrency(day.total)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p>No data available or access denied</p>
            )}
          </div>
        )}

        {activeTab === 'payment-mode-summary' && (
          <div className="payment-mode-summary">
            <h3>Payment Mode Summary</h3>
            {summaryData.paymentModeSummary.length > 0 ? (
              <div className="pie-chart-container">
                <div className="pie-chart">
                  {summaryData.paymentModeSummary.map((mode, index) => {
                    const percentage = (mode.total / summaryData.paymentModeSummary.reduce((acc, curr) => acc + curr.total, 0)) * 100;
                    return (
                      <div 
                        key={index}
                        className="pie-segment"
                        style={{
                          '--percentage': `${percentage}%`,
                          '--color': `hsl(${index * 60}, 70%, 50%)`,
                          '--offset': index === 0 ? 0 : summaryData.paymentModeSummary.slice(0, index).reduce((acc, curr) => 
                            acc + (curr.total / summaryData.paymentModeSummary.reduce((a, c) => a + c.total, 0)) * 100, 0)
                        }}
                      >
                        <div className="segment-label">
                          {mode._id}: {percentage.toFixed(1)}%
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="payment-mode-details">
                  {summaryData.paymentModeSummary.map((mode, index) => (
                    <div key={index} className="payment-mode-item">
                      <span className="color-indicator" style={{
                        backgroundColor: `hsl(${index * 60}, 70%, 50%)`
                      }}></span>
                      <span>{mode._id}: {formatCurrency(mode.total)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p>No data available or access denied</p>
            )}
          </div>
        )}

        {activeTab === 'monthly-trend' && (
          <div className="monthly-trend-summary">
            <h3>Monthly Billing Trend</h3>
            {summaryData.monthlyTrend.length > 0 ? (
              <div className="line-chart-container">
                <div className="line-chart">
                  {summaryData.monthlyTrend.map((month, index) => (
                    <div key={index} className="line-point">
                      <div className="point-value">{formatCurrency(month.total)}</div>
                      <div className="point"></div>
                      <div className="month-label">
                        {new Date(month.year, month.month - 1).toLocaleString('default', { month: 'short' })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p>No data available or access denied</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BillingSummary;