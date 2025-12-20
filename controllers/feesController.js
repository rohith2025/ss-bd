import Fees from "../models/Fees.js";

export const getStudentFees = async (req, res) => {
  try {
    const fees = await Fees.findOne({ student: req.user.id });
    res.json(fees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
