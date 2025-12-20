import Notice from "../models/Notice.js";

// Admin creates notice
export const createNotice = async (req, res) => {
  try {
    const notice = await Notice.create({
      ...req.body,
      publishedBy: req.user._id,
    });
    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// All users view notices
export const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
