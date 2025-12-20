import Attendance from "../models/Attendance.js";

export const markAttendance = async (req, res) => {
  const { studentId, date, status } = req.body;

  const record = await Attendance.create({
    student: studentId,
    date,
    status,
    markedBy: req.user._id,
  });

  res.status(201).json(record);
};
