import Attendance from "../models/Attendance.js";
import UserLink from "../models/UserLink.js";
import User from "../models/User.js";
import Activities from "../models/Activities.js";
import Grades from "../models/Grades.js";
import Thesis from "../models/Thesis.js";


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

      const attendanceRecords = await Attendance.find({
        student: student._id,
      }).sort({ date: 1 });

      const attendance = attendanceRecords.map((record) => ({
        status: record.status,
        subject: record.subject,
        day: record.day,
        time: record.time,
        date: record.date,
      }));


      studentsWithAttendance.push({
        _id: student._id,         
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

// Get complete student profile (attendance, activities, grades, thesis, parent details)
export const getStudentProfile = async (req, res) => {
  try {
    const { studentId } = req.params;
    const teacherId = req.user._id;

    // Verify teacher is linked to this student
    const userLink = await UserLink.findOne({
      student: studentId,
      teachers: teacherId,
    })
      .populate("student", "name email branch year section batch")
      .populate("parent", "name email phone")
      .populate("teachers", "name email")
      .populate("hod", "name email");

    if (!userLink) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this student's profile" });
    }

    // Fetch student data: attendance, activities (approved only), grades, thesis
    const [attendance, activities, grades, thesis] = await Promise.all([
      Attendance.find({ student: studentId }).sort({ date: -1 }),
      Activities.find({ student: studentId, status: "approved" })
        .populate("approvedBy", "name email")
        .sort({ createdAt: -1 }),
      Grades.findOne({ student: studentId }),
      Thesis.find({ student: studentId }).sort({ createdAt: -1 }),
    ]);

    res.json({
      student: userLink.student,
      parent: userLink.parent,
      attendance,
      activities,
      grades,
      thesis,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};