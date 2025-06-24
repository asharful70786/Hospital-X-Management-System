import express from "express";
import checkAuth from "../middleWare/checkAuthMiddleWare.js";
import Bed from "../Models/Bed.js";

const router = express.Router();


router.get("/all", checkAuth, async (req, res) => {
  try {
    const beds = await Bed.find();
    res.json(beds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/add", checkAuth, async (req, res) => {
  try {
    const newItem = new Bed(req.body);
    await newItem.save();
    return res.status(201).json({ message: "Item added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//only will be delete by super admin
router.delete("/delete/:id", checkAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBed = await Bed.findByIdAndDelete(id);
    res.json(deletedBed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/update/:id", checkAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const updatedBed = await Bed.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedBed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




export default router;