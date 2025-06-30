import React, { useState, useEffect } from 'react';
import './BedManagement.css';

function BedManagement() {
  const BaseUrl = "http://localhost:4000/bed";
  const [beds, setBeds] = useState([]);
  const [wards, setWards] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  // Fetch all beds
  async function fetchAllBeds() {
    setLoading(true);
    try {
      const res = await fetch(`${BaseUrl}/all-beds`, {
        credentials: "include"
      });
      if (!res.ok) throw new Error('Failed to fetch beds');
      const data = await res.json();
      setBeds(data);
      groupBedsByWard(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Group beds by ward
  const groupBedsByWard = (bedsData) => {
    const wardsMap = {};
    bedsData.forEach(bed => {
      if (!wardsMap[bed.ward]) {
        wardsMap[bed.ward] = {
          beds: [],
          available: 0,
          occupied: 0,
          maintenance: 0
        };
      }
      wardsMap[bed.ward].beds.push(bed);
      
      // Count statuses
      if (bed.status === 'Available') wardsMap[bed.ward].available++;
      else if (bed.status === 'Occupied') wardsMap[bed.ward].occupied++;
      else if (bed.status === 'Maintenance') wardsMap[bed.ward].maintenance++;
    });
    setWards(wardsMap);
  };

  // Update bed status
  async function updateBedStatus(id) {
    if (!newStatus) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${BaseUrl}/update/${id}`, {
        credentials: "include",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        if (res.status === 403) throw new Error('Access denied. Admin/Receptionist privileges required.');
        throw new Error('Failed to update bed');
      }
      await fetchAllBeds();
      setEditingId(null);
      setNewStatus('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Delete bed
  async function deleteBed(id) {
    if (!window.confirm('Are you sure you want to delete this bed?')) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${BaseUrl}/delete/${id}`, {
        credentials: "include",
        method: "DELETE"
      });
      if (!res.ok) {
        if (res.status === 403) throw new Error('Access denied. Super Admin privileges required.');
        throw new Error('Failed to delete bed');
      }
      await fetchAllBeds();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleEditClick = (bed) => {
    setEditingId(bed._id);
    setNewStatus(bed.status);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewStatus('');
  };

  useEffect(() => {
    fetchAllBeds();
  }, []);

  return (
    <div className="bed-management">
      <h2>Bed Management</h2>
      
      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Loading...</div>}

      <div className="wards-container">
        {Object.keys(wards).length === 0 ? (
          <p>No beds found</p>
        ) : (
          Object.entries(wards).map(([wardId, wardData]) => (
            <div key={wardId} className="ward-section">
              <h3 className="ward-header">
                Ward: {wardId}
                <span className="ward-stats">
                  <span className="available">Available: {wardData.available}</span>
                  <span className="occupied">Occupied: {wardData.occupied}</span>
                  <span className="maintenance">Maintenance: {wardData.maintenance}</span>
                </span>
              </h3>
              
              <div className="beds-grid">
                {wardData.beds.map(bed => (
                  <div key={bed._id} className={`bed-card ${bed.status.toLowerCase()}`}>
                    <div className="bed-header">
                      <h4>Bed ID: {bed._id.slice(-6)}</h4>
                      <span className="status-badge">{bed.status}</span>
                    </div>
                    
                    <div className="bed-details">
                      <p>Ward: {bed.ward.slice(-6)}</p>
                    </div>

                    {editingId === bed._id ? (
                      <div className="edit-form">
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                        >
                          <option value="">Select status</option>
                          <option value="Available">Available</option>
                          <option value="Occupied">Occupied</option>
                          <option value="Maintenance">Maintenance</option>
                        </select>
                        <div className="edit-actions">
                          <button onClick={() => updateBedStatus(bed._id)}>Save</button>
                          <button onClick={handleCancelEdit}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="bed-actions">
                        <button onClick={() => handleEditClick(bed)}>Edit</button>
                        <button 
                          onClick={() => deleteBed(bed._id)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default BedManagement;