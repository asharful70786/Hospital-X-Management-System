import express from "express";
import Department from "../Models/Department.js";
import checkAuth from "../middleWare/checkAuthMiddleWare.js";

const router = express.Router();

// GET all departments with head populated
router.get("/all", checkAuth, async (req, res) => {
  try {
    const departments = await Department.find().populate("head", "name email role");
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET a single department by ID
router.get("/:id", checkAuth, async (req, res) => {
  try {
    const department = await Department.findById(req.params.id).populate("head", "name email role");
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.json(department);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ADD a new department
router.post("/add", checkAuth, async (req, res) => {
  try {
    const newItem = new Department(req.body);
    await newItem.save();
    return res.status(201).json({ message: "Department added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE department details
router.patch("/update/:id", checkAuth, async (req, res) => {
  try {
    const updated = await Department.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("head", "name email role");

    if (!updated) return res.status(404).json({ message: "Department not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//only will be delete by super admin ~ carefully  risky 
router.delete("/delete/:id", checkAuth, async (req, res) => {
  try {
    const deleted = await Department.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Department not found" });
    res.json({ message: "Department deleted successfully", deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
