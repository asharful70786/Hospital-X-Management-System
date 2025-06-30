import React, { useEffect, useState } from 'react';

function PrescriptionsControl() {
  const BaseUrl = 'http://localhost:4000';
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState('all');

  const fetchPrescriptions = async () => {
    try {
      const res = await fetch(`${BaseUrl}/prescriptions/all`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch prescriptions');
      const data = await res.json();
      setPrescriptions(data);
      setFilteredPrescriptions(data);
    } catch (err) {
      console.error(err);
      setMessage('Error fetching prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this prescription?');
    if (!confirmDelete) return;
    
    try {
      const res = await fetch(`${BaseUrl}/prescriptions/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Failed to delete prescription');

      setMessage('Prescription deleted successfully');
      setPrescriptions(prev => prev.filter(p => p._id !== id));
      setFilteredPrescriptions(prev => prev.filter(p => p._id !== id));
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error(err);
      setMessage('Error deleting prescription');
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // Filter prescriptions based on search and filters
  useEffect(() => {
    const filtered = prescriptions.filter(prescription => {
      const matchesSearch = searchTerm === '' || 
        prescription.patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.patient?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.doctor?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.doctor?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.medicines.some(med => med.name?.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesDoctor = selectedDoctor === 'all' || 
        prescription.doctor?._id === selectedDoctor;
      
      const matchesPatient = selectedPatient === 'all' || 
        prescription.patient?._id === selectedPatient;
      
      return matchesSearch && matchesDoctor && matchesPatient;
    });
    setFilteredPrescriptions(filtered);
  }, [searchTerm, selectedDoctor, selectedPatient, prescriptions]);

  // Get unique doctors and patients for filters
  const doctors = [...new Set(prescriptions.map(p => p.doctor?._id).filter(Boolean))]
    .map(id => {
      const doc = prescriptions.find(p => p.doctor?._id === id)?.doctor;
      return { id, name: doc?.name, email: doc?.email };
    });

  const patients = [...new Set(prescriptions.map(p => p.patient?._id).filter(Boolean))]
    .map(id => {
      const patient = prescriptions.find(p => p.patient?._id === id)?.patient;
      return { id, name: patient?.name, email: patient?.email };
    });

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Prescription Management</h2>
      
      {message && (
        <div className={`mb-4 p-3 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      {/* Search and Filter Controls */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search prescriptions..."
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Doctor</label>
            <select
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
            >
              <option value="all">All Doctors</option>
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} ({doctor.email})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Patient</label>
            <select
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
            >
              <option value="all">All Patients</option>
              {patients.map(patient => (
                <option key={patient.id} value={patient.id}>
                  {patient.name} ({patient.email})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredPrescriptions.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-gray-500">No prescriptions found matching your criteria</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicines</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPrescriptions.map((prescription, index) => (
                  <tr key={prescription._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{prescription.doctor?.name || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{prescription.doctor?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{prescription.patient?.name || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{prescription.patient?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <ul className="list-disc list-inside">
                          {prescription.medicines?.map((med, i) => (
                            <li key={i}>
                              {med.name || 'Unnamed'} - {med.duration} days
                              {med._id && <span className="text-xs text-gray-400 ml-2">(ID: {med._id.slice(-4)})</span>}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(prescription.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDelete(prescription._id)}
                        className="text-red-600 hover:text-red-900 mr-3"
                        title="Delete prescription"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default PrescriptionsControl;