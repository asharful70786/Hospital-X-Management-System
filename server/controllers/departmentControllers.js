import Department from "../Models/Department.js";


export const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate("head", "name email role");
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// GET a single department by ID
export const getSingleDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id).populate("head", "name email role");
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.json(department);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


//only by SuperAdmin
export const addNewDepartment = async (req, res) => {
  try {
    const newItem = new Department(req.body);
    await newItem.save();
    return res.status(201).json({ message: "Department added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


//by super admin / admin / receptionist
export const updateDepartmentDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    if (req.user.role === 'Doctor') {
      if (!department.head.equals(req.user._id)) {
        return res.status(403).json({ message: "Only head doctor can update this department" });
      }
    }

    const updated = await Department.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    ).populate("head", "name email role");

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//only will be delete by super admin ~ carefully  risky
export const deleteDepertment = async (req, res) => {
  try {
    const deleted = await Department.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Department not found" });
    res.json({ message: "Department deleted successfully", deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}