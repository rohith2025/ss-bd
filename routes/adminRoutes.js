import express from "express";
import {
  getAllUsers,
  linkParentToStudent
} from "../controllers/adminController.js";
import auth from "../middleware/authMiddleware.js";
import role from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/users", auth, role("admin"), getAllUsers);

router.put("/link-parent", auth, role("admin"), linkParentToStudent);

export default router;
