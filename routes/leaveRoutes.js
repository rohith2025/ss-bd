import express from "express";
import auth from "../middleware/authMiddleware.js";
import role from "../middleware/roleMiddleware.js";
import {
  applyLeave,
  parentAction,
  hodAction,
  getStudentLeaves, 
} from "../controllers/leaveController.js";

const router = express.Router();

router.post("/apply", auth, role("student"), applyLeave);

router.get("/my", auth, role("student"), getStudentLeaves);

router.put("/parent/:leaveId", auth, role("parent"), parentAction);

router.put("/hod/:leaveId", auth, role("hod"), hodAction);

export default router;
