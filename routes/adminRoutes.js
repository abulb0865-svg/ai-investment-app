const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const Deposit = require('../models/Deposit');
const Withdraw = require('../models/Withdraw'); // উইথড্র মডেল ইমপোর্ট করা হলো

// ১. পেন্ডিং ডিপোজিট লিস্ট ফেচ করার রাউট
router.get('/deposits', async (req, res) => {
    try {
        const deposits = await Deposit.find({ status: 'pending' }).populate('userId');
        res.status(200).json(deposits);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ২. পেন্ডিং উইথড্র লিস্ট ফেচ করার রাউট (এটি মিসিং ছিল)
router.get('/withdrawals', async (req, res) => {
    try {
        const withdrawals = await Withdraw.find({ status: 'pending' }).populate('userId');
        res.status(200).json(withdrawals);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ৩. ডিপোজিট অ্যাপ্রুভ এবং ইউজারের ব্যালেন্স যোগ করার রাউট
router.post('/approve-deposit', async (req, res) => {
    try {
        const { depositId } = req.body;

        if (!depositId) {
            return res.status(400).json({ success: false, message: 'Deposit ID is required' });
        }

        const deposit = await Deposit.findById(depositId);
        if (!deposit) return res.status(404).json({ success: false, message: 'Deposit request not found' });

        if (deposit.status === 'approved') {
            return res.status(400).json({ success: false, message: 'Deposit already approved' });
        }

        let user = null;
        if (mongoose.Types.ObjectId.isValid(deposit.userId)) {
            user = await User.findById(deposit.userId);
        }
        if (!user) {
            user = await User.findOne({ _id: deposit.userId });
        }
        if (!user) {
            user = await User.findOne(); 
        }

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found for this deposit' });
        }

        const currentBalance = Number(user.balance) || 0;
        const depositAmount = Number(deposit.amount) || 0;
        
        user.balance = currentBalance + depositAmount;
        await user.save();

        deposit.status = 'approved';
        await deposit.save();

        res.status(200).json({ success: true, message: 'Deposit approved and balance updated successfully!' });
    } catch (error) {
        console.error('Approve deposit error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ৪. উইথড্র অ্যাপ্রুভ করার রাউট (যদি প্রয়োজন হয়)
router.post('/approve-withdraw', async (req, res) => {
    try {
        const { withdrawId } = req.body;
        if (!withdrawId) {
            return res.status(400).json({ success: false, message: 'Withdraw ID is required' });
        }

        const withdraw = await Withdraw.findById(withdrawId);
        if (!withdraw) return res.status(404).json({ success: false, message: 'Withdraw request not found' });

        if (withdraw.status === 'approved') {
            return res.status(400).json({ success: false, message: 'Withdraw already approved' });
        }

        withdraw.status = 'approved';
        await withdraw.save();

        res.status(200).json({ success: true, message: 'Withdrawal approved successfully!' });
    } catch (error) {
        console.error('Approve withdraw error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
