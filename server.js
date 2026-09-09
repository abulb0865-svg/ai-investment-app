const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// টেলিগ্রাম বট লোড করা হচ্ছে
require('./bot');

// ক্লাউড ডাটাবেস (MongoDB Atlas) এর জন্য Environment Variable ব্যবহার করা হয়েছে
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ai-investment-app';

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected Successfully'))
.catch(err => console.log('MongoDB Connection Error: ', err));

// রাউটসমূহ
app.use('/api', require('./routes/authRoutes'));
app.use('/api', require('./routes/userRoutes'));
app.use('/api', require('./routes/depositRoutes')); // **এই লাইনটি যোগ করা হয়েছে**
app.use('/api/admin', require('./routes/adminRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
