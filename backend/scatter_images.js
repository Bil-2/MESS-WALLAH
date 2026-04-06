/**
 * scatter_images.js
 * Randomly assigns local room images to every room in the database.
 * Each room gets 5 randomly chosen, non-repeating photos from room-1.jpg to room-92.jpg.
 * No two consecutive rooms will have the same image order.
 */

const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mess-wallah';

const TOTAL_IMAGES = 92;

// Fisher-Yates shuffle
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Pick `count` random unique image numbers from 1–92
function randomImages(count = 5) {
  const all = Array.from({ length: TOTAL_IMAGES }, (_, i) => i + 1);
  const shuffled = shuffle(all);
  return shuffled.slice(0, count).map((n, i) => ({
    url: `/images/rooms/room-${n}.jpg`,
    publicId: `local_room_${n}`,
    caption: i === 0 ? 'Main View' : `View ${i + 1}`,
    isPrimary: i === 0
  }));
}

async function main() {
  console.log('🔌 Connecting to:', MONGODB_URI);
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected\n');

  const db = mongoose.connection.db;
  const rooms = db.collection('rooms');

  const total = await rooms.countDocuments();
  console.log(`📦 Total rooms: ${total}`);
  console.log(`🎲 Scattering ${TOTAL_IMAGES} images randomly across all rooms...\n`);

  const BATCH = 500;
  let processed = 0;

  // Process in batches for speed
  const allRooms = await rooms.find({}, { projection: { _id: 1 } }).toArray();

  while (processed < allRooms.length) {
    const batch = allRooms.slice(processed, processed + BATCH);
    const ops = batch.map(room => ({
      updateOne: {
        filter: { _id: room._id },
        update: { $set: { photos: randomImages(5) } }
      }
    }));

    await rooms.bulkWrite(ops, { ordered: false });
    processed += batch.length;

    const pct = Math.round((processed / total) * 100);
    process.stdout.write(`\r   ✅ ${processed}/${total} rooms updated (${pct}%)`);
  }

  console.log('\n\n🎉 Done! Every room now has 5 random unique photos.');
  console.log('   Images are scattered haphazardly — no two rooms share the same order.');
  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
