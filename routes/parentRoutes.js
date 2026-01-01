import express from "express";
import { viewChildAttendance, getChildFullProfile, getLinkedChild } from "../controllers/parentController.js";
import auth from "../middleware/authMiddleware.js";
import role from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/attendance/:studentId",
  auth,
  role("parent"),
  viewChildAttendance
);

// Get full student profile (A-to-Z data)
router.get(
  "/child/:studentId/profile",
  auth,
  role("parent"),
  getChildFullProfile
);

// Get linked child
router.get(
  "/child",
  auth,
  role("parent"),
  getLinkedChild
);

export default router;
