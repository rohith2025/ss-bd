import express from "express";
import auth from "../middleware/authMiddleware.js";
import role from "../middleware/roleMiddleware.js";
import {
  applyLeave,
  parentAction,
  hodAction,
  getStudentLeaves, 
  getParentLeaves,
  getHodLeaves,
} from "../controllers/leaveController.js";

const router = express.Router();

router.post("/apply", auth, role("student"), applyLeave);

router.get("/my", auth, role("student"), getStudentLeaves);

router.put("/parent/:leaveId", auth, role("parent"), parentAction);

router.put("/hod/:leaveId", auth, role("hod"), hodAction);

router.get("/parent", auth, role("parent"), getParentLeaves);

router.get("/hod", auth, role("hod"), getHodLeaves);


export default router;
