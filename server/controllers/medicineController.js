import Medicine from "../Models/Medicine.js";

export const getAllMedicines = async (req, res) => {
  
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    res.json(medicine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const addMedicine = async (req, res) => {
  try {
    const newItem = new Medicine(req.body);
    await newItem.save();
    return res.status(201).json({ message: "Item added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}

export const updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMedicine = await Medicine.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedMedicine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMedicine = await Medicine.findByIdAndDelete(id);
    res.json(deletedMedicine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}