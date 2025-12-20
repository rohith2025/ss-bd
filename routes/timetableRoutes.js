import express from "express";
import {
  createTimetable,
  getTimetable,
} from "../controllers/timetableController.js";
import auth from "../middleware/authMiddleware.js";
import role from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", auth, role("hod"), createTimetable);
router.get("/", auth, getTimetable);

export default router;
