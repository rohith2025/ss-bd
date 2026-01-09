import express from "express";
import {
  getPendingActivities,
  getStudentProfile,
  getLinkedStudents,
} from "../controllers/examHeadController.js";
import auth from "../middleware/authMiddleware.js";
import role from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/activities/pending", auth, role("exam_head"), getPendingActivities);

router.get("/student/:studentId", auth, role("exam_head"), getStudentProfile);
router.get("/students", auth, role("exam_head","hod"), getLinkedStudents);

export default router;






