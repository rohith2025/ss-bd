import express from "express";
import auth from "../middleware/authMiddleware.js";
import role from "../middleware/roleMiddleware.js";
import {
  uploadThesis,
  getStudentThesis,
  getMyThesis
} from "../controllers/thesisController.js";

const router = express.Router();

router.post("/", auth, role("student"), uploadThesis);

router.get("/my", auth, role("student"), getMyThesis);

router.get(
  "/student/:studentId",
  auth,
  role("teacher"),
  getStudentThesis
);


export default router;
