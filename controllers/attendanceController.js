import Attendance from "../models/Attendance.js";
import UserLink from "../models/UserLink.js";
import User from "../models/User.js";
import Timetable from "../models/Timetable.js";

export const markAttendance = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { studentId, subject, status, day, time } = req.body;

    const link = await UserLink.findOne({
      student: studentId,
      teachers: teacherId,
    });

    if (!link) {
      return res
        .status(403)
        .json({ message: "Not authorized to mark attendance" });
    }

    const attendance = await Attendance.create({
      student: studentId,
      teacher: teacherId,
      subject,
      status,
      day,
      time,
    });

    res.status(201).json({
      message: "Attendance marked successfully",
      attendance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudentAttendance = async (req, res) => {
  try {
    const { date } = req.query;

    const query = {
      student: req.user.id,
    };

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      query.date = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    }

    const attendance = await Attendance.find(query)
      .populate("teacher", "name")
      .sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// New timetable-driven attendance APIs
export const getTeacherClasses = async (req, res) => {
  try {
    const { date } = req.query;
    const teacherId = req.user._id;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    // Extract day name from date
    const dateObj = new Date(date);
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

    // Find timetables that have this teacher assigned on this day
    const timetables = await Timetable.find({
      "periods.day": dayName,
      "periods.slots.teacher": teacherId,
    }).select("branch year section periods");

    // Extract unique classes for this teacher on this day
    const classes = [];
    const seenClasses = new Set();

    timetables.forEach((timetable) => {
      const dayPeriod = timetable.periods.find(p => p.day === dayName);
      if (dayPeriod) {
        dayPeriod.slots.forEach((slot) => {
          if (slot.teacher && slot.teacher.toString() === teacherId.toString()) {
            const classKey = `${timetable.year}-${timetable.section}-${slot.subject}`;
            if (!seenClasses.has(classKey)) {
              seenClasses.add(classKey);
              classes.push({
                year: timetable.year,
                section: timetable.section,
                subject: slot.subject,
                timeSlot: slot.time,
                branch: timetable.branch,
              });
            }
          }
        });
      }
    });

    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getClassStudents = async (req, res) => {
  try {
    const { year, section, branch } = req.query;
    const teacherId = req.user._id;

    if (!year || !section || !branch) {
      return res.status(400).json({ message: "Year, section, and branch are required" });
    }

    // Verify teacher has timetable slot for this class
    const timetable = await Timetable.findOne({
      branch,
      year: parseInt(year),
      section,
      "periods.slots.teacher": teacherId,
    });

    if (!timetable) {
      return res.status(403).json({ message: "Not authorized to access this class" });
    }

    // Get students for this class
    const students = await User.find({
      role: "student",
      branch,
      year: parseInt(year),
      section,
    }).select("_id name rollNo").sort({ rollNo: 1 });

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markBulkAttendance = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const {
      date,
      day,
      subject,
      year,
      section,
      timeSlot,
      branch,
      attendance
    } = req.body;

    // Validate required fields
    if (!date || !day || !subject || !year || !section || !timeSlot || !branch || !attendance) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Verify teacher has timetable slot for this class on this day
    const timetable = await Timetable.findOne({
      branch,
      year: parseInt(year),
      section,
      "periods.day": day,
      "periods.slots.teacher": teacherId,
      "periods.slots.subject": subject,
      "periods.slots.time": timeSlot,
    });

    if (!timetable) {
      return res.status(403).json({
        message: "Not authorized to mark attendance for this class"
      });
    }

    // Check if attendance already exists for this date/subject/class
    const existingAttendance = await Attendance.findOne({
      teacher: teacherId,
      subject,
      date: new Date(date),
      year: parseInt(year),
      section,
      branch,
    });

    if (existingAttendance) {
      return res.status(400).json({
        message: "Attendance already marked for this class on this date"
      });
    }

    // Create attendance records
    const attendanceRecords = attendance.map(record => ({
      student: record.studentId,
      teacher: teacherId,
      subject,
      status: record.status,
      date: new Date(date),
      day,
      timeSlot,
      year: parseInt(year),
      section,
      branch,
    }));

    const createdAttendance = await Attendance.insertMany(attendanceRecords);

    res.status(201).json({
      message: "Attendance marked successfully",
      count: createdAttendance.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
