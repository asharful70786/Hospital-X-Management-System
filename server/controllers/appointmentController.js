import Appointment from "../Models/Appointment.js";
import DoctorLeave from "../Models/DoctorLeave.js";
import DoctorAvailability from "../Models/doctorAvailability.js";
import logger from "../utils/logger.js";

// Get all appointments (Admin, Doctor, Receptionist, etc.)

export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("doctor", "name email")
      .populate("patient", "name email");
    return res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single appointment by ID
export const getSingleAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    return res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get all appointments for logged-in doctor
export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.params.id })
      .populate("patient", "name email")
      .sort({ date: 1, time: 1 });
    return res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create appointment manually (receptionist/admin)
export const makeAppointment = async (req, res) => {
  try {
    const newItem = new Appointment(req.body);
    await newItem.save();
    return res.status(201).json({ message: "Item added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update appointment info

export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedItem = await Appointment.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    logger.info(`Appointment updated by ${req.user.role} (${req.user._id})`);
    return res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all appointments by patient ID
//patient can only see his own appointments
export const getAllAppointmentsByPatientId = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.params.id })
      .populate("doctor", "name email")
      .sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all appointments by doctor ID
export const getAllAppointmentsByDoctorId = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.params.id })
      .populate("patient", "name email")
      .sort({ date: 1, time: 1 });
    return res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete appointment (admin access)
export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    await Appointment.findByIdAndDelete(id);
    logger.info(`Appointment deleted by ${req.user.role} (${req.user._id})`);
    return res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete appointment", error: error.message });
  }
};

// Book an appointment (checks leave + slot availability)
export const bookAppointment = async (req, res) => {
  try {
    const { patient, doctor, department, date, time, symptoms } = req.body;

    if (!patient || !doctor || !date || !time) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    const leave = await DoctorLeave.findOne({ doctor, date });
    if (leave) {
      return res.status(400).json({ message: `Doctor is unavailable on ${date}` });
    }

    const existing = await Appointment.findOne({ doctor, date, time, status: { $ne: "Cancelled" } });
    if (existing) {
      return res.status(400).json({ message: "This slot is already booked" });
    }

    const newAppointment = new Appointment({ patient, doctor, department, date, time, symptoms });
    await newAppointment.save();
    logger.info(`New appointment booked by ${req.user.role} (${req.user._id})`);
    res.status(201).json({ message: "Appointment booked successfully", appointment: newAppointment });
  } catch (error) {
    res.status(500).json({ message: "Failed to book appointment", error: error.message });
  }
};

// Get appointments for a doctor by optional date filter
export const getAppointmentsByDoctorId = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    const query = { doctor: id };
    if (date) {
      const targetDate = new Date(date);
      const nextDay = new Date(date);
      nextDay.setDate(targetDate.getDate() + 1);
      query.date = { $gte: targetDate, $lt: nextDay };
    }

    const appointments = await Appointment.find(query)
      .populate("patient", "name email")
      .populate("department", "name")
      .sort({ date: 1, time: 1 });

    res.status(200).json(appointments);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch doctor appointments", error: error.message });
  }
};

// Generate available slots for a doctor on a specific date
export const getAvailableSlotsByDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date) return res.status(400).json({ message: "Date is required" });

    const targetDate = new Date(date);
    const weekday = targetDate.toLocaleDateString("en-US", { weekday: "long" });

    const availability = await DoctorAvailability.findOne({ doctor: id, weekday });
    if (!availability) return res.status(404).json({ message: "Doctor not available on this day" });

    const leave = await DoctorLeave.findOne({ doctor: id, date });
    if (leave) return res.status(400).json({ message: "Doctor is on leave" });

    const booked = await Appointment.find({ doctor: id, date, status: { $ne: "Cancelled" } });
    const bookedTimes = booked.map(appt => appt.time);

    const availableSlots = availability.slots.filter(slot => !bookedTimes.includes(slot));

    return res.status(200).json({ date, weekday, availableSlots });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch slots", error: error.message });
  }
};

