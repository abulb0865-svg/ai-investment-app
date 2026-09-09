const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// টেলিগ্রাম বটের পোলিং কনফ্লিক্ট বা সার্ভার ক্র্যাশ এড়াতে এই লাইনটি কমেন্ট বা বাদ দেওয়া হলো
// require('./bot');

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/ai-investment-app';

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected')).catch(err => console.log(err));

app.use('/api', require('./routes/authRoutes'));
app.use('/api', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
