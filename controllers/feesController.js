import Fees from "../models/Fees.js";


export const getMyFees = async (req, res) => {
  try {
    let fees = await Fees.findOne({ student: req.user.id });

    if (!fees) {
      fees = await Fees.create({
        student: req.user.id,
        semesters: {
          sem1: { paid: false, amount: 0 },
          sem2: { paid: false, amount: 0 },
          sem3: { paid: false, amount: 0 },
          sem4: { paid: false, amount: 0 },
          sem5: { paid: false, amount: 0 },
          sem6: { paid: false, amount: 0 },
          sem7: { paid: false, amount: 0 },
          sem8: { paid: false, amount: 0 },
        },
      });
    }

    res.status(200).json(fees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const approveSemesterFee = async (req, res) => {
  try {
    const { studentId, semester } = req.params;

    const fees = await Fees.findOne({ student: studentId });
    if (!fees) {
      return res.status(404).json({ message: "Fees record not found" });
    }

    if (!fees.semesters[semester]) {
      return res.status(400).json({ message: "Invalid semester" });
    }

    fees.semesters[semester].paid = true;
    await fees.save();

    res.status(200).json({
      message: `${semester} approved successfully`,
      fees,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudentFees = async (req, res) => {
  try {
    const { studentId } = req.params;

    let fees = await Fees.findOne({ student: studentId });

    if (!fees) {
      return res.status(404).json({ message: "Fees record not found" });
    }

    res.status(200).json(fees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
