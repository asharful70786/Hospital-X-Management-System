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
  try {
    const updated = await PatientRecord.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Record not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

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