import Bed from "../Models/Bed.js";

//admin/super admin/receptionist
export const getAllBeds = async (req, res) => {
  try {
    const beds = await Bed.find();
    res.json(beds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


//only by super admin
export const addBed = async (req, res) => {
  try {
    const newBed = new Bed(req.body);
    await newBed.save();
    res.status(201).json({ message: "Bed added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


//only By  super admin
export const deleteBed = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBed = await Bed.findByIdAndDelete(id);
    res.json(deletedBed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


//byOnly super admin
export const updateBedCapacity = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedBed = await Bed.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedBed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}