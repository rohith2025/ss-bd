import Thesis from "../models/Thesis.js";
import UserLink from "../models/UserLink.js";


export const uploadThesis = async (req, res) => {
  try {
    const thesis = await Thesis.create({
      student: req.user.id,
      subject: req.body.subject,
      title: req.body.title,
      fileUrl: req.body.fileUrl,
    });

    res.status(201).json({
      message: "Thesis uploaded successfully",
      thesis,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudentThesis = async (req, res) => {
  try {
    const { studentId } = req.params;

    const link = await UserLink.findOne({
      student: studentId,
      teachers: req.user.id,
    });

    if (!link) {
      return res.status(403).json({
        message: "You are not authorized to view this thesis",
      });
    }

    const thesis = await Thesis.find({ student: studentId });
    res.json(thesis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
