import Notice from "../models/Notice.js";

export const createNotice = async (req, res) => {
  const notice = await Notice.create({
    ...req.body,
    publishedBy: req.user._id,
  });
  res.status(201).json(notice);
};

export const getNotices = async (req, res) => {
  const notices = await Notice.find().sort({ createdAt: -1 });
  res.json(notices);
};
