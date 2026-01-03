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
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!["teacher", "lab_assistant"].includes(req.user.role)) {
      return res.status(403).json({ message: "Only teachers can mark attendance" });
    }

    const link = await UserLink.findOne({
      student: studentId,
      teachers: teacherId,
    });

    if (!link) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const attendance = await Attendance.create({
      student: studentId,
      teacher: teacherId,
      subject,
      status,
      day,
      time,
    });

    res.status(201).json({ message: "Attendance marked", attendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


export const getTeacherDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;

    const user = await User.findById(userId).select(
      "name subjects role managedBranch"
    );

    let students = [];

    if (role === "hod") {
      if (!user.managedBranch) {
        return res.json({ teacher: user, students: [] });
      }

      const branchStudents = await User.find({
        role: "student",
        branch: user.managedBranch,
      }).select("name");

      students = branchStudents.map((s) => ({
        _id: s._id,
        studentName: s.name,
        attendance: [],
      }));
    }

    else {
      const links = await UserLink.find({ teachers: userId })
        .populate({ path: "student", select: "name" });

      for (const link of links) {
        if (!link.student) continue;

        const attendanceRecords = await Attendance.find({
          student: link.student._id,
        }).sort({ createdAt: 1 });

        students.push({
          _id: link.student._id,
          studentName: link.student.name,
          attendance: attendanceRecords.map((a) => ({
            subject: a.subject,
            status: a.status,
            day: a.day,
            time: a.time,
            date: a.createdAt,
          })),
        });
      }
    }

    res.json({ teacher: user, students });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch dashboard" });
  }
};


export const getStudentProfile = async (req, res) => {
  try {
    const { studentId } = req.params;
    const user = req.user;

    let authorized = false;

    if (user.role === "hod") {
      const hod = await User.findById(user._id).select("managedBranch");
      const student = await User.findById(studentId).select("branch");

      authorized = student && hod.managedBranch === student.branch;
    } else {
      const link = await UserLink.findOne({
        student: studentId,
        teachers: user._id,
      });
      authorized = !!link;
    }

    if (!authorized) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const [attendance, activities, grades, thesis] = await Promise.all([
      Attendance.find({ student: studentId }).sort({ createdAt: -1 }),
      Activities.find({ student: studentId }).sort({ createdAt: -1 }),
      Grades.findOne({ student: studentId }),
      Thesis.find({ student: studentId }).sort({ createdAt: -1 }),
    ]);

    res.json({
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
