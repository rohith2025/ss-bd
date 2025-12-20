import express from "express";
import { getAttendance } from "../controllers/attendanceController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", auth, getAttendance);

export default router;
