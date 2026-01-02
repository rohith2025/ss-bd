import Grades from "../models/Grades.js";
import UserLink from "../models/UserLink.js";

// Exam head can add/update grades
export const addOrUpdateGrades = async (req, res) => {
  try {
    const { studentId, semester, sgpa, cgpa } = req.body;
    const examHeadId = req.user._id;

    if (!studentId || !semester || sgpa === undefined || cgpa === undefined) {
      return res.status(400).json({
        message: "studentId, semester, sgpa, and cgpa are required",
      });
    }

    // Verify exam_head is linked to this student
    const userLink = await UserLink.findOne({
      student: studentId,
      examHead: examHeadId,
    });

    if (!userLink) {
      return res
        .status(403)
        .json({ message: "Not authorized to manage grades for this student" });
    }

    // Update or create grades
    const grades = await Grades.findOneAndUpdate(
      { student: studentId },
      {
        student: studentId,
        semester,
        sgpa,
        cgpa,
      },
      { upsert: true, new: true }
    );

    res.json({
      message: "Grades updated successfully",
      grades,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Students can view their own grades
export const getStudentGrades = async (req, res) => {
  try {
    const studentId = req.user._id;
    const grades = await Grades.findOne({ student: studentId });

    if (!grades) {
      return res.json({ grades: null });
    }

    res.json({ grades });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Parents can view their child's grades
export const getChildGrades = async (req, res) => {
  try {
    const { studentId } = req.params;
    const parentId = req.user._id;

    // Verify parent is linked to this student
    const userLink = await UserLink.findOne({
      student: studentId,
      parent: parentId,
    });

    if (!userLink) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this student's grades" });
    }

    const grades = await Grades.findOne({ student: studentId });

    if (!grades) {
      return res.json({ grades: null });
    }

    res.json({ grades });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




