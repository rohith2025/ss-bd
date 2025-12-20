import Attendance from "../models/Attendance.js";

export const getAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ student: req.user.id });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
