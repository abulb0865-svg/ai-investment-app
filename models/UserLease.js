const mongoose = require('mongoose');
const userLeaseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    planName: { type: String, required: true },
    dailyRevenue: { type: Number, required: true },
    leaseAmount: { type: Number, required: true },
    totalDays: { type: Number, required: true },
    daysPassed: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'completed'], default: 'active' },
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('UserLease', userLeaseSchema);
