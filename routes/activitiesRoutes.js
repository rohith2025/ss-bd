import express from "express";
import {
  addActivity,
  getActivities,
} from "../controllers/activitiesController.js";
import auth from "../middleware/authMiddleware.js";
import role from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", auth, role("admin", "teacher"), addActivity);
router.get("/", auth, getActivities);

export default router;
