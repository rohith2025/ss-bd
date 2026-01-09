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

router.get(
  "/child/:studentId/profile",
  auth,
  role("parent"),
  getChildFullProfile
);

router.get(
  "/child",
  auth,
  role("parent"),
  getLinkedChild
);

export default router;
