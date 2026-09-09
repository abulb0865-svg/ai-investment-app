const TelegramBot = require('node-telegram-bot-api');

const token = '8837255512:AAFMmsQ_Kfq945sIfCBmW0rBLRry4yVsxYk';

// Render বা প্রোডাকশন সার্ভারে পোলিং সচল রাখার জন্য কনফিগারেশন
const bot = new TelegramBot(token, { 
    polling: {
        interval: 300,
        autoStart: true,
        params: {
            timeout: 10
        }
    } 
});

// বটের পল্লিং এরর হ্যান্ডেল করার জন্য, যাতে সার্ভার ক্র্যাশ না করে
bot.on('polling_error', (error) => {
    // 409 কনফ্লিক্ট এরর হলে সেটি ইগ্নোর করবে বা লগ দেখাবে
    if (error.code === 'ETELEGRAM' && error.message.includes('409 Conflict')) {
        console.log('Telegram bot polling conflict handled (another instance might be running).');
    } else {
        console.error('Polling error:', error.code, error.message);
    }
});

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
