import React from 'react';
import { Link } from 'react-router-dom';

function ReceptionDashboard() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333', marginBottom: '10px' }}>Reception Dashboard</h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>Manage reception operations</p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '15px',
        marginTop: '20px'
      }}>
        <Link 
          to="/receptionist/add-new-patient" 
          style={{
            padding: '15px',
            background: '#f0f0f0',
            borderRadius: '5px',
            textAlign: 'center',
            textDecoration: 'none',
            color: '#0066cc'
          }}
        >
          Add New Patient
        </Link>
        
        <Link 
          to="/receptionist/modify-appointments" 
          style={{
            padding: '15px',
            background: '#f0f0f0',
            borderRadius: '5px',
            textAlign: 'center',
            textDecoration: 'none',
            color: '#0066cc'
          }}
        >
          Modify Appointments
        </Link>
        
        <Link 
          to="/receptionist/appointments" 
          style={{
            padding: '15px',
            background: '#f0f0f0',
            borderRadius: '5px',
            textAlign: 'center',
            textDecoration: 'none',
            color: '#0066cc'
          }}
        >
          Appointments
        </Link>
        
        <Link 
          to="/receptionist/doctors-availability" 
          style={{
            padding: '15px',
            background: '#f0f0f0',
            borderRadius: '5px',
            textAlign: 'center',
            textDecoration: 'none',
            color: '#0066cc'
          }}
        >
          Doctors Availability
        </Link>
        
        <Link 
          to="/receptionist/Ward_bedAvailability" 
          style={{
            padding: '15px',
            background: '#f0f0f0',
            borderRadius: '5px',
            textAlign: 'center',
            textDecoration: 'none',
            color: '#0066cc'
          }}
        >
          Bed Availability
        </Link>
      </div>
    </div>
  );
}

export default ReceptionDashboard;