const TelegramBot = require('node-telegram-bot-api');

// BotFather থেকে পাওয়া একদম সঠিক টোকেনটি এখানে বসাবেন
const token = 'আপনার_বটফেদার_থেকে_পাওয়া_সঠিক_টোকেনটি_এখানে_দিন';
const webAppUrl = 'https://ai-investment-app-ojpd.onrender.com'; 

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'স্বাগতম! নিচে ক্লিক করে আপনার এআই ইনভেস্টমেন্ট মিনি অ্যাপটি ওপেন করুন:', {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🚀 Open Mini App', web_app: { url: webAppUrl } }]
            ]
        }
    });
});

console.log('Telegram Bot is running with WebApp button...');
module.exports = bot;
