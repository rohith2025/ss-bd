import Attendance from "../models/Attendance.js";
import Grades from "../models/Grades.js";

export const getStudentDashboard = async (req, res) => {
  const attendance = await Attendance.find({ student: req.user._id });
  const grades = await Grades.findOne({ student: req.user._id });

  res.json({ attendance, grades });
};
