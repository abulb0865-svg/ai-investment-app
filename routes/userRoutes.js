const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Deposit = require('../models/Deposit'); 
const Withdraw = require('../models/Withdraw'); 

// হেল্পার ফাংশন: ইউজার খুঁজে না পেলে অটো তৈরি করার জন্য
async function findOrCreateUser(identifier) {
    if (!identifier) return null;
    let user = await User.findOne({ 
        $or: [
            { _id: identifier.match(/^[0-9a-fA-F]{24}$/) ? identifier : null }, 
            { telegramId: identifier }, 
            { userId: identifier }
        ] 
    });
    return user;
}

// ১. ডিপোজিট রিকোয়েস্ট সাবমিট করার রাউট
router.post('/deposit', async (req, res) => {
    try {
        const { userId, amount, usdAmount, trxId } = req.body;
        
        let user = await findOrCreateUser(userId);
        if (!user) {
            // ইউনিক ফোন ও পাসওয়ার্ড সেট করা যাতে duplicate key error না আসে
            user = new User({ 
                telegramId: userId, 
                userId: userId, 
                balance: 0,
                password: 'telegram_auth_' + userId, 
                phone: 'tg_' + userId + '_' + Date.now() 
            });
            await user.save();
        }

        const newDeposit = new Deposit({
            userId: user._id,
            amount: amount || 0,
            usdAmount: usdAmount || 0,
            trxId: trxId || 'N/A',
            status: 'pending'
        });

        await newDeposit.save();

        res.status(200).json({ success: true, message: 'Deposit request submitted successfully! Waiting for admin approval.' });
    } catch (error) {
        console.error('Deposit error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ২. উইথড্র রিকোয়েস্ট সাবমিট করার রাউট
router.post('/withdraw', async (req, res) => {
    try {
        const { userId, amount, binancePayId } = req.body;
        let user = await findOrCreateUser(userId);
        if (!user) {
            user = new User({ 
                telegramId: userId, 
                userId: userId, 
                balance: 0,
                password: 'telegram_auth_' + userId, 
                phone: 'tg_' + userId + '_' + Date.now() 
            });
            await user.save();
        }

        if (amount < 350) return res.status(400).json({ success: false, message: 'Minimum withdrawal is 350 BDT' });
        if (user.balance < amount) return res.status(400).json({ success: false, message: 'Insufficient balance' });
        if (!binancePayId) return res.status(400).json({ success: false, message: 'Binance Pay ID is required' });

        user.balance -= amount;
        await user.save();

        const newWithdraw = new Withdraw({
            userId: user._id,
            amount,
            binancePayId,
            status: 'pending'
        });
        await newWithdraw.save();

        res.status(200).json({ success: true, message: 'Withdrawal request submitted successfully to Binance Pay!' });
    } catch (error) {
        console.error('Withdraw error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ৩. ডেইলি চেক-ইন রাউট
router.post('/daily-check-in', async (req, res) => {
    try {
        const { userId } = req.body;
        let user = await findOrCreateUser(userId);
        if (!user) {
            user = new User({ 
                telegramId: userId, 
                userId: userId, 
                balance: 0,
                password: 'telegram_auth_' + userId, 
                phone: 'tg_' + userId + '_' + Date.now() 
            });
            await user.save();
        }

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

module.exports = router;
