import e from "express";
import PatientRecord from "../Models/PatientRecord.js";

export const getAllRecords = async (req, res) => {
  try {
    const records = await PatientRecord.find()
      .populate("patient", "name email")
      .populate("doctor", "name email");
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getRecordByPatientId = async (req, res) => {
  try {
    const records = await PatientRecord.find({ patient: req.params.id })
      .populate("doctor", "name email")
      .sort({ visitDate: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getRecordByDoctorId = async (req, res) => {
  try {
    const records = await PatientRecord.find({ doctor: req.params.id })
      .populate("patient", "name email")
      .sort({ visitDate: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getSingleRecord = async (req, res) => {
  try {
    const record = await PatientRecord.findById(req.params.recordId)
      .populate("patient", "name email")
      .populate("doctor", "name email")
      .populate("labReports");
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const addNewPatientRecord = async (req, res) => {
  try {
    const newRecord = new PatientRecord(req.body);
    await newRecord.save();
    res.status(201).json({ message: "patient Record added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const updatePatientRecord = async (req, res) => {
  const { id } = req.params;
  try {
    let record = await PatientRecord.findById(id);

    if (!record)
      return res.status(404).json({ error: "Record not found" });

    // Only the doctor who created this can update
    if (req.user.role === 'Doctor') {
      if (!record.doctor.equals(req.user._id)) {
        return res.status(403).json({
          error: "Access denied: You can only update your own records."
        });
      }
    }
    await PatientRecord.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(`Record updated successfully`);
  } catch (error) {
    console.error(`Error in updating patient record: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};


//super admin     
export const deletePatientRecord = async (req, res) => {
  try {
    const deleted = await PatientRecord.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Record not found" });
    res.json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}