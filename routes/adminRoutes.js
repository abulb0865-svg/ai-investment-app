const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ডিপোজিট এপ্রুভ করার রাউট (ব্যালেন্স যোগ হবে)
router.post('/approve-deposit', async (req, res) => {
    try {
        const { userId, depositAmount } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        user.balance += depositAmount;
        await user.save();

        res.status(200).json({ success: true, message: 'Deposit approved successfully!' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// উইথড্র এপ্রুভ বা টাকা কেটে নেওয়ার রাউট
router.post('/approve-withdraw', async (req, res) => {
    try {
        const { userId, withdrawAmount } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        if (user.balance < withdrawAmount) {
            return res.status(400).json({ success: false, message: 'Insufficient user balance!' });
        }

        user.balance -= withdrawAmount;
        await user.save();

        res.status(200).json({ success: true, message: 'Withdrawal approved and balance deducted successfully!' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
