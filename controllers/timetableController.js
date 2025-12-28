import Timetable from "../models/Timetable.js";
import User from "../models/User.js";


export const createTimetable = async (req, res) => {
  try {
    const hod = await User.findById(req.user.id);

    console.log("HOD : ", hod.managedBranch );
    console.log("RED : ",req.body.branch);

    if (hod.managedBranch !== req.body.branch) {
      return res.status(403).json({
        message: "You can create timetable only for your branch",
      });
    }

    const timetable = await Timetable.create(req.body);
    res.status(201).json(timetable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getStudentTimetable = async (req, res) => {
  try {
    const student = await User.findById(req.user.id);

    const timetable = await Timetable.findOne({
      branch: student.branch,
      year: student.year,
      section: student.section,
    }).populate("periods.slots.teacher", "name");

    res.json(timetable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
