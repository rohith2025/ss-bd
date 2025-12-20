import Attendance from "../models/Attendance.js";
import Grades from "../models/Grades.js";

export const getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user.id;

    const attendance = await Attendance.find({ student: studentId });
    const grades = await Grades.findOne({ student: studentId });

    res.json({
      attendance,
      grades,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
