import Attendance from "../models/Attendance.js";

export const viewChildAttendance = async (req, res) => {
  const attendance = await Attendance.find({ student: req.params.studentId });
  res.json(attendance);
};
