import Fees from "../models/Fees.js";

export const getFees = async (req, res) => {
  const fees = await Fees.find({ student: req.user._id });
  res.json(fees);
};
