import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    reason: String,
    fromDate: Date,
    toDate: Date,

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("LeaveRequest", leaveSchema);
