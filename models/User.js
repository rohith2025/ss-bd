import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: [
        "student",
        "parent",
        "teacher",
        "hod",
        "lab_assistant",
        "exam_head",
        "admin",
      ],
      required: true,
    },

    year: {
      type: Number,
      enum: [1, 2, 3, 4],
    },

    branch: {
      type: String,
      trim: true,
    },

    batch: {
      type: String,
      trim: true,
    },

    section: {
      type: String,
      trim: true,
    },

    subjects: [
      {
        type: String,
        trim: true,
      },
    ],

    managedBranch: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
