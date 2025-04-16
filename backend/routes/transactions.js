const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

router.get('/', async (req, res) => {
  const transactions = await Transaction.find().sort({ date: -1 });
  res.json(transactions);
});

router.get("/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});


router.post('/', async (req, res) => {
  const { description, amount, date } = req.body;
  const newTransaction = new Transaction({ description, amount, date });
  await newTransaction.save();
  res.json(newTransaction);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { description, amount, date } = req.body;

  try {
    const updated = await Transaction.findByIdAndUpdate(
      id,
      { description, amount, date },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});


router.delete('/:id', async (req, res) => {
  await Transaction.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
