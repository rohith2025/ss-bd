import express from "express";
import auth from "../middleware/authMiddleware.js";
import role from "../middleware/roleMiddleware.js";
import {
  getMyFees,
  approveSemesterFee,
  getStudentFees,
} from "../controllers/feesController.js";

const router = express.Router();

router.get("/my", auth, role("student"), getMyFees);

router.put(
  "/approve/:studentId/:semester",
  auth,
  role("admin"),
  approveSemesterFee
);
router.get("/:studentId", auth, role("admin"), getStudentFees);


export default router;
