import express from "express";
import { createExam, getExams } from "../controllers/examController.js";
import auth from "../middleware/authMiddleware.js";
import role from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", auth, role("admin", "exam"), createExam);
router.get("/", auth, getExams);

export default router;
