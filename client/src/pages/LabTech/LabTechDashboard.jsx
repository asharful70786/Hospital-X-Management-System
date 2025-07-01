import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FiUser, FiFileText, FiUpload, FiPlus, FiClipboard } from "react-icons/fi";

function LabTechDashboard() {
  const BaseUrl = "http://localhost:4000";

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [reports, setReports] = useState([]);

  const [formData, setFormData] = useState({
    patient: "",
    doctor: "",
    testType: "",
    status: "Pending",
    notes: "",
    file: null,
  });

  const fetchAllDoctors = async () => {
    try {
      const res = await fetch(`${BaseUrl}/staff/by-role/Doctor`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setDoctors(data);
    } catch (err) {
      console.error(err);
      toast.error("Couldn't fetch doctors");
    }
  };

  const fetchAllPatients = async () => {
    try {
      const res = await fetch(`${BaseUrl}/staff/by-role/Patient`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setPatients(data);
    } catch (err) {
      console.error(err);
      toast.error("Couldn't fetch patients");
    }
  };

  useEffect(() => {
    fetchAllDoctors();
    fetchAllPatients();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleAddReport = async (e) => {
    e.preventDefault();
    const body = new FormData();
    Object.entries(formData).forEach(([k, v]) => v && body.append(k, v));

    try {
      const res = await fetch(`${BaseUrl}/report/add`, {
        method: "POST",
        credentials: "include",
        body,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message || "Failed to add report");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
    

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Report Form Card */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <h2 className="text-xl font-semibold flex items-center">
              <FiPlus className="mr-2" />
              New Test Report
            </h2>
          </div>
          
          <form onSubmit={handleAddReport} className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Patient Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiUser className="inline mr-2" />
                  Patient
                </label>
                <select
                  name="patient"
                  value={formData.patient}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Patient</option>
                  {patients.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Doctor Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiUser className="inline mr-2" />
                  Referring Doctor
                </label>
                <select
                  name="doctor"
                  value={formData.doctor}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.user?.name || "Unnamed"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Test Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiFileText className="inline mr-2" />
                  Test Type
                </label>
                <input
                  type="text"
                  name="testType"
                  placeholder="e.g., Blood Test, MRI Scan"
                  value={formData.testType}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {/* File Upload */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiUpload className="inline mr-2" />
                  Upload Results
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FiUpload className="w-8 h-8 text-gray-400" />
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PDF, JPG, PNG (MAX. 5MB)</p>
                    </div>
                    <input
                      type="file"
                      name="file"
                      accept=".pdf,.jpg,.png"
                      onChange={handleChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiFileText className="inline mr-2" />
                Notes
              </label>
              <textarea
                name="notes"
                rows="4"
                placeholder="Enter test observations or special instructions..."
                value={formData.notes}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center"
            >
              <FiPlus className="mr-2" />
              Submit Report
            </button>
          </form>
        </div>

        {/* Quick Actions Panel */}
        <div className="space-y-6">
          {/* Stats Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Lab Statistics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Pending Tests</span>
                <span className="font-bold text-yellow-600">24</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Completed Today</span>
                <span className="font-bold text-green-600">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Patients</span>
                <span className="font-bold text-blue-600">{patients.length}</span>
              </div>
            </div>
          </div>

          {/* Quick Links Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/labtech/reports"
                className="flex items-center p-3 bg-blue-50 rounded-lg text-blue-700 hover:bg-blue-100 transition-colors"
              >
                <FiClipboard className="mr-3" />
                View All Reports
              </Link>
              <Link
                to="/labtech/pending"
                className="flex items-center p-3 bg-yellow-50 rounded-lg text-yellow-700 hover:bg-yellow-100 transition-colors"
              >
                <FiFileText className="mr-3" />
                Pending Tests
              </Link>
              <Link
                to="/labtech/completed"
                className="flex items-center p-3 bg-green-50 rounded-lg text-green-700 hover:bg-green-100 transition-colors"
              >
                <FiFileText className="mr-3" />
                Completed Tests
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <FiFileText className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">New blood test added</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <FiFileText className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">MRI scan completed</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LabTechDashboard;