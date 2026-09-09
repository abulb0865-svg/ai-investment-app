const TelegramBot = require('node-telegram-bot-api');

// আপডেট করা সঠিক টোকেন এখানে বসানো হলো
const token = '8837255512:AAGLKsoyGpIvmmBi2IHVQb24fTNmZxqS_IE';
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
