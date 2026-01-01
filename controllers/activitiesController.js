import Activities from "../models/Activities.js";
import UserLink from "../models/UserLink.js";

// Student submits activity (status = "pending")
export const addActivity = async (req, res) => {
  try {
    // If student is submitting, set status to pending
    const activityData = {
      ...req.body,
      status: req.user.role === "student" ? "pending" : req.body.status || "pending",
    };
    
    const activity = await Activities.create(activityData);
    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get activities with visibility rules:
// - Approved: visible to everyone
// - Pending/Rejected: visible only to student & exam_head
export const getActivities = async (req, res) => {
  try {
    const { studentId } = req.query;
    const userRole = req.user.role;
    const userId = req.user._id;

    let activities;

    if (userRole === "student" && studentId === userId.toString()) {
      // Student viewing their own activities - see all
      activities = await Activities.find({ student: studentId })
        .populate("approvedBy", "name email")
        .sort({ createdAt: -1 });
    } else if (userRole === "exam_head") {
      // Exam head can see all activities for their linked students
      const userLink = await UserLink.findOne({ examHead: userId });
      if (userLink && userLink.student.toString() === studentId) {
        activities = await Activities.find({ student: studentId })
          .populate("approvedBy", "name email")
          .sort({ createdAt: -1 });
      } else {
        // Only show approved activities for other students
        activities = await Activities.find({
          student: studentId,
          status: "approved",
        })
          .populate("approvedBy", "name email")
          .sort({ createdAt: -1 });
      }
    } else {
      // Others (parent, teacher, etc.) - only see approved
      activities = await Activities.find({
        student: studentId,
        status: "approved",
      })
        .populate("approvedBy", "name email")
        .sort({ createdAt: -1 });
    }

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Exam head approves/rejects activity
export const approveActivity = async (req, res) => {
  try {
    const { activityId } = req.params;
    const { status } = req.body; // "approved" or "rejected"
    const examHeadId = req.user._id;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const activity = await Activities.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Verify exam_head is linked to this student
    const userLink = await UserLink.findOne({
      student: activity.student,
      examHead: examHeadId,
    });

    if (!userLink) {
      return res
        .status(403)
        .json({ message: "Not authorized to approve this activity" });
    }

    activity.status = status;
    activity.approvedBy = examHeadId;
    await activity.save();

    res.json({
      message: `Activity ${status} successfully`,
      activity,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
