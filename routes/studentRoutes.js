import express from "express";
import { getStudentDashboard } from "../controllers/studentController.js";
import auth from "../middleware/authMiddleware.js";
import role from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/dashboard", auth, role("student"), getStudentDashboard);

export default router;
