import Attendance from "../models/Attendance.js";

export const getAttendance = async (req, res) => {
  const records = await Attendance.find({ student: req.user._id });
  res.json(records);
};
