const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
});

module.exports = mongoose.model('Transaction', TransactionSchema);
