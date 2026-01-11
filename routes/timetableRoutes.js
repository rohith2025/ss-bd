import express from "express";
import auth from "../middleware/authMiddleware.js";
import role from "../middleware/roleMiddleware.js";
import {
  createTimetable,
  getStudentTimetable,
  getTeacherTimetable,
  getTeachersByBranch,
  getHodTimetables
} from "../controllers/timetableController.js";

const router = express.Router();

router.post("/", auth, role("hod"), createTimetable);
router.get("/my", auth, role("student"), getStudentTimetable);
router.get("/teacher", auth, role("teacher", "lab_assistant"), getTeacherTimetable);
router.get("/teachers", auth, role("hod"), getTeachersByBranch);
router.get("/hod/all", auth, role("hod"), getHodTimetables);


export default router;
