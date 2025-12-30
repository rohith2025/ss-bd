import LeaveRequest from "../models/LeaveRequest.js";
import UserLink from "../models/UserLink.js";


export const applyLeave = async (req, res) => {
  try {
    const studentId = req.user.id;

    const link = await UserLink.findOne({ student: studentId });
    if (!link) {
      return res.status(404).json({ message: "Student linking not found" });
    }

    const leave = await LeaveRequest.create({
      student: studentId,
      parent: link.parent,
      hod: link.hod,
      fromDate: req.body.fromDate,
      toDate: req.body.toDate,
      reason: req.body.reason,
    });

    res.status(201).json({
      message: "Leave applied successfully",
      leave,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const parentAction = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { status } = req.body;

    const leave = await LeaveRequest.findById(leaveId);
    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    if (leave.parent.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (leave.parentStatus !== "pending") {
      return res.status(400).json({ message: "Already processed by parent" });
    }

    leave.parentStatus = status;

    if (status === "rejected") {
      leave.finalStatus = "rejected";
    }

    await leave.save();

    res.json({ message: "Parent action recorded", leave });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const hodAction = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { status } = req.body;

    const leave = await LeaveRequest.findById(leaveId);
    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    if (leave.hod.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (leave.parentStatus !== "approved") {
      return res
        .status(400)
        .json({ message: "Parent approval required first" });
    }

    leave.hodStatus = status;
    leave.finalStatus = status;

    await leave.save();

    res.json({ message: "HOD action recorded", leave });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getStudentLeaves = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ student: req.user._id })
      .sort({ createdAt: -1 })
      .select(
        "fromDate toDate reason parentStatus hodStatus finalStatus createdAt updatedAt"
      );

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getParentLeaves = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({
      parent: req.user.id,
    })
      .sort({ createdAt: -1 })
      .populate("student", "name email");

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHodLeaves = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({
      hod: req.user.id,
      parentStatus: "approved",
      hodStatus: "pending",
    })
      .sort({ createdAt: -1 })
      .populate("student", "name email")
      .populate("parent", "name email");

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
