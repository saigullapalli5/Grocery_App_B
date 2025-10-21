const models = require("../models/schema.js");


// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await models.Users.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


// Update user profile
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await models.Users.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    ).select("-password");
    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Update failed", error });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await models.Users.findByIdAndDelete(req.params.id);
    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Deletion failed", error });
  }
};
