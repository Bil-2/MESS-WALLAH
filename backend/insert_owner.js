require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mess-wallah').then(async () => {
    try {
        let owner = await User.findOne({ email: 'owner@messwallah.com' });
        if (!owner) {
            owner = new User({
                name: 'Demo Owner',
                email: 'owner@messwallah.com',
                password: 'password123',
                role: 'owner',
                isVerified: true,
                isEmailVerified: true
            });
            await owner.save();
            console.log('Created owner user: owner@messwallah.com');
        } else {
            owner.role = 'owner';
            await owner.save();
            console.log('Owner user already exists, updated role to owner.');
        }

        const users = await User.find({}, 'email role');
        console.log('Current users:', users.map(u => u.email + ' -> ' + u.role));
    } catch (err) {
        console.error('Error:', err);
    } finally {
        process.exit(0);
    }
});
