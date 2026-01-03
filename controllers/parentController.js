import Attendance from "../models/Attendance.js";
import UserLink from "../models/UserLink.js";
import Activities from "../models/Activities.js";
import Exam from "../models/Exam.js";
import Fees from "../models/Fees.js";
import LeaveRequest from "../models/LeaveRequest.js";
import Grades from "../models/Grades.js";
import Thesis from "../models/Thesis.js";
import Timetable from "../models/Timetable.js";
import User from "../models/User.js";

export const viewChildAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const parentId = req.user._id;

    const userLink = await UserLink.findOne({
      student: studentId,
      parent: parentId,
    });

    if (!userLink) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this student's attendance" });
    }

    const attendance = await Attendance.find({ student: studentId }).sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChildFullProfile = async (req, res) => {
  try {
    const { studentId } = req.params;
    const parentId = req.user._id;

    const userLink = await UserLink.findOne({
      student: studentId,
      parent: parentId,
    })
      .populate("student", "name email branch year section batch")
      .populate("teachers", "name email")
      .populate("hod", "name email")
      .populate("examHead", "name email");

    if (!userLink) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this student's profile" });
    }

    const student = await User.findById(studentId);

    const [attendance, activities, exams, fees, leaves, grades, thesis, timetable] =
      await Promise.all([
        Attendance.find({ student: studentId }).sort({ date: -1 }),
        Activities.find({ student: studentId, status: "approved" })
          .populate("approvedBy", "name email")
          .sort({ createdAt: -1 }),
        Exam.find({
          branch: student.branch,
          year: student.year,
        }),
        Fees.findOne({ student: studentId }),
        LeaveRequest.find({ student: studentId })
          .sort({ createdAt: -1 })
          .select("fromDate toDate reason parentStatus hodStatus finalStatus"),
        Grades.findOne({ student: studentId }),
        Thesis.find({ student: studentId }).sort({ createdAt: -1 }),
        Timetable.findOne({
          branch: student.branch,
          year: student.year,
          section: student.section,
        }).populate("periods.slots.teacher", "name"),
      ]);

    res.json({
      student: userLink.student,
      linkedUsers: {
        teachers: userLink.teachers,
        hod: userLink.hod,
        examHead: userLink.examHead,
      },
      attendance,
      activities,
      exams,
      fees,
      leaves,
      grades,
      thesis,
      timetable,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLinkedChild = async (req, res) => {
  try {
    const parentId = req.user._id;

    const userLink = await UserLink.findOne({ parent: parentId })
      .populate("student", "name email branch year section batch");

    if (!userLink) {
      return res.json({ child: null });
    }

    res.json({ child: userLink.student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
