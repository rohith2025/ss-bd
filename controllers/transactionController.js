import Transaction from "../models/Transaction.js";

// Create fee transaction
export const createTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.create({
      student: req.user._id,
      amount: req.body.amount,
      paymentMode: req.body.paymentMode,
      referenceId: req.body.referenceId,
      status: "success",
    });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin views all transactions
export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate(
      "student",
      "name email"
    );
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
