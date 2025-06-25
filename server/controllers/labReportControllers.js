import LabReport from "../Models/LabReport.js";
import { uploadImage } from "../services/cloudinaryServices.js";

export const getAllLabReports = async (req, res) => {
  try {
    const labReports = await LabReport.find();
    res.json(labReports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

//this  will only access by the user who's is it 
// condition apply  soon 
export const patientLabReportAccess = async (req, res) => {
  //i have to modify this logic for ptient and admin / receptionist
  try {
    const labReport = await LabReport.findById(req.params.id);
    res.json(labReport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

//only by receptionist
export const addlabReport = async (req, res) => {
  const { patient, doctor, testType, status, notes } = req.body;
  try {
    if (!patient || !doctor || !testType || !status || !notes) {
      return res.status(400).json({ message: "All fields are required" });
    }
    let imageUrl = "";
    if (req.file) {
      const result = await uploadImage(req.file);
      imageUrl = result.secure_url;
    }
    if (status === "completed" && !req.file) {
      return res.status(400).json({ message: "Result file required for completed reports" });
    }

    const newReport = new LabReport({
      patient, doctor, testType, status, resultUrl: imageUrl, notes,
    });

    await newReport.save();

    return res.status(201).json({ message: "Lab report created", report: newReport });
  } catch (error) {
    return res.status(500).json({ message: "Upload failed", error: error.message });
  }
};



//by super admin
export const updateLabReport = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedLabReport = await LabReport.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedLabReport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


//only deleted by super admin
export const deleteLabReport = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLabReport = await LabReport.findByIdAndDelete(id);
    res.json(deletedLabReport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}