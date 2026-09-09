const express = require('express');
const router = express.Router();
const User = require('../models/User'); // আপনার ইউজারের ডাটাবেজ মডেল

// ইউজারের ব্যালেন্স পাওয়ার এপিআই
router.get('/user-balance', async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.json({ success: false, message: 'User ID missing' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, balance: user.balance || 0 });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
