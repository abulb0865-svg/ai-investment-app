const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/signup', async (req, res) => {
    try {
        const { phone, password, refCode } = req.body;
        const existingUser = await User.findOne({ phone });
        if (existingUser) return res.status(400).json({ success: false, message: 'Phone number already registered!' });

        const newUser = new User({ phone, password, referredBy: refCode || null });
        await newUser.save();
        res.status(200).json({ success: true, message: 'Account created successfully!' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { phone, password } = req.body;
        const user = await User.findOne({ phone, password });
        if (!user) return res.status(400).json({ success: false, message: 'Invalid phone or password!' });

        res.status(200).json({ success: true, message: 'Login successful!', userId: user._id, balance: user.balance });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
