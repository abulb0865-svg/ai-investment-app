const TelegramBot = require('node-telegram-bot-api');

const token = '8837255512:AAFMmsQ_Kfq945sIfCBmW0rBLRry4yVsxYk';

// পোলিং সম্পূর্ণ বন্ধ রাখা হলো যাতে কোনো 409 Conflict এরর না আসে
const bot = new TelegramBot(token, { polling: false });

console.log('Telegram Bot is idle (polling disabled to prevent conflicts).');

module.exports = bot;
