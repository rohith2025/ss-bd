import Holiday from "../models/Holiday.js";

// Admin adds holiday
export const createHoliday = async (req, res) => {
  try {
    const holiday = await Holiday.create(req.body);
    res.status(201).json(holiday);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// View holidays
export const getHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.find().sort({ date: 1 });
    res.json(holidays);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
