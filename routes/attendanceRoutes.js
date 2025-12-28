import express from "express";
import auth from "../middleware/authMiddleware.js";
import role from "../middleware/roleMiddleware.js";
import {
  markAttendance,
  getStudentAttendance,
} from "../controllers/attendanceController.js";

const router = express.Router();

router.post("/mark", auth, role("teacher"), markAttendance);

router.get("/my", auth, role("student"), getStudentAttendance);

export default router;
