import Prescription from "../Models/Prescription.js";
import logger from "../utils/logger.js";


// Get all prescriptions with doctor & patient populated
export const getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate("patient", "name email")
      .populate("doctor", "name email");
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get prescriptions by patient ID
export const getPrescriptionsByPatientId = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.params.id })
      .populate("doctor", "name email");
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const addNewPrescription = async (req, res) => {
  const { patient, doctor, medicines, notes } = req.body;
  if (!patient || !doctor || !medicines || !notes) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const newItem = new Prescription({
      patient,
      doctor,
      medicines,
      notes
    });
    await newItem.save();
    logger.info(`New prescription added by ${req.user.role} (${req.user._id})`);
    return res.status(201).json({ message: "Prescription added successfully" });
  } catch (error) {
    logger.error(`Failed to add prescription by ${req.user.role} - (${req.user._id})`);
    res.status(500).json({ error: error.message });

  }
}

export const getPrescriptionsByDoctorId = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ doctor: req.params.id })
      .populate("patient", "name email");
    return res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const updatePrescription = async (req, res) => {

  try {
    const { id } = req.params;
    const updatedItem = await Prescription.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    logger.info(`Prescription updated by ${req.user.role} (${req.user._id})`);
    return res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


//only by the superAdmin
export const deleteprescription = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Prescription.findByIdAndDelete(id);
    logger.info(`Prescription deleted by ${req.user.role} (${req.user._id})`);
    return res.json(deletedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}