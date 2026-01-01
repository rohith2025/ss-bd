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

// Get all pending activities for exam_head's linked students
export const getPendingActivities = async (req, res) => {
  try {
    const examHeadId = req.user._id;

    // Find all students linked to this exam_head
    const userLinks = await UserLink.find({ examHead: examHeadId })
      .populate("student", "name email branch year section");

    const studentIds = userLinks.map((link) => link.student._id);

    // Get pending activities for these students
    const activities = await Activities.find({
      student: { $in: studentIds },
      status: "pending",
    })
      .populate("student", "name email branch year section")
      .sort({ createdAt: -1 });

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get complete student profile (for exam_head)
export const getStudentProfile = async (req, res) => {
  try {
    const { studentId } = req.params;
    const examHeadId = req.user._id;

    // Verify exam_head is linked to this student
    const userLink = await UserLink.findOne({
      student: studentId,
      examHead: examHeadId,
    })
      .populate("student", "name email branch year section batch")
      .populate("parent", "name email")
      .populate("teachers", "name email")
      .populate("hod", "name email");

    if (!userLink) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this student's profile" });
    }

    // Fetch all student data
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
        hod: userLink.hod,
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

// Get all linked students for exam_head
export const getLinkedStudents = async (req, res) => {
  try {
    const examHeadId = req.user._id;

    const userLinks = await UserLink.find({ examHead: examHeadId })
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

