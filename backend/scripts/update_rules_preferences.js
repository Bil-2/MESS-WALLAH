const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config({ path: path.join(__dirname, '../.env.local'), override: true });
const mongoose = require('mongoose');
const Room = require('../models/Room');

const rulesMap = {
  single: [
    'No smoking indoors',
    'No alcohol',
    'Maintain cleanliness',
    'No late night parties',
    'No pets allowed'
  ],
  shared: [
    'No smoking',
    'No alcohol',
    'Maintain cleanliness',
    "Respect roommates' privacy",
    'Lights out by 11 PM',
    'No overnight guests allowed'
  ],
  studio: [
    'Maintain cleanliness',
    'No loud music after 10 PM',
    'Pets allowed with prior permission',
    'Smoking allowed in balcony only'
  ],
  apartment: [
    'Society guidelines must be strictly followed',
    'Proper garbage disposal is mandatory',
    'No structural changes allowed',
    'Maintenance charges to be paid separately',
    'No loud music after 10 PM'
  ]
};

const preferencesMap = {
  single: [
    'Students preferred',
    'Working professionals welcome',
    'Bachelors preferred'
  ],
  shared: [
    'Students preferred',
    'Working professionals welcome',
    'Friendly and cooperative roommates needed'
  ],
  studio: [
    'Working professionals preferred',
    'Couples welcome',
    'Bachelors welcome'
  ],
  apartment: [
    'Families preferred',
    'Working professionals welcome',
    'Long-term tenants preferred'
  ]
};

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const rooms = await Room.find({}, '_id roomType');
    console.log(`Found ${rooms.length} rooms. Preparing bulk operation...`);

    const bulkOps = rooms.map(room => {
      // Default fallback if somehow roomType is missing or invalid
      const type = room.roomType || 'single';
      const rules = rulesMap[type] || rulesMap['single'];
      const preferences = preferencesMap[type] || preferencesMap['single'];

      // Randomly pick 3-4 rules and 2-3 preferences to make them look a bit varied
      const shuffledRules = [...rules].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 3); // 3 or 4
      const shuffledPrefs = [...preferences].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 2); // 2 or 3
      
      return {
        updateOne: {
          filter: { _id: room._id },
          update: {
            $set: {
              rules: shuffledRules,
              preferences: shuffledPrefs
            }
          }
        }
      };
    });

    console.log('Running bulkWrite in batches to prevent memory limits...');
    
    // Process in batches of 1000
    const batchSize = 1000;
    let totalUpdated = 0;
    
    for (let i = 0; i < bulkOps.length; i += batchSize) {
        const batch = bulkOps.slice(i, i + batchSize);
        const result = await Room.bulkWrite(batch);
        totalUpdated += result.modifiedCount;
        console.log(`Processed batch ${i / batchSize + 1}, updated ${totalUpdated} total rooms...`);
    }

    console.log(`\nSuccess! Updated ${totalUpdated} rooms with custom rules and preferences.`);
    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
