import Attendance from "../models/Attendance.js";
import UserLink from "../models/UserLink.js";
import User from "../models/User.js";


export const markAttendance = async (req, res) => {
  try {
    const teacherId = req.user._id; 
    const { studentId, subject, status, day, time } = req.body;

    if (!studentId || !subject || !status || !day || !time) {
      return res.status(400).json({
        message:
          "Missing required fields: studentId, subject, status, day, time",
      });
    }

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
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


export const getTeacherDashboard = async (req, res) => {
  try {
    const teacherId = req.user._id;

    const teacher = await User.findById(teacherId).select("name subjects");

    const linkedStudentsLinks = await UserLink.find({ teachers: teacherId })
      .populate({ path: "student", select: "name" });

    const studentsWithAttendance = [];

    for (const link of linkedStudentsLinks) {
      const student = link.student;
      if (!student) continue;

      const attendanceRecords = await Attendance.find({ student: student._id }).sort({ date: 1 });

      const attendance = attendanceRecords.map(record => ({
        status: record.status,
        subject: record.subject,
        day: record.day,
        time: record.time,
        date: record.date,
      }));

      studentsWithAttendance.push({
        studentName: student.name,
        attendance,
      });
    }

    res.json({
      teacher,
      students: studentsWithAttendance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch teacher dashboard" });
  }
};
