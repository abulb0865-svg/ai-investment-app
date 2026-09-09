const express = require('express');
const router = express.Router();
const User = require('../models/User');

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
module.exports = router;
