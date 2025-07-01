import DoctorAvailability from "../Models/doctorAvailability.js";



// GET availability for a specific doctor
export const getDoctorAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const availability = await DoctorAvailability.find({ doctor: id });
    return res.json(availability);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch availability", error: err.message });
  }
};

// POST add or update availability
export const createOrUpdateAvailability = async (req, res) => {
  try {
    const { doctor, weekday, slots } = req.body;

    if (!doctor || !weekday || !slots || !Array.isArray(slots)) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    const updated = await DoctorAvailability.findOneAndUpdate(
      { doctor, weekday },
      { $set: { slots } },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "Availability saved", availability: updated });
  } catch (err) {
    res.status(500).json({ message: "Failed to save availability", error: err.message });
  }
};

// DELETE availability entry
export const deleteAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await DoctorAvailability.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "Availability not found" });
    }
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete", error: err.message });
  }
};
