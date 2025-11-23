const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

async function fixUserName() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mess-wallah');
    console.log('Connected to MongoDB');

    const User = require('./backend/models/User');
    
    // Find user with email biltubag29@gmail.com
    const user = await User.findOne({ email: 'biltubag29@gmail.com' });
    
    if (user) {
      console.log('Current name:', user.name);
      
      // Update name to "Biltu Bag"
      user.name = 'Biltu Bag';
      await user.save();
      
      console.log('✅ Updated name to:', user.name);
      console.log('Now logout and login again to see "BB" in avatar');
    } else {
      console.log('User not found');
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

fixUserName();
