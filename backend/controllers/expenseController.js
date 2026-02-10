const Expense = require("../models/Expense");
const mongoose = require("mongoose");

// Add expense
exports.addExpense = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;
    if (!title || !amount || !category) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const expense = await Expense.create({
      user: req.user._id,
      title,
      amount,
      category,
      date,
    });

    res.status(201).json({ message: "Expense added successfully", expense });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all expenses
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update expense
exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, category, date } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid expense ID" });
    }

    const expense = await Expense.findOne({ _id: id, user: req.user._id });
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    if (title) expense.title = title;
    if (amount) expense.amount = amount;
    if (category) expense.category = category;
    if (date) expense.date = date;

    await expense.save();
    res.json({ message: "Expense updated successfully", expense });
  } catch (error) {
    console.error("Update Expense Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete expense
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid expense ID" });
    }

    const expense = await Expense.findOne({ _id: id, user: req.user._id });
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    await expense.deleteOne();
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Delete Expense Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
