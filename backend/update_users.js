require('dotenv').config();
const mongoose = require('mongoose');

async function run() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mess-wallah';
    console.log('Connecting to', mongoUri);
    await mongoose.connect(mongoUri);
    const db = mongoose.connection.db;
    
    const users = await db.collection('users').find().limit(2).toArray();
    
    if (users.length < 2) {
      console.log('Not enough users in the DB to make one owner and one student. Found:', users.length);
      process.exit(0);
    }
    
    console.log(`Updating ${users[0].email} to role: owner`);
    await db.collection('users').updateOne({ _id: users[0]._id }, { $set: { role: 'owner' } });
    
    console.log(`Updating ${users[1].email} to role: student`);
    await db.collection('users').updateOne({ _id: users[1]._id }, { $set: { role: 'student' } });
    
    console.log('Successfully updated user roles.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
