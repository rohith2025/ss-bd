import User from "../models/User.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const linkParentToStudent = async (req, res) => {
  try {
    const { parentId, studentId } = req.body;

    if (!parentId || !studentId) {
      return res
        .status(400)
        .json({ message: "parentId and studentId are required" });
    }

    const parent = await User.findById(parentId);
    const student = await User.findById(studentId);

    if (!parent || parent.role !== "parent") {
      return res.status(400).json({ message: "Invalid parent user" });
    }

    if (!student || student.role !== "student") {
      return res.status(400).json({ message: "Invalid student user" });
    }

    parent.parentOf = student._id;
    await parent.save();

    res.json({ message: "Parent linked to student successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
