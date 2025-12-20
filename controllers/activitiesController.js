import Activities from "../models/Activities.js";

export const addActivity = async (req, res) => {
  const activity = await Activities.create(req.body);
  res.status(201).json(activity);
};

export const getActivities = async (req, res) => {
  const activities = await Activities.find({
    student: req.query.studentId,
  });
  res.json(activities);
};
