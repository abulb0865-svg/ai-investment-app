const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    telegramId: { type: String, unique: true, sparse: true }, // টেলিগ্রাম আইডির জন্য
    userId: { type: String },
    phone: { type: String, default: 'N/A' }, // required: true বাদ দেওয়া হলো
    password: { type: String, default: 'telegram_user' }, // required: true বাদ দেওয়া হলো
    balance: { type: Number, default: 0 },
    referredBy: { type: String, default: null },
    totalTeamDeposit: { type: Number, default: 0 },
    lastCheckInDate: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
