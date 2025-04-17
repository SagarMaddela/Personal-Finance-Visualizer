const express = require("express");
const router = express.Router();
const Budget = require("../models/Budget");

// GET all budgets
router.get("/", async (req, res) => {
  const budgets = await Budget.find({});
  const budgetMap = {};
  budgets.forEach(b => budgetMap[b.category] = b.amount);
  res.json(budgetMap);
});

// POST or update budgets
router.post("/", async (req, res) => {
  const incoming = req.body;
  for (const [category, amount] of Object.entries(incoming)) {
    await Budget.findOneAndUpdate(
      { category },
      { amount },
      { upsert: true, new: true }
    );
  }
  res.json({ message: "Budgets saved successfully" });
});

module.exports = router;
