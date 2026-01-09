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

router.post("/", auth, role("exam_head"), addOrUpdateGrades);

router.get("/my", auth, role("student"), getStudentGrades);

router.get("/child/:studentId", auth, role("parent"), getChildGrades);

router.post("/migrate", auth, role("admin"), migrateGradesData);

export default router;






