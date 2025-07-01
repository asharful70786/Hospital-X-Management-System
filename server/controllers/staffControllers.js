import Department from "../Models/Department.js";
import Staff from "../Models/staff.js";
import User from "../Models/userModel.js";
import logger from "../utils/logger.js";


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

// controllers/userController.js
export const getUserByRole = async (req, res) => {
  const { role: targetRole } = req.params;      
  const currentUser = req.user;         
  try {
    const canSeeEverything = ["Admin", "SuperAdmin", "Receptionist" , "LabTech"].includes(
      currentUser.role
    );
    const labTechCanSee = ["Patient", "Doctor"]; 
    if (
      !canSeeEverything &&                                  // not Admin-ish
      !(currentUser.role === "LabTech" && labTechCanSee.includes(targetRole))
    ) {
      if (currentUser.role !== "Doctor") {
        return res.status(403).json({ message: "Access denied" });
      }
    }

    if (targetRole === "Patient") {
      const patients = await User
        .find({ role: "Patient", isActive: true })
        .select("_id name email phone");
      return res.json(patients);
    }
    // If requester is a department-head doctor, limit to own department
    if (currentUser.role === "Doctor" && !canSeeEverything) {
      const department = await Department.findOne({ head: currentUser._id });
      if (!department) {
        return res
          .status(403)
          .json({ message: "Access denied: Not a department head" });
      }
      const staffList = await Staff.find({
        role: targetRole,
        department: department._id,
        isActive: true,
      })
        .populate("user", "name email")
        .populate("department", "name");

      return res.json(staffList);                  
    }
    // Everyone else who made it this far (Admin/SuperAdmin/Receptionist
    // or LabTech asking for Doctor) gets the unrestricted staff list.
    const staffList = await Staff.find({ role: targetRole, isActive: true })
      .populate("user", "name email")
      .populate("department", "name");

    return res.json(staffList);
  } catch (err) {
    console.error("getUserByRole ▶︎", err);
    res.status(500).json({ error: err.message });
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
    const { role, department, notes, isActive } = req.body;
    const updatedStaff = await Staff.findByIdAndUpdate(
      req.params.id,
      { role, department, notes, isActive },
      { new: true }
    );

    // Sync role & dept with User
    await User.findByIdAndUpdate(updatedStaff.user, { role, department });
    logger.info(`Staff updated by ${req.user.role} (${req.user._id})`, {
      staffId: req.params.id,
      updates: { role, department }
    });

    res.json({ message: "Staff updated successfully", updatedStaff });
  } catch (error) {
    logger.error(`Error updating staff by ${req.user._id}: ${error.message}`);
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
        logger.warn(`Unauthorized staff removal attempt by ${currentUser.role} (${currentUser._id})`, {
          staffId: id,
          department: department?._id
        });

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
    logger.info(`Staff deactivated by ${currentUser.role} (${currentUser._id})`, {
      removedStaff: id,
      timestamp: new Date()
    });

    return res.json({ message: "Staff removed successfully", staff: updatedStaff });

  } catch (error) {
    console.error("Error in markStaffInActive:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const AddStaff = async (req, res) => {
  const { userId, role, department } = req.body;
  const currentUser = req.user;
  try {
    const existing = await Staff.findOne({ user: userId, isActive: true });
    if (existing) {
      logger.warn(`AddStaff attempt on existing user by ${currentUser.role} (${currentUser._id})`, { targetUser: userId })
      return res.status(400).json({ message: "User is already staff" });
    }

    const newStaff = await Staff.create({ user: userId, role, department });
    logger.info(`New staff added by ${currentUser.role} (${currentUser._id})`, { addedUser: userId, department });

    res.status(201).json({ message: "Staff added", newStaff });
  } catch (error) {
    logger.error(`Error adding staff by ${currentUser._id}: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

