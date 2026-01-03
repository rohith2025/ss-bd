import Activities from "../models/Activities.js";
import UserLink from "../models/UserLink.js";

export const addActivity = async (req, res) => {
  try {
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


export const getActivities = async (req, res) => {
  try {
    const { studentId } = req.query;
    const userRole = req.user.role;
    const userId = req.user._id;

    let activities;

    if (userRole === "student" && studentId === userId.toString()) {
      activities = await Activities.find({ student: studentId })
        .populate("approvedBy", "name email")
        .sort({ createdAt: -1 });
    } else if (userRole === "exam_head") {
      if (studentId) {
        const userLink = await UserLink.findOne({
          examHead: userId,
          student: studentId,
        });
        if (userLink) {
          activities = await Activities.find({ student: studentId })
            .populate("approvedBy", "name email")
            .populate("student", "name email branch year section")
            .sort({ createdAt: -1 });
        } else {
          activities = await Activities.find({
            student: studentId,
            status: "approved",
          })
            .populate("approvedBy", "name email")
            .sort({ createdAt: -1 });
        }
      } else {
        const userLinks = await UserLink.find({ examHead: userId });
        const studentIds = userLinks.map((link) => link.student);
        activities = await Activities.find({ student: { $in: studentIds } })
          .populate("approvedBy", "name email")
          .populate("student", "name email branch year section")
          .sort({ createdAt: -1 });
      }
    } else {
      if (!studentId) {
        return res.status(400).json({ message: "studentId is required" });
      }
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

export const approveActivity = async (req, res) => {
  try {
    const { activityId } = req.params;
    const { status } = req.body; 
    const examHeadId = req.user._id;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const activity = await Activities.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

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
