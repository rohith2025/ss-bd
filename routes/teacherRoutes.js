import express from "express";
import { markAttendance, getTeacherDashboard } from "../controllers/teacherController.js";
import auth from "../middleware/authMiddleware.js";
import role from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/attendance", auth, role("teacher", "hod"), markAttendance);

router.get("/dashboard", auth, role("teacher", "hod"), getTeacherDashboard);

export default router;
