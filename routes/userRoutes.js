const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Deposit = require('../models/Deposit');

// উইথড্র করার রাউট
router.post('/withdraw', async (req, res) => {
    try {
        const { userId, amount, binancePayId } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        if (amount < 350) return res.status(400).json({ success: false, message: 'Minimum withdrawal is 350 BDT' });
        if (user.balance < amount) return res.status(400).json({ success: false, message: 'Insufficient balance' });
        if (!binancePayId) return res.status(400).json({ success: false, message: 'Binance Pay ID is required' });

        user.balance -= amount;
        await user.save();
        res.status(200).json({ success: true, message: 'Withdrawal request submitted successfully to Binance Pay!' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ডেইলি চেক-ইন রাউট
router.post('/daily-check-in', async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const today = new Date().toDateString();
        if (user.lastCheckInDate === today) {
            return res.status(400).json({ success: false, message: 'You have already checked in today!' });
        }

        user.balance += 20;
        user.lastCheckInDate = today;
        await user.save();

        res.status(200).json({ success: true, message: 'Check-in successful! +20 BDT added.' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ডিপোজিট সাবমিট করার রাউট (নতুন যোগ করা হলো)
router.post('/deposit', async (req, res) => {
    try {
        const { userId, amount, binancePayId } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        if (!amount || amount <= 0) return res.status(400).json({ success: false, message: 'Invalid amount' });
        if (!binancePayId) return res.status(400).json({ success: false, message: 'Binance Pay ID is required' });

        const newDeposit = new Deposit({
            userId,
            amount,
            binancePayId,
            status: 'pending'
        });

        await newDeposit.save();
        res.status(200).json({ success: true, message: 'Deposit request submitted successfully! Waiting for admin approval.' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
