import express from "express";
const router = express.Router();

import checkAuth from "../middleWare/checkAuthMiddleWare.js";
import Staff from "../Models/staff.js";

//admin/ superadmin /  receptionist 
router.get("/all", checkAuth, async (req, res) => {
  try {
    const staffList = await Staff.find()
      .populate("user", "name email phone")
      .populate("department", "name");
    res.json(staffList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/active", checkAuth, async (req, res) => {
  try {
    const staffList = await Staff.find({ isActive: true })
      .populate("user", "name email")
      .populate("department", "name");
    res.json(staffList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/by-role/:role", checkAuth, async (req, res) => {
  try {
    const staffList = await Staff.find({ role: req.params.role, isActive: true })
      .populate("user", "name email")
      .populate("department", "name");
    res.json(staffList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



router.get("/by-department/:id", checkAuth, async (req, res) => {
  try {
    const staffList = await Staff.find({ department: req.params.id, isActive: true })
      .populate("user", "name email")
      .populate("department", "name");
    res.json(staffList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/update/:id", checkAuth, async (req, res) => {
  try {
    const { role, department, notes } = req.body;
    const updatedStaff = await Staff.findByIdAndUpdate(
      req.params.id,
      { role, department, notes },
      { new: true }
    );

    // Sync role & dept with User
    await User.findByIdAndUpdate(updatedStaff.user, { role, department });

    res.json({ message: "Staff updated successfully", updatedStaff });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Only SuperAdmin/Admin should be allowed to hit this
router.post("/add", checkAuth, async (req, res) => {
  const { userId, role, department, notes } = req.body;

  try {
    // Optional: check if user exists and isn’t already staff
    const staffExists = await Staff.findOne({ user: userId, isActive: true });
    if (staffExists) {
      return res.status(400).json({ message: "User is already an active staff" });
    }

    const newStaff = new Staff({
      user: userId,
      role,
      department,
      notes
    });

    await newStaff.save();

    // Sync: Update User role and department
    await User.findByIdAndUpdate(userId, {
      role,
      department,
      isActive: true
    });

    res.status(201).json({ message: "Staff added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Mark staff as inactive
router.patch("/remove/:id", checkAuth, async (req, res) => {
  try {
    const staff = await Staff.findByIdAndUpdate(
      req.params.id,
      { isActive: false, leftAt: new Date() },
      { new: true }
    );

    //Sync: Update User isActive
    // or we can apply soft delete  
    // await User.findByIdAndUpdate(staff.user, { isActive: false });

    res.json({ message: "Staff removed successfully", staff });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
 export default router