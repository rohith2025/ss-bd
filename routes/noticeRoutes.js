import express from "express";
import {
  createNotice,
  getNotices,
} from "../controllers/noticeController.js";
import auth from "../middleware/authMiddleware.js";
import role from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", auth, role("admin"), createNotice);
router.get("/", auth, getNotices);

export default router;
