const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema({
  category: String,
  amount: Number,
});

module.exports = mongoose.model("Budget", BudgetSchema);
