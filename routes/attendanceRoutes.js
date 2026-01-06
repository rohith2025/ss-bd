import express from "express";
import auth from "../middleware/authMiddleware.js";
import role from "../middleware/roleMiddleware.js";
import {
  markAttendance,
  getStudentAttendance,
  getTeacherClasses,
  getClassStudents,
  markBulkAttendance,
} from "../controllers/attendanceController.js";

const router = express.Router();

// Legacy attendance API (keep for backward compatibility)
router.post("/mark", auth, role("teacher"), markAttendance);

// New timetable-driven attendance APIs
router.get("/classes", auth, role("teacher", "lab_assistant"), getTeacherClasses);
router.get("/class-students", auth, role("teacher", "lab_assistant"), getClassStudents);
router.post("/", auth, role("teacher", "lab_assistant"), markBulkAttendance);

router.get("/my", auth, role("student"), getStudentAttendance);

export default router;
