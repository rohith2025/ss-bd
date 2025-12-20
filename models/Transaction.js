import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    amount: Number,
    paymentMode: String,
    referenceId: String,

    status: {
      type: String,
      default: "success",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
