import express from "express";
import { markAttendance, getTeacherDashboard, getStudentProfile } from "../controllers/teacherController.js";
import auth from "../middleware/authMiddleware.js";
import role from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/attendance", auth, role("teacher", "hod", "lab_assistant"), markAttendance);

router.get("/dashboard", auth, role("teacher", "hod", "lab_assistant"), getTeacherDashboard);

router.get("/student/:studentId", auth, role("teacher", "hod", "lab_assistant"), getStudentProfile);

export default router;
