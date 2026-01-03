import Attendance from "../models/Attendance.js";
import UserLink from "../models/UserLink.js";
import User from "../models/User.js";

export const markAttendance = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { studentId, subject, status, day, time } = req.body;

    const link = await UserLink.findOne({
      student: studentId,
      teachers: teacherId,
    });

    if (!link) {
      return res
        .status(403)
        .json({ message: "Not authorized to mark attendance" });
    }

    const attendance = await Attendance.create({
      student: studentId,
      teacher: teacherId,
      subject,
      status,
      day,
      time,
    });

    res.status(201).json({
      message: "Attendance marked successfully",
      attendance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudentAttendance = async (req, res) => {
  try {
    const { date } = req.query;
    
    const query = {
      student: req.user.id,
    };

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      query.date = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    }

    const attendance = await Attendance.find(query)
      .populate("teacher", "name")
      .sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
