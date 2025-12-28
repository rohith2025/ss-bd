import Attendance from "../models/Attendance.js";
import Grades from "../models/Grades.js";
import User from "../models/User.js";
import UserLink from "../models/UserLink.js";

export const getStudentDashboard = async (req, res) => {
  try {
    const student = await User.findById(req.user._id).select(
      "name email year semester branch batch"
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const userLink = await UserLink.findOne({ student: req.user._id })
      .populate({ path: "parent", select: "name email" })
      .populate({ path: "hod", select: "name email" })
      .populate({ path: "teachers", select: "name email" })
      .populate({ path: "examHead", select: "name email" });

    const attendance = await Attendance.find({ student: req.user._id });

    const grades = await Grades.findOne({ student: req.user._id });

    res.json({
      student,               
      linkedUsers: userLink, 
      attendance,
      grades,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch student dashboard" });
  }
};
