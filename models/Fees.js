import mongoose from "mongoose";

const feesSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    type: {
      type: String,
      enum: ["academic", "hostel", "transport", "other"],
    },

    amount: Number,
    dueDate: Date,
    paid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Fees", feesSchema);
