import Exam from "../models/Exam.js";
import User from "../models/User.js";

export const createExam = async (req, res) => {
  try {
    const examHead = await User.findById(req.user.id);

    console.log("Exam Head Branch:", examHead.managedBranch);
    console.log("Requested Exam Branch:", req.body.branch);

    if (examHead.managedBranch !== req.body.branch) {
      return res
        .status(403)
        .json({ message: "You can manage only your branch exams" });
    }

    const exam = await Exam.create(req.body);
    res.status(201).json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getStudentExams = async (req, res) => {
  try {
    const student = await User.findById(req.user.id);

    console.log("Student Branch:", student.branch);

    const exams = await Exam.find({
      branch: student.branch,
      year: student.year,
    });

    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
