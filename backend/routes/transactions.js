const {
  addExpense,
  getExpense,
  deleteExpense,
} = require("../controllers/expense");
const {
  addIncome,
  getIncomes,
  deleteIncome,
} = require("../controllers/income");
const {
  addTransaction,
  getTransactions,
  deleteTransaction,
  updateTransaction,
} = require("../controllers/transaction");
const authMiddleware = require("../middleware/auth");
const ExpenseModel = require("../models/ExpenseModel");
const IncomeModel = require("../models/IncomeModel");
const User = require("../models/User");
const { getFinancialAdvice } = require("../service/chatGeminiService");

const router = require("express").Router();

router
  .post("/add-income", addIncome)
  .get("/get-incomes", getIncomes)
  .delete("/delete-income/:id", deleteIncome)
  .post("/add-expense", authMiddleware,addExpense)
  .get("/get-expenses", getExpense)
  .delete("/delete-expense/:id", deleteExpense)

  .post("/add-transaction", addTransaction)
  .get("/get-transactions", getTransactions)
  .delete("/delete-transaction/:id", deleteTransaction)
  .put("/update-transaction/:id", updateTransaction);


  
router.post("/financial-chatbot/chat", authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    
    const expenses = await ExpenseModel.find({ creator: req.user.id });
    
    // const budgets = await IncomeModel.find({ user: req.user.id });

    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    // const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);

    const userContext = {
      totalExpenses,
      // totalBudget,
    };
    const response = await getFinancialAdvice(userContext, message);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: "Failed to get financial advice" });
  }
});

module.exports = router;
