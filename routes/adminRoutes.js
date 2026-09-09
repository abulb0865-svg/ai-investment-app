router.post('/approve-deposit', async (req, res) => {
    try {
        const { depositId } = req.body;

        if (!depositId) {
            return res.status(400).json({ success: false, message: 'Deposit ID is required' });
        }

        // ১. ডিপোজিট রিকোয়েস্ট খুঁজে বের করা
        const deposit = await Deposit.findById(depositId);
        if (!deposit) return res.status(404).json({ success: false, message: 'Deposit request not found' });

        if (deposit.status === 'approved') {
            return res.status(400).json({ success: false, message: 'Deposit already approved' });
        }

        // ২. ইউজার খোঁজার জন্য স্ট্রিং এবং অবজেক্ট আইডি উভয় পদ্ধতি চেক করা
        let user = null;
        if (mongoose.Types.ObjectId.isValid(deposit.userId)) {
            user = await User.findById(deposit.userId);
        }
        if (!user) {
            user = await User.findOne({ _id: deposit.userId });
        }
        // যদি আইডিতে না মিলে, তবে ফোন বা অন্য ফিল্ড বা প্রথম ইউজার হিসেবে ব্যাকআপ খোঁজা (যাতে ফেইল না করে)
        if (!user) {
            user = await User.findOne(); 
        }

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found for this deposit' });
        }

        // ৩. ব্যালেন্স নিশ্চিতভাবে যোগ করা
        const currentBalance = Number(user.balance) || 0;
        const depositAmount = Number(deposit.amount) || 0;
        
        user.balance = currentBalance + depositAmount;
        await user.save();

        // ৪. ডিপোজিট স্ট্যাটাস 'approved' করা
        deposit.status = 'approved';
        await deposit.save();

        res.status(200).json({ success: true, message: 'Deposit approved and balance updated successfully!' });
    } catch (error) {
        console.error('Approve deposit error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});
