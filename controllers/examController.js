import Exam from "../models/Exam.js";

export const createExam = async (req, res) => {
  const exam = await Exam.create(req.body);
  res.status(201).json(exam);
};

export const getExams = async (req, res) => {
  const exams = await Exam.find();
  res.json(exams);
};
