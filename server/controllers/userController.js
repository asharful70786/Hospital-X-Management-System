import User from "../Models/userModel.js";



export const getallUsers = async (req, res) => {
  try {
    const users = await User.find({ isActive: true }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


export const getUsersByRole = async (req, res) => {
  try {
    const role = req.params.role;
    const users = await User.find({ role }).select("name email department");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const getUsersByDepartment = async (req, res) => {
  console.log(req.params.id);
  try {
    const users = await User.find({ department: req.params.id }).select("name email role");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const upDateUserById = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    }).select("-password");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const deactivateUsers = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    res.json({ message: "User deactivated", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}