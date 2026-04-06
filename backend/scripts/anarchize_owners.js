const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config({ path: path.join(__dirname, '../.env.local'), override: true });
const mongoose = require('mongoose');
const Room = require('../models/Room');

const firstNames = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
  'Shaurya', 'Atharv', 'Advik', 'Pranav', 'Rishab', 'Yash', 'Ananya', 'Diya', 'Sanya', 'Aarohi',
  'Shruti', 'Priya', 'Neha', 'Pooja', 'Riya', 'Kavya', 'Rohan', 'Karan', 'Vikram', 'Rahul',
  'Siddharth', 'Manish', 'Amit', 'Suresh', 'Ramesh', 'Rajesh', 'Vivek', 'Anil', 'Sunil', 'Vijay',
  'Ajay', 'Sanjay', 'Mukesh', 'Deepak', 'Tarun', 'Nitin', 'Alok', 'Vishal', 'Prakash', 'Gaurav'
];

const lastNames = [
  'Sharma', 'Verma', 'Gupta', 'Patel', 'Singh', 'Kumar', 'Das', 'Bose', 'Chatterjee', 'Banerjee',
  'Iyer', 'Pillai', 'Menon', 'Nair', 'Reddy', 'Rao', 'Yadav', 'Joshi', 'Mishra', 'Pandey',
  'Chauhan', 'Rajput', 'Bhatia', 'Kaur', 'Sethi', 'Malhotra', 'Mehra', 'Chopra', 'Kapoor', 'Ahuja',
  'Mehta', 'Desai', 'Patil', 'Bhatt', 'Trivedi', 'Jha', 'Tiwari', 'Garg', 'Agarwal', 'Bansal',
  'Sen', 'Roy', 'Saha', 'Mukherjee', 'Nath', 'Rathore', 'Shetty', 'Hegde', 'Gowda', 'Naidu'
];

const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];

// Generate a random Indian phone number
function generatePhoneNumber() {
  const prefixes = ['98', '99', '97', '96', '94', '93', '88', '89', '87', '70', '79', '77'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const body = Math.floor(10000000 + Math.random() * 90000000); // 8 digits
  return `+91${prefix}${body}`;
}

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    // Make an array of 500 distinct identities
    const identities = [];
    for (let i = 0; i < 500; i++) {
      const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const name = `${fName} ${lName}`;
      const domain = domains[Math.floor(Math.random() * domains.length)];
      const rv = Math.floor(Math.random() * 999);
      const email = `${fName.toLowerCase()}.${lName.toLowerCase()}${rv}@${domain}`;
      const phone = generatePhoneNumber();
      
      identities.push({ name, email, phone });
    }

    const rooms = await Room.find({}, '_id');
    console.log(`Found ${rooms.length} rooms. Preparing bulk operation...`);

    const bulkOps = rooms.map(room => {
      // Pick a random identity from our 500 pool
      const identity = identities[Math.floor(Math.random() * identities.length)];
      
      return {
        updateOne: {
          filter: { _id: room._id },
          update: {
            $set: {
              fakeOwnerData: {
                name: identity.name,
                phone: identity.phone,
                email: identity.email
              },
              ownerDetails: {
                name: identity.name,
                phone: identity.phone,
                email: identity.email
              }
            }
          }
        }
      };
    });

    console.log('Running bulkWrite...');
    const result = await Room.bulkWrite(bulkOps);
    console.log(`\nSuccess! Updated ${result.modifiedCount} rooms with fake Indian owner data.`);
    
    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
