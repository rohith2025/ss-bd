import express from "express";
import {
  addOrUpdateGrades,
  getStudentGrades,
  getChildGrades,
  migrateGradesData,
} from "../controllers/gradesController.js";
import auth from "../middleware/authMiddleware.js";
import role from "../middleware/roleMiddleware.js";

const router = express.Router();

// Exam head can add/update grades
router.post("/", auth, role("exam_head"), addOrUpdateGrades);

// Students can view their own grades
router.get("/my", auth, role("student"), getStudentGrades);

// Parents can view their child's grades
router.get("/child/:studentId", auth, role("parent"), getChildGrades);

// Admin can migrate grades data (temporary route)
router.post("/migrate", auth, role("admin"), migrateGradesData);

export default router;






