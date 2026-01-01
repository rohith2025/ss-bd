import express from "express";
import {
  addActivity,
  getActivities,
  approveActivity,
} from "../controllers/activitiesController.js";
import auth from "../middleware/authMiddleware.js";
import role from "../middleware/roleMiddleware.js";

const router = express.Router();

// Student can submit activities (status = pending)
router.post("/", auth, role("student", "admin", "teacher"), addActivity);
router.get("/", auth, getActivities);
// Exam head can approve/reject activities
router.put("/:activityId/approve", auth, role("exam_head"), approveActivity);

export default router;
