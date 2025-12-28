import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      subjects,
      managedBranch,
      year,
      branch,
      batch,
      section,
    } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
    };

    if (role === "student") {
      if (!year || !branch || !batch || !section) {
        return res
          .status(400)
          .json({ message: "Student must have year, branch, batch, section" });
      }

      userData.year = year;
      userData.branch = branch;
      userData.batch = batch;
      userData.section = section;
    }

    if (
      (role === "teacher" || role === "lab_assistant") &&
      subjects &&
      Array.isArray(subjects)
    ) {
      userData.subjects = subjects;
    }

    if ((role === "hod" || role === "exam_head") && managedBranch) {
      userData.managedBranch = managedBranch;
    }

    const user = await User.create(userData);

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
