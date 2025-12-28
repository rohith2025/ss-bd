import Notification from "../models/Notification.js";


export const createNotification = async (req, res) => {
  try {
    const { title, message, type } = req.body;

    const notification = await Notification.create({
      title,
      message,
      type,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Notification created successfully",
      notification,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "name role");

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
