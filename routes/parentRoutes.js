import express from "express";
import { viewChildAttendance } from "../controllers/parentController.js";
import auth from "../middleware/authMiddleware.js";
import role from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/attendance/:studentId",
  auth,
  role("parent"),
  viewChildAttendance
);

export default router;
