import express from "express";
import auth from "../middleware/authMiddleware.js";
import role from "../middleware/roleMiddleware.js";
import {
  createExam,
  getStudentExams,
} from "../controllers/examController.js";

const router = express.Router();

router.post("/", auth, role("exam_head"), createExam);
router.get("/my", auth, role("student"), getStudentExams);

export default router;
