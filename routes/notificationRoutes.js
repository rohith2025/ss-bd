import express from "express";
import auth from "../middleware/authMiddleware.js";
import role from "../middleware/roleMiddleware.js";
import {
  createNotification,
  getAllNotifications,
} from "../controllers/notificationController.js";

const router = express.Router();


router.post("/", auth, role("admin"), createNotification);


router.get("/", auth, getAllNotifications);

export default router;
