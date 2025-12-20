import Transaction from "../models/Transaction.js";

export const createTransaction = async (req, res) => {
  const transaction = await Transaction.create({
    student: req.user._id,
    amount: req.body.amount,
    paymentMode: req.body.paymentMode,
    referenceId: req.body.referenceId,
  });

  res.status(201).json(transaction);
};

export const getAllTransactions = async (req, res) => {
  const transactions = await Transaction.find().populate(
    "student",
    "name email"
  );
  res.json(transactions);
};
