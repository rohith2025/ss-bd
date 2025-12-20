import express from "express";
import {
  createHoliday,
  getHolidays,
} from "../controllers/holidayController.js";
import auth from "../middleware/authMiddleware.js";
import role from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", auth, role("admin"), createHoliday);
router.get("/", auth, getHolidays);

export default router;
