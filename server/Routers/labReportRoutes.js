import express from "express";
import checkAuth from "../middleWare/checkAuthMiddleWare.js";
import LabReport from "../Models/LabReport.js";
const router = express.Router();


//http://localhost:4000/report/...
router.get("/all", checkAuth, async (req, res) => {
  try {
    const labReports = await LabReport.find();
    res.json(labReports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//this  will only access by the user who's is it 
// condition apply  soon 
router.get("/single/:id", checkAuth, async (req, res) => {
  try {
    const labReport = await LabReport.findById(req.params.id);
    res.json(labReport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/add", checkAuth, async (req, res) => {
  try {
    const newItem = new LabReport(req.body);
    await newItem.save();
    return res.status(201).json({ message: "Item added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.patch("/update/:id", checkAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedLabReport = await LabReport.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedLabReport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/delete/:id", checkAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLabReport = await LabReport.findByIdAndDelete(id);
    res.json(deletedLabReport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default router; 