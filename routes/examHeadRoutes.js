import express from "express";
import {
  getPendingActivities,
  getStudentProfile,
  getLinkedStudents,
} from "../controllers/examHeadController.js";
import auth from "../middleware/authMiddleware.js";
import role from "../middleware/roleMiddleware.js";

const router = express.Router();

// Get pending activities for verification
router.get("/activities/pending", auth, role("exam_head"), getPendingActivities);

// Get complete student profile
router.get("/student/:studentId", auth, role("exam_head"), getStudentProfile);

// Get all linked students
router.get("/students", auth, role("exam_head"), getLinkedStudents);

export default router;

