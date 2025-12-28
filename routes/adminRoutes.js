import express from "express";
import auth from "../middleware/authMiddleware.js";
import role from "../middleware/roleMiddleware.js";
import UserLink from "../models/UserLink.js";
import { getAllUsers } from "../controllers/adminController.js";

const router = express.Router();

router.get("/users", auth, role("admin"), getAllUsers);


router.put("/link-user", auth, role("admin"), async (req, res) => {
  try {
    const { studentId, parentId, teacherIds, hodId, examHeadId } = req.body;

    if (!studentId || !parentId || !teacherIds || !hodId || !examHeadId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const link = await UserLink.findOneAndUpdate(
      { student: studentId },
      {
        parent: parentId,
        teachers: teacherIds, 
        hod: hodId,
        examHead: examHeadId,
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      message: "Student linked successfully to parent, teachers, HOD, and exam head",
      link,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
