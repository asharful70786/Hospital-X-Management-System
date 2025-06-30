import { useState, useEffect } from 'react';
import "./DepartmentManagement.css";

function DepartmentManagement() {
  const BaseUrl = "http://localhost:4000";
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    head: ''
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch all departments
  async function fetchAllDepartments() {
    setLoading(true);
    try {
      const res = await fetch(`${BaseUrl}/department/all`, { credentials: "include" });
      if (!res.ok) throw new Error('Failed to fetch departments');
      const data = await res.json();
      setDepartments(data);
      // Extract unique doctors from departments
      const uniqueDoctors = data.reduce((acc, dept) => {
        if (dept.head && !acc.some(d => d._id === dept.head._id)) {
          acc.push(dept.head);
        }
        return acc;
      }, []);
      setDoctors(uniqueDoctors);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Get single department by ID
  async function getDepartmentById(id) {
    setLoading(true);
    try {
      const res = await fetch(`${BaseUrl}/department/${id}`, { credentials: "include" });
      if (!res.ok) throw new Error('Failed to fetch department');
      const data = await res.json();
      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Add new department
  async function addDepartment(departmentData) {
    setLoading(true);
    try {
      const res = await fetch(`${BaseUrl}/department/add`, {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(departmentData),
      });
      if (!res.ok) throw new Error('Failed to add department');
      await fetchAllDepartments();
      setFormData({ name: '', description: '', head: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Update department
  async function updateDepartment(id, departmentData) {
    setLoading(true);
    try {
      const res = await fetch(`${BaseUrl}/department/update/${id}`, {
        credentials: "include",
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(departmentData),
      });
      if (!res.ok) throw new Error('Failed to update department');
      await fetchAllDepartments();
      setEditingId(null);
      setFormData({ name: '', description: '', head: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Delete department
  async function deleteDepartment(id) {
    setLoading(true);
    try {
      const res = await fetch(`${BaseUrl}/department/delete/${id}`, {
        credentials: "include",
        method: "DELETE"
      });
      if (!res.ok) throw new Error('Failed to delete department');
      await fetchAllDepartments();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateDepartment(editingId, formData);
    } else {
      addDepartment(formData);
    }
  };

  const handleEdit = async (id) => {
    const department = await getDepartmentById(id);
    if (department) {
      setFormData({
        name: department.name,
        description: department.description,
        head: department.head._id // Store just the ID
      });
      setEditingId(id);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', head: '' });
  };

  useEffect(() => {
    fetchAllDepartments();
  }, []);

  return (
    <div className="department-management">
      <h2>Department Management</h2>
      
      {error && <div className="error">{error}</div>}
      {loading && <div>Loading...</div>}

      <form onSubmit={handleSubmit} className="department-form">
        <h3>{editingId ? 'Edit Department' : 'Add New Department'}</h3>
        
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="form-group">
          <label>Department Head:</label>
          <select
            name="head"
            value={formData.head}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a doctor</option>
            {doctors.map(doctor => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.name || `${doctor.firstName} ${doctor.lastName}`}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-actions">
          <button type="submit">{editingId ? 'Update' : 'Add'} Department</button>
          {editingId && (
            <button type="button" onClick={handleCancel}>Cancel</button>
          )}
        </div>
      </form>

      <div className="departments-list">
        <h3>Departments</h3>
        {departments.length === 0 ? (
          <p>No departments found</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Head</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map(dept => (
                <tr key={dept._id}>
                  <td>{dept.name}</td>
                  <td>{dept.description}</td>
                  <td>{dept.head?.name || 'Not assigned'}</td>
                  <td>
                    <button onClick={() => handleEdit(dept._id)}>Edit</button>
                    <button onClick={() => deleteDepartment(dept._id)}>Delete</button>
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

export default DepartmentManagement;