import Attendance from "../models/Attendance.js";

export const markAttendance = async (req, res) => {
  try {
    const { studentId, date, status } = req.body;

    const attendance = await Attendance.create({
      student: studentId,
      date,
      status,
      markedBy: req.user.id,
    });

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
