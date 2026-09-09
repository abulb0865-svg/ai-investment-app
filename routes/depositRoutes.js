const express = require('express');
const router = express.Router();
const Deposit = require('../models/Deposit');

router.post('/deposit', async (req, res) => {
    try {
        const { userId, amount, usdAmount, trxId } = req.body;
        
        if (!userId || !amount || !trxId) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const newDeposit = new Deposit({
            userId,
            amount,
            usdAmount,
            trxId,
            status: 'pending'
        });

        await newDeposit.save();
        res.status(200).json({ success: true, message: 'Deposit request submitted successfully!' });
    } catch (error) {
        console.error('Deposit error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
