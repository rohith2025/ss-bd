import express from "express";
import {
  submitThesis,
  getAllThesis,
} from "../controllers/thesisController.js";
import auth from "../middleware/authMiddleware.js";
import role from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", auth, role("student"), submitThesis);
router.get("/", auth, role("admin", "teacher"), getAllThesis);

export default router;
