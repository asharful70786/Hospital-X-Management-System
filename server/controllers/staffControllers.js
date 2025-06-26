import Department from "../Models/Department.js";
import Staff from "../Models/staff.js";


export const getAllStaff = async (req, res) => {
  try {
    const staffList = await Staff.find()
      .populate("user", "name email phone")
      .populate("department", "name");
    res.json(staffList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getActiveStaff = async (req, res) => {
  try {
    const staffList = await Staff.find({ isActive: true })
      .populate("user", "name email")
      .populate("department", "name");
    res.json(staffList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getUserByRole = async (req, res) => {
  const { role: targetRole } = req.params;
  const currentUser = req.user;

  try {
    // Admin & Receptionist have full access
    if (["Admin", "Receptionist"].includes(currentUser.role)) {
      const staffList = await Staff.find({ role: targetRole, isActive: true })
        .populate("user", "name email")
        .populate("department", "name");
      return res.json(staffList);
    }
    // Doctor: Allow only if department head
    if (currentUser.role === "Doctor") {
      const department = await Department.findOne({ head: currentUser._id });

      if (!department) {
        return res.status(403).json({ message: "Access denied: Not a department head" });
      }
      // Limit staff list to same department only
      const staffList = await Staff.find({
        role: targetRole,
        department: department._id,
        isActive: true
      })
        .populate("user", "name email")
        .populate("department", "name");

      return res.json(staffList);
    }

    // Other roles — deny access
    return res.status(403).json({ message: "Access denied" });

  } catch (error) {
    console.error("Error in getUserByRole:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getUsersByDepartmentId = async (req, res) => {
  try {
    const staffList = await Staff.find({ department: req.params.id, isActive: true })
      .populate("user", "name email")
      .populate("department", "name");
    res.json(staffList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getSingleStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id)
      .populate("user", "name email")
      .populate("department", "name");
    if (!staff) return res.status(404).json({ message: "Staff not found" });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Only SuperAdmin/Admin should be allowed to hit this
export const updateStaffDetails = async (req, res) => {
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
}

export const markStaffInActive = async (req, res) => {
  const currentUser = req.user;
  const { id } = req.params;
  try {
    const staff = await Staff.findById(id).populate("department");
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }
    // Only run  if current user is a Doctor &&  head of the department
    if (currentUser.role === "Doctor") {
      const department = await Department.findById(staff.department._id);
      if (!department || department.head.toString() !== currentUser._id.toString()) {
        return res.status(403).json({
          message: "Access denied: Only department head can remove staff from this department"
        });
      }
    }
    const updatedStaff = await Staff.findByIdAndUpdate(
      id, {
      isActive: false,
      leftAt: new Date()
    }, { new: true }
    );
    await User.findByIdAndUpdate(updatedStaff.user, { isActive: false });
    return res.json({ message: "Staff removed successfully", staff: updatedStaff });

  } catch (error) {
    console.error("Error in markStaffInActive:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const AddStaff = async (req, res) => {
  const { userId, role, department, notes } = req.body;
  const currentUser = req.user;

  try {
    //  if already active staff
    const staffExists = await Staff.findOne({ user: userId, isActive: true });
    if (staffExists) {
      return res.status(400).json({ message: "User is already an active staff" });
    }
    // If current user is Doctor  &&  head of the department
    if (currentUser.role === "Doctor") {
      const dept = await Department.findById(department);
      if (!dept || dept.head.toString() !== currentUser._id.toString()) {
        return res.status(403).json({
          message: "Access denied: Only department head can assign staff to this department"
        });
      }
    }
    // Save staff
    const newStaff = new Staff({
      user: userId,
      role,
      department,
      notes
    });
    await newStaff.save();

    // Update user role & department
    await User.findByIdAndUpdate(userId, { role, department, isActive: true });

    return res.status(201).json({ message: "Staff added successfully" });
  } catch (error) {
    console.error("Error in AddStaff:", error.message);
    return res.status(500).json({ error: error.message });
  }
};
