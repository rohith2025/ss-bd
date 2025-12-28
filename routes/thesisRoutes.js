import express from "express";
import auth from "../middleware/authMiddleware.js";
import role from "../middleware/roleMiddleware.js";
import {
  uploadThesis,
  getStudentThesis,
} from "../controllers/thesisController.js";

const router = express.Router();

router.post("/", auth, role("student"), uploadThesis);
router.get(
  "/student/:studentId",
  auth,
  role("teacher"),
  getStudentThesis
);

export default router;
