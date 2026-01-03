import UserLink from "../models/UserLink.js";
import User from "../models/User.js";
import Activities from "../models/Activities.js";
import Attendance from "../models/Attendance.js";
import Grades from "../models/Grades.js";
import Thesis from "../models/Thesis.js";
import Exam from "../models/Exam.js";
import Fees from "../models/Fees.js";
import LeaveRequest from "../models/LeaveRequest.js";
import Timetable from "../models/Timetable.js";

export const getLinkedStudents = async (req, res) => {
  try {
    const hodId = req.user._id;

    const userLinks = await UserLink.find({ hod: hodId })
      .populate("student", "name email branch year section batch")
      .sort({ createdAt: -1 });

    const students = userLinks.map((link) => ({
      _id: link.student._id,
      name: link.student.name,
      email: link.student.email,
      branch: link.student.branch,
      year: link.student.year,
      section: link.student.section,
      batch: link.student.batch,
    }));

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudentProfile = async (req, res) => {
  try {
    const { studentId } = req.params;
    const hodId = req.user._id;

    const userLink = await UserLink.findOne({
      student: studentId,
      hod: hodId,
    })
      .populate("student", "name email branch year section batch")
      .populate("parent", "name email")
      .populate("teachers", "name email")
      .populate("examHead", "name email");

    if (!userLink) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this student's profile" });
    }

    const [attendance, activities, grades, thesis, exams, fees, leaves, timetable] =
      await Promise.all([
        Attendance.find({ student: studentId }).sort({ date: -1 }),
        Activities.find({ student: studentId })
          .populate("approvedBy", "name email")
          .sort({ createdAt: -1 }),
        Grades.findOne({ student: studentId }),
        Thesis.find({ student: studentId }).sort({ createdAt: -1 }),
        Exam.find({
          branch: userLink.student.branch,
          year: userLink.student.year,
        }),
        Fees.findOne({ student: studentId }),
        LeaveRequest.find({ student: studentId })
          .sort({ createdAt: -1 })
          .select("fromDate toDate reason parentStatus hodStatus finalStatus"),
        Timetable.findOne({
          branch: userLink.student.branch,
          year: userLink.student.year,
          section: userLink.student.section,
        }).populate("periods.slots.teacher", "name"),
      ]);

    res.json({
      student: userLink.student,
      linkedUsers: {
        parent: userLink.parent,
        teachers: userLink.teachers,
        examHead: userLink.examHead,
      },
      attendance,
      activities,
      grades,
      thesis,
      exams,
      fees,
      leaves,
      timetable,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



