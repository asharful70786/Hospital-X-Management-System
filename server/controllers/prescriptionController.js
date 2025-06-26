import Prescription from "../Models/Prescription.js";


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
  try {
    const newItem = new Prescription(req.body);
    await newItem.save();
    return res.status(201).json({ message: "Prescription added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getPrescriptionsByDoctorId = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ doctor: req.params.id })
      .populate("patient", "name email");
    res.json(prescriptions);
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
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


//only by the superAdmin
export const deleteprescription = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Prescription.findByIdAndDelete(id);
    res.json(deletedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}