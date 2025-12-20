import express from "express";
import { getFees } from "../controllers/feesController.js";
import auth from "../middleware/authMiddleware.js";
import role from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", auth, role("student"), getFees);

export default router;
