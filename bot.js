const TelegramBot = require('node-telegram-bot-api');

const token = '8837255512:AAFMmsQ_Kfq945sIfCBmW0rBLRry4yVsxYk';
// রেন্ডার সার্ভারের লাইভ লিংকটি এখানে আপনার লিংক দিয়ে পরিবর্তন করে নিতে পারেন
const webAppUrl = 'https://ai-investment-app-ojpd.onrender.com'; 

// পোলিং চালু রাখা হলো যাতে ইউজাররা বট থেকে রিসিভ করতে পারে
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
