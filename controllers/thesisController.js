import Thesis from "../models/Thesis.js";

// Student submits thesis
export const submitThesis = async (req, res) => {
  try {
    const thesis = await Thesis.create({
      student: req.user._id,
      title: req.body.title,
      fileUrl: req.body.fileUrl,
    });
    res.status(201).json(thesis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin / Teacher view all thesis
export const getAllThesis = async (req, res) => {
  try {
    const thesis = await Thesis.find().populate("student", "name email");
    res.json(thesis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
