import express from "express";
import {
  createTransaction,
  getAllTransactions,
} from "../controllers/transactionController.js";
import auth from "../middleware/authMiddleware.js";
import role from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", auth, role("student"), createTransaction);
router.get("/", auth, role("admin"), getAllTransactions);

export default router;
