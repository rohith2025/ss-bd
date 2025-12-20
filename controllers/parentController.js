import Attendance from "../models/Attendance.js";

export const viewStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;

    const attendance = await Attendance.find({ student: studentId });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
