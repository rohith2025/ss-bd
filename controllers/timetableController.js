import Timetable from "../models/Timetable.js";

export const createTimetable = async (req, res) => {
  const timetable = await Timetable.create(req.body);
  res.status(201).json(timetable);
};

export const getTimetable = async (req, res) => {
  const { branch, year, semester, section } = req.query;

  const timetable = await Timetable.find({
    branch,
    year,
    semester,
    section,
  }).populate("periods.faculty", "name email");

  res.json(timetable);
};
