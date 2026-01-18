/**
 * UPDATE ROOM IMAGES SCRIPT
 * Updates all existing rooms with diverse, high-quality real estate images from Unsplash.
 */

const mongoose = require('mongoose');
const Room = require('./models/Room');
require('dotenv').config({ path: '.env.production' });
require('dotenv').config(); // Fallback

const MONGODB_URI = process.env.MONGODB_URI_PRODUCTION || process.env.MONGODB_URI;

// 25+ High Quality Unsplash Images (Hostels, Bedrooms, Apartments)
const roomImages = [
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80', // Modern apartment
  'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80', // Cozy minimalist
  'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80', // Hostel bunk beds
  'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80', // Luxury bedroom
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80', // Loft apartment
  'https://images.unsplash.com/photo-1616594039964-40891a909d99?auto=format&fit=crop&w=800&q=80', // Modern bedroom
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80', // Chic interior
  'https://images.unsplash.com/photo-1522771753035-1a5b6562f329?auto=format&fit=crop&w=800&q=80', // Cozy room
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80', // Student housing
  'https://images.unsplash.com/photo-1512918760513-955403756248?auto=format&fit=crop&w=800&q=80', // White cottage
  'https://images.unsplash.com/photo-1628994503718-47c3761749ba?auto=format&fit=crop&w=800&q=80', // Hostel bunks
  'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80', // Elegant bedroom
  'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=800&q=80', // Rustic vibe
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80', // Bright dining
  'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80', // Living room
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80', // Colorful room
  'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80', // Modern living
  'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80', // Red house
  'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&w=800&q=80', // Cozy corner
  'https://images.unsplash.com/photo-1516455590571-18259e0df69e?auto=format&fit=crop&w=800&q=80', // Studio
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80', // Soft lighting
  'https://images.unsplash.com/photo-1595524366192-e71889709e35?auto=format&fit=crop&w=800&q=80', // Patio
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80', // Luxury home
  'https://images.unsplash.com/photo-1598928636135-d146006ff4be?auto=format&fit=crop&w=800&q=80', // Minimalist
  'https://images.unsplash.com/photo-1556020685-ae41abfc9365?auto=format&fit=crop&w=800&q=80'  // City view
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

    console.log('[UPDATE] Updating images for all rooms...');

    // Batch update logic for performance
    const batchSize = 500;
    let updatedCount = 0;

    for (let i = 0; i < rooms.length; i += batchSize) {
      const batch = rooms.slice(i, i + batchSize);
      const updates = batch.map(room => {
        // Assign 1-3 random photos to each room
        const numPhotos = Math.floor(Math.random() * 3) + 1;
        const photos = [];

        for (let j = 0; j < numPhotos; j++) {
          const randomImg = roomImages[Math.floor(Math.random() * roomImages.length)];
          photos.push({
            url: randomImg,
            publicId: `room_${room._id}_${j}`,
            isPrimary: j === 0,
            verified: true
          });
        }

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

    console.log('\n[UPDATE] ✅ Successfully updated all room images!');
    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('[UPDATE] ❌ Error:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

updateImages();
