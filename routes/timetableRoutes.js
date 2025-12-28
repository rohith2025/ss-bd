import express from "express";
import auth from "../middleware/authMiddleware.js";
import role from "../middleware/roleMiddleware.js";
import {
  createTimetable,
  getStudentTimetable,
} from "../controllers/timetableController.js";

const router = express.Router();

router.post("/", auth, role("hod"), createTimetable);
router.get("/my", auth, role("student"), getStudentTimetable);

export default router;
