/**
 * UPDATE ROOM IMAGES SCRIPT - HIGH QUALITY & VARIETY
 * Updates all existing rooms with 15 unique, high-quality images per room.
 */

const mongoose = require('mongoose');
const Room = require('./models/Room');
require('dotenv').config({ path: '.env.production' });
require('dotenv').config(); // Fallback

const MONGODB_URI = process.env.MONGODB_URI_PRODUCTION || process.env.MONGODB_URI;

// 60+ High Quality Unsplash Images (Curated for Student Housing/Hostels/Appts)
const imagePool = [
  // BEDROOMS / DORMS
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
  'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&q=80',
  'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80',
  'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
  'https://images.unsplash.com/photo-1616594039964-40891a909d99?w=800&q=80',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
  'https://images.unsplash.com/photo-1522771753035-1a5b6562f329?w=800&q=80',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
  'https://images.unsplash.com/photo-1512918760513-955403756248?w=800&q=80',
  'https://images.unsplash.com/photo-1628994503718-47c3761749ba?w=800&q=80',
  'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80',
  'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80',
  'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=800&q=80',
  'https://images.unsplash.com/photo-1516455590571-18259e0df69e?w=800&q=80',
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80', // Soft lighting
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80', // Colorful
  'https://images.unsplash.com/photo-1616486338812-3aeee7ad97b4?w=800&q=80', // Modern bed
  'https://images.unsplash.com/photo-1617104551722-3b2d51366400?w=800&q=80', // Luxury bed

  // LIVING AREAS / COMMON ROOMS
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80',
  'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80',
  'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80',
  'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80',
  'https://images.unsplash.com/photo-1595524366192-e71889709e35?w=800&q=80',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
  'https://images.unsplash.com/photo-1598928636135-d146006ff4be?w=800&q=80',
  'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&q=80',
  'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800&q=80', // Yellow couch
  'https://images.unsplash.com/photo-1560184897-67f4a3f9a7eb?w=800&q=80', // Modern gray
  'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&q=80', // Dining
  'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&q=80', // Kitchenette
  'https://images.unsplash.com/photo-1484154218962-a1c002085d2f?w=800&q=80', // Kitchen items

  // STUDY & WORKSPACES
  'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=80', // Desk
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', // Office
  'https://images.unsplash.com/photo-1510563800743-aed236490d08?w=800&q=80', // Study lamp
  'https://images.unsplash.com/photo-1519211975560-cd8343eb29b6?w=800&q=80', // Reading nook
  'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&q=80', // Computer

  // BATHROOMS
  'https://images.unsplash.com/photo-1552321911-2099bd04df0c?w=800&q=80',
  'https://images.unsplash.com/photo-1584622050111-993a426fbf0a?w=800&q=80',
  'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&q=80',
  'https://images.unsplash.com/photo-1552321854-32b0e64c12bb?w=800&q=80',

  // EXTERIORS / AMENITIES
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
  'https://images.unsplash.com/photo-1600596542815-e32c21597149?w=800&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80', // Dining table
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80', // Kitchen island
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80', // Doorway
  'https://images.unsplash.com/photo-1600210491892-03d54cc0fea0?w=800&q=80', // Gate
  'https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800&q=80'  // Garden
];

const updateImages = async () => {
  try {
    console.log('[UPDATE] Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('[UPDATE] ✅ Connected to MongoDB');

    const rooms = await Room.find({}, '_id');
    console.log(`[UPDATE] Found ${rooms.length} rooms to update.`);

    if (rooms.length === 0) {
      console.log('No rooms found. Exiting.');
      process.exit(0);
    }

    console.log('[UPDATE] Updating images for all rooms (15 images/room)...');

    const batchSize = 100;
    let updatedCount = 0;

    for (let i = 0; i < rooms.length; i += batchSize) {
      const batch = rooms.slice(i, i + batchSize);
      const updates = batch.map(room => {
        // Shuffle the entire image pool
        const shuffled = [...imagePool].sort(() => 0.5 - Math.random());

        // Pick first 15 distinct images
        const selectedImages = shuffled.slice(0, 15);

        const photos = selectedImages.map((url, index) => ({
          url: url,
          publicId: `room_${room._id}_${index}`,
          isPrimary: index === 0,
          verified: true
        }));

        return {
          updateOne: {
            filter: { _id: room._id },
            update: { $set: { photos: photos } }
          }
        };
      });

      await Room.bulkWrite(updates);
      updatedCount += updates.length;
      process.stdout.write(`\r[UPDATE] Progress: ${updatedCount} / ${rooms.length} rooms updated`);
    }

    console.log('\n[UPDATE] ✅ Successfully updated all room images with 15 variants!');
    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('[UPDATE] ❌ Error:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

updateImages();
