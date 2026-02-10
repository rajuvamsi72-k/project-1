const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");

const router = express.Router();

router.use(authMiddleware);

router.post("/add", addExpense);
router.get("/", getExpenses);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

module.exports = router;
