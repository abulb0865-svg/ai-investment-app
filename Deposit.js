const mongoose = require('mongoose');

const depositSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true }, 
    amount: { type: Number, required: true },
    binancePayId: { type: String, required: true },
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Deposit', depositSchema);
