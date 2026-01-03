import express from "express";
import {
  getLinkedStudents,
  getStudentProfile,
} from "../controllers/hodController.js";
import auth from "../middleware/authMiddleware.js";
import role from "../middleware/roleMiddleware.js";

const router = express.Router();

// Get all linked students
router.get("/students", auth, role("hod"), getLinkedStudents);

// Get complete student profile
router.get("/student/:studentId", auth, role("hod"), getStudentProfile);

export default router;



