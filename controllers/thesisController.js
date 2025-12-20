import Thesis from "../models/Thesis.js";

export const submitThesis = async (req, res) => {
  const thesis = await Thesis.create({
    student: req.user._id,
    title: req.body.title,
    fileUrl: req.body.fileUrl,
  });
  res.status(201).json(thesis);
};

export const getAllThesis = async (req, res) => {
  const thesis = await Thesis.find().populate("student", "name email");
  res.json(thesis);
};
