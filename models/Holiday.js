import mongoose from "mongoose";

const holidaySchema = new mongoose.Schema(
  {
    name: String,
    date: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Holiday", holidaySchema);
