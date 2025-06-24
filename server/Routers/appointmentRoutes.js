import express from "express";
// import Appointment from "../Models/Appointment.js";
import checkAuth from "../middleWare/checkAuthMiddleWare.js";
import Appointment from "../Models/Appointment.js";

const router = express.Router();

//http://localhost:4000/appointment/...

//acces by admin / super admin / doctor / nurse / receptionist  
router.get("/", checkAuth, async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("doctor", "name email")
      .populate("patient", "name email");;
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//opnly view by receptionist / patient / receptionist
router.get("/single/:id", checkAuth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

//acces by superADmin  / receptionist / and patient 
router.post("/add", checkAuth, async (req, res) => {
  try {
    const newItem = new Appointment(req.body);
    await newItem.save();
    return res.status(201).json({ message: "Item added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/update/:id", checkAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedItem = await Appointment.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// GET appointments by patient ID
router.get("/by-patient/:id", checkAuth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.params.id })
      .populate("doctor", "name email")
      .sort({ date: 1, time: 1 }); // optional: sort by upcoming
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET appointments by doctor ID
router.get("/by-doctor/:id", checkAuth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.params.id })
      .populate("patient", "name email")
      .sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//access by admin / super admin 
router.delete("/delete/:id", checkAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Appointment.findByIdAndDelete(id);
    res.json(deletedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default router;