import Timetable from "../models/Timetable.js";
import User from "../models/User.js";
import UserLink from "../models/UserLink.js";

export const createTimetable = async (req, res) => {
  try {
    const hod = await User.findById(req.user._id);

    if (!hod.managedBranch) {
      return res.status(403).json({
        message: "HOD must have a managed branch",
      });
    }

    const { year, section, periods } = req.body;

    if (!year || !section) {
      return res.status(400).json({
        message: "Year and section are required",
      });
    }

    const timeSlots = [
      "10:00 AM - 11:00 AM",
      "11:00 AM - 12:00 PM",
      "12:00 PM - 1:00 PM", 
      "1:00 PM - 2:00 PM",
      "2:00 PM - 3:00 PM",
      "3:00 PM - 4:00 PM",
    ];

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    const generatedPeriods = days.map((day) => {
      const dayPeriods = periods.find((p) => p.day === day);
      const slots = [];

      timeSlots.forEach((time, index) => {
        const isLunch = index === 2; 

        if (isLunch) {
          slots.push({
            time,
            subject: "LUNCH BREAK",
            teacher: null,
          });
        } else {
          const matchingSlot = dayPeriods?.slots?.find(
            (s) => s.timeIndex === index
          );

          slots.push({
            time,
            subject: matchingSlot?.subject || "",
            teacher: matchingSlot?.teacher || null,
          });
        }
      });

      return {
        day,
        slots,
      };
    });

    const existingTimetable = await Timetable.findOne({
      branch: hod.managedBranch,
      year: parseInt(year),
      section,
    });

    if (existingTimetable) {
      existingTimetable.periods = generatedPeriods;
      await existingTimetable.save();
      return res.status(200).json(existingTimetable);
    } else {
      const timetable = await Timetable.create({
        branch: hod.managedBranch,
        year: parseInt(year),
        section,
        periods: generatedPeriods,
      });
      return res.status(201).json(timetable);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTeachersByBranch = async (req, res) => {
  try {
    const hod = await User.findById(req.user._id);

    if (!hod.managedBranch) {
      return res.json([]);
    }

    const branchStudents = await User.find({
      role: "student",
      branch: hod.managedBranch,
    }).select("_id");

    const studentIds = branchStudents.map((s) => s._id);

    const userLinks = await UserLink.find({
      student: { $in: studentIds },
    }).populate({
      path: "teachers",
      select: "name email subjects branch",
    });

    const teacherMap = new Map();
    userLinks.forEach((link) => {
      if (link.teachers && Array.isArray(link.teachers)) {
        link.teachers.forEach((teacher) => {
          if (teacher && !teacherMap.has(teacher._id.toString())) {
            teacherMap.set(teacher._id.toString(), teacher);
          }
        });
      }
    });

    const directTeachers = await User.find({
      role: { $in: ["teacher", "lab_assistant"] },
      branch: hod.managedBranch,
    }).select("name email subjects branch");

    directTeachers.forEach((teacher) => {
      if (!teacherMap.has(teacher._id.toString())) {
        teacherMap.set(teacher._id.toString(), teacher);
      }
    });

    const teachers = Array.from(teacherMap.values());
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudentTimetable = async (req, res) => {
  try {
    const student = await User.findById(req.user._id);

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

export const getTeacherTimetable = async (req, res) => {
  try {
    const teacherId = req.user._id;

    const timetables = await Timetable.find({
      "periods.slots.teacher": teacherId,
    })
      .populate("periods.slots.teacher", "name")
      .select("branch year section periods");

 
    const teacherSlots = [];
    timetables.forEach((timetable) => {
      timetable.periods.forEach((period) => {
        period.slots.forEach((slot) => {
          if (
            slot.teacher &&
            slot.teacher._id.toString() === teacherId.toString() &&
            slot.subject !== "LUNCH BREAK"
          ) {
            teacherSlots.push({
              _id: slot._id || `${timetable._id}-${period.day}-${slot.time}`,
              day: period.day,
              time: slot.time,
              subject: slot.subject,
              branch: timetable.branch,
              year: timetable.year,
              section: timetable.section,
              teacher: slot.teacher,
            });
          }
        });
      });
    });

    res.json(teacherSlots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getHodTimetables = async (req, res) => {
  try {
    const hod = await User.findById(req.user._id);

    if (!hod.managedBranch) {
      return res.status(403).json({
        message: "HOD must have a managed branch",
      });
    }

    const timetables = await Timetable.find({
      branch: hod.managedBranch,
    })
      .sort({ year: 1, section: 1 })
      .populate("periods.slots.teacher", "name");

    res.json(timetables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
