const TelegramBot = require('node-telegram-bot-api');

const token = '8837255512:AAFMmsQ_Kfq945sIfCBmW0rBLRry4yVsxYk';
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userName = msg.from.first_name || 'User';

    bot.sendMessage(chatId, `স্বাগতম ${userName}! AI Investment Mini App-A আপনাকে স্বাগতম। নিচে ক্লিক করে আপনার অ্যাপ ওপেন করুন:`, {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "🚀 Open App",
                        web_app: { url: "https://ai-investment-app-fasr.onrender.com" }
                    }
                ]
            ]
        }
    });
});

console.log('Telegram Bot is running...');
