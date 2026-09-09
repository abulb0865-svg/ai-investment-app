const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const Deposit = require('../models/Deposit');

// ১. পেন্ডিং ডিপোজিট লিস্ট ফেচ করার রাউট
router.get('/deposits', async (req, res) => {
    try {
        const deposits = await Deposit.find({ status: 'pending' });
        res.status(200).json(deposits);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ২. ডিপোজিট অ্যাপ্রুভ এবং ইউজারের ব্যালেন্স যোগ করার রাউট
router.post('/approve-deposit', async (req, res) => {
    try {
        const { depositId } = req.body;

        if (!depositId) {
            return res.status(400).json({ success: false, message: 'Deposit ID is required' });
        }

        // ডিপোজিট রিকোয়েস্ট খুঁজে বের করা
        const deposit = await Deposit.findById(depositId);
        if (!deposit) return res.status(404).json({ success: false, message: 'Deposit request not found' });

        if (deposit.status === 'approved') {
            return res.status(400).json({ success: false, message: 'Deposit already approved' });
        }

        // ইউজারকে খুঁজে বের করা (সঠিকভাবে ব্যালেন্স আপডেট করার জন্য)
        const user = await User.findOne({ 
            $or: [
                { _id: deposit.userId }, 
                { _id: mongoose.Types.ObjectId.isValid(deposit.userId) ? deposit.userId : null }
            ] 
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found for this deposit' });
        }

        // ব্যালেন্স যোগ করা
        user.balance = Number(user.balance || 0) + Number(deposit.amount || 0);
        await user.save();

        // ডিপোজিট স্ট্যাটাস 'approved' করা
        deposit.status = 'approved';
        await deposit.save();

        res.status(200).json({ success: true, message: 'Deposit approved and balance updated successfully!' });
    } catch (error) {
        console.error('Approve deposit error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
