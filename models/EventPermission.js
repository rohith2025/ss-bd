import mongoose from "mongoose";

const eventPermissionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    eventName: String,
    eventDate: Date,

    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("EventPermission", eventPermissionSchema);
