import Appointment from "../Models/Appointment.js";


//get all appointments
//acces by admin / super admin / doctor / nurse / receptionist 
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("doctor", "name email")
      .populate("patient", "name email");;
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getSingleAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}



//acces by superADmin  / receptionist / and patient 
export const makeAppointment = async (req, res) => {
  try {
    const newItem = new Appointment(req.body);
    await newItem.save();
    return res.status(201).json({ message: "Item added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


//acces by superADmin  / receptionist
export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedItem = await Appointment.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

//access by receptionist / patient
export const getAllAppointmentsByPatientId = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.params.id })
      .populate("doctor", "name email")
      .sort({ date: 1, time: 1 }); // optional: sort by upcoming
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getAllAppointmentsByDoctorId = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.params.id })
      .populate("patient", "name email")
      .sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


//only by the super admin
export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    await Appointment.findByIdAndDelete(id);
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}