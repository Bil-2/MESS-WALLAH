/**
 * MESS-WALLAH India-Clean Seed Script
 * ──────────────────────────────────────────────────────────────────
 * Reads /Users/biltubag/Downloads/xxxx/india-clean.json
 * For EVERY state → every district → every city:
 *   - Creates exactly 10 rooms
 *   - Rooms #1-2  → BOOKED  (isAvailable: false, isOccupied: true)
 *   - Rooms #3-10 → AVAILABLE (isAvailable: true,  isOccupied: false)
 *
 * Room structure kept 100% identical to original seedRooms.js
 *
 * Run: node seedFromIndiaClean.js
 * (Updated: 10 rooms per city | 8 available + 2 booked)
 */

const mongoose  = require('mongoose');
const dotenv    = require('dotenv');
const path      = require('path');
const fs        = require('fs');

dotenv.config({ path: path.resolve(__dirname, '.env') });

// ─── DB Connection ────────────────────────────────────────────────
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mess-wallah';

// ─── Minimal Schemas (no middleware overhead during seeding) ──────
const roomSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const userSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

let Room, User;
try { Room = mongoose.model('Room'); } catch { Room = mongoose.model('Room', roomSchema); }
try { User = mongoose.model('User'); } catch { User = mongoose.model('User', userSchema); }

// ─── Reference Data (identical to seedRooms.js) ───────────────────
const ROOM_TYPES = ['single', 'shared', 'studio', 'apartment'];

const AMENITIES_POOL = [
  'wifi', 'ac', 'parking', 'laundry', 'kitchen', 'balcony',
  'furnished', 'gym', 'security', 'elevator', 'waterSupply',
  'powerBackup', 'tv', 'fridge', 'washingMachine', 'mess'
];

const TITLES = [
  'Cozy {type} Room in {city}',
  'Spacious {type} near Metro Station in {city}',
  'Fully Furnished {type} for Professionals in {city}',
  'Budget-Friendly {type} in Prime Location, {city}',
  'Premium {type} with Modern Amenities in {city}',
  'Well-Ventilated {type} near IT Hub in {city}',
  'Comfortable {type} for Working Professionals in {city}',
  'Affordable {type} for Students in {city}',
  'Luxury {type} with AC & WiFi in {city}',
  'Clean {type} with 24/7 Security in {city}',
  'Modern {type} with Balcony View in {city}',
  'Newly Renovated {type} Available Now in {city}',
  'Spacious {type} with Attached Bathroom in {city}',
  'Independent {type} in Gated Society, {city}',
  'PG-Style {type} All Bills Included in {city}',
];

const DESCS = [
  'A well-maintained room with excellent natural lighting and ventilation. Ideal for working professionals or students. Close to public transport, markets and hospitals.',
  'Spacious and clean accommodation in a secure building. All essential utilities included. Walking distance to metro station and shopping areas.',
  'Beautifully furnished room with modern interiors. Perfect for single occupancy. Peaceful neighborhood with 24/7 power backup and water supply.',
  'Affordable and comfortable staying option with all basic amenities. The locality has good connectivity and essential facilities nearby.',
  'Premium accommodation with high-speed WiFi and fully equipped kitchen. Best for IT professionals working in nearby tech parks.',
  'Hygienically maintained room in a safe gated society. Regular housekeeping available. Close to bus stops and local markets.',
  'Quiet and serene accommodation away from city noise yet well connected. Ideal for students and professionals seeking peaceful living.',
  'Modern studio setup with attached washroom and separate kitchen area. Fully furnished with appliances. Excellent for bachelor living.',
  'Bright and airy room with large windows. Located in prime residential area with all modern facilities. Suitable for couples or working professionals.',
  'Semi-furnished room in a friendly neighbourhood. 24/7 water and power supply. Close to schools, hospitals and shopping malls.',
];

const STREETS = [
  'MG Road', 'Gandhi Nagar Main Road', 'JP Nagar 5th Phase', 'Sector 14', 'Civil Lines',
  'Lake View Road', 'Green Park Extension', 'New Colony Street', '100 Feet Road', 'Service Road',
  'Ring Road', 'Outer Ring Road', 'Hosur Road', 'NH-48', 'BDA Complex Road'
];

const RULES_POOL = [
  ['No smoking inside', 'No pets allowed', 'Guests allowed till 10 PM', 'Quiet hours after 11 PM'],
  ['Vegetarian preferred', 'No loud music', 'Keep common areas clean'],
  ['No overnight guests', 'Bills shared equally', 'No alcohol on premises'],
  ['Working professionals preferred', 'Timely rent required', 'No parties'],
];

const TENANT_TYPES = ['All', 'Bachelor', 'Family', 'Couples', 'Student', 'Working Professional'];

// ─── Helpers ──────────────────────────────────────────────────────
const ri = (mn, mx) => Math.floor(Math.random() * (mx - mn + 1)) + mn;
const rp = (arr)    => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (a) => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};

// Generate stable "random" coordinates within India for a city
// Uses a simple deterministic hash from city+state string so same city
// always gets the same approximate location
function getCityCoords(city, state) {
  // India bounding box approx: lat 8–37, lng 68–97
  const seed = `${state}__${city}`;
  let h = 5381;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(h, 31) + seed.charCodeAt(i)) >>> 0;
  }
  // Map hash to lat/lng within India
  const lat = 8  + (h % 29000) / 1000;     // 8.0 – 37.0
  const lng = 68 + ((h >> 12) % 29000) / 1000; // 68.0 – 97.0
  return { lat: parseFloat(lat.toFixed(4)), lng: parseFloat(lng.toFixed(4)) };
}

// ─── Build One Room ───────────────────────────────────────────────
function makeRoom(globalIndex, city, district, state, ownerId, roomIndexInCity) {
  const roomType    = ROOM_TYPES[globalIndex % ROOM_TYPES.length];
  const titleTpl    = TITLES[globalIndex % TITLES.length];
  const title       = titleTpl
    .replace('{type}', roomType[0].toUpperCase() + roomType.slice(1))
    .replace('{city}', city);

  const baseRent = roomType === 'single'    ? ri(5000, 14000)
                 : roomType === 'shared'    ? ri(3500, 9000)
                 : roomType === 'studio'    ? ri(11000, 22000)
                 : ri(16000, 42000);

  const amenities = shuffle(AMENITIES_POOL).slice(0, ri(4, 11));

  // Use local room images — exactly as original seedRooms.js
  const numPhotos = ri(2, 5);
  const photos = Array.from({ length: numPhotos }, (_, p) => {
    const imgNum = ((globalIndex * 3 + p) % 92) + 1; // 92 local images
    return {
      url:        `/images/rooms/room-${imgNum}.jpg`,
      publicId:   `local_${globalIndex}_p${p}`,
      caption:    p === 0 ? 'Main View' : `Interior ${p}`,
      isPrimary:  p === 0,
      uploadType: 'uploaded',
      verified:   true,
    };
  });

  const baseCoords = getCityCoords(city, state);
  const coords = {
    lat: baseCoords.lat + (Math.random() - 0.5) * 0.08,
    lng: baseCoords.lng + (Math.random() - 0.5) * 0.08,
  };

  // ── AVAILABILITY RULE ─────────────────────────────────────────
  // roomIndexInCity 0-1  → BOOKED  (2 per city, always)
  // roomIndexInCity 2-9  → AVAILABLE (8 per city, always)
  const isBooked     = roomIndexInCity < 2;
  const isAvailable  = !isBooked;
  const isOccupied   = isBooked;

  return {
    owner:          ownerId,
    title,
    description:    DESCS[globalIndex % DESCS.length],
    roomType,
    rentPerMonth:   baseRent,
    securityDeposit: baseRent * ri(1, 3),
    address: {
      street:      `${ri(1, 300)}, ${rp(STREETS)}`,
      area:        district,
      city,
      district,
      state,
      pincode:     String(ri(100000, 999999)),
      coordinates: coords,
    },
    amenities,
    photos,
    rules:         rp(RULES_POOL),
    preferences:   [],
    tenantType:    [rp(TENANT_TYPES)],
    maxOccupancy:  roomType === 'shared' ? ri(2, 4) : 1,
    isActive:      true,
    isAvailable,
    isOccupied,
    featured:      globalIndex < 20,
    rating:        parseFloat((Math.random() * 2 + 3).toFixed(1)),
    totalReviews:  ri(0, 120),
    views:         ri(5, 2000),
    verified:      globalIndex % 4 !== 0,
    availableFrom: isAvailable ? new Date() : null,
    ownerDetails: {
      name:  `Owner ${(globalIndex % 500) + 1}`,
      phone: `9${ri(600000000, 999999999)}`,
      email: `owner${(globalIndex % 500) + 1}@messwallah.com`,
    },
  };
}

// ─── Main ─────────────────────────────────────────────────────────
async function seed() {
  console.log('\n🌏 MESS-WALLAH — India-Clean Seed Script');
  console.log('   10 rooms per city | 8 available + 2 booked\n');
  console.log(`🔌 Connecting to: ${MONGO_URI}`);

  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 15000 });
  console.log('✅ Connected to MongoDB\n');

  // ── Load india-clean.json ─────────────────────────────────────
  const jsonPath = '/Users/biltubag/Downloads/xxxx/india-clean.json';
  if (!fs.existsSync(jsonPath)) {
    console.error(`❌ File not found: ${jsonPath}`);
    process.exit(1);
  }
  const indiaData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  console.log(`📖 Loaded india-clean.json (${indiaData.states.length} states)\n`);

  // ── Count total cities ────────────────────────────────────────
  let totalCities = 0;
  for (const stateObj of indiaData.states) {
    for (const distObj of stateObj.districts) {
      totalCities += distObj.cities.length;
    }
  }
  const TOTAL_ROOMS = totalCities * 10;
  console.log(`📊 Total cities:  ${totalCities}`);
  console.log(`📊 Total rooms:   ${totalCities} × 10 = ${TOTAL_ROOMS}\n`);

  // ── Wipe existing rooms ───────────────────────────────────────
  const oldCount = await Room.countDocuments();
  if (oldCount > 0) {
    process.stdout.write(`🗑️  Deleting ${oldCount} existing rooms... `);
    await Room.deleteMany({});
    console.log('done.\n');
  }

  // ── Ensure owner ──────────────────────────────────────────────
  let owner = await User.findOne({ email: 'owner@messwallah.com' });
  if (!owner) {
    owner = await User.create({
      name:       'Mess Wallah Admin',
      email:      'owner@messwallah.com',
      password:   '$2b$12$LQv3c1yqBwEHFl.Q3W9qfO9glS9K9dMzOC2iINNFxeASaTYR2SMSC',
      phone:      '9876543210',
      role:       'owner',
      isVerified: true,
    });
    console.log('👤 Owner created:', owner._id);
  } else {
    console.log('👤 Owner found:', owner._id);
  }

  const ownerId = owner._id;

  // ── Seed rooms ────────────────────────────────────────────────
  const BATCH_SIZE   = 500;
  let batch          = [];
  let totalInserted  = 0;
  let globalIndex    = 0;
  const startTime    = Date.now();

  console.log(`\n📦 Inserting ${TOTAL_ROOMS} rooms in batches of ${BATCH_SIZE}...\n`);

  for (const stateObj of indiaData.states) {
    const stateName = stateObj.state;

    for (const distObj of stateObj.districts) {
      const distName = distObj.district;

      for (const city of distObj.cities) {
        // 10 rooms per city: 2 booked (index 0-1) + 8 available (index 2-9)
        for (let r = 0; r < 10; r++) {
          batch.push(makeRoom(globalIndex, city, distName, stateName, ownerId, r));
          globalIndex++;

          if (batch.length >= BATCH_SIZE) {
            await Room.insertMany(batch, { ordered: false });
            totalInserted += batch.length;
            batch = [];
            const pct  = Math.round((totalInserted / TOTAL_ROOMS) * 100);
            const secs = ((Date.now() - startTime) / 1000).toFixed(1);
            process.stdout.write(`\r   ✅ ${totalInserted}/${TOTAL_ROOMS} rooms  (${pct}%)  ${secs}s`);
          }
        }
      }
    }
  }

  // Flush remaining batch
  if (batch.length > 0) {
    await Room.insertMany(batch, { ordered: false });
    totalInserted += batch.length;
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n\n🎉 Done! Inserted ${totalInserted} rooms in ${elapsed}s\n`);

  // ── Summary ───────────────────────────────────────────────────
  const available = await Room.countDocuments({ isAvailable: true });
  const booked    = await Room.countDocuments({ isAvailable: false });

  console.log('📊 Database Summary:');
  console.log(`   Total rooms  : ${totalInserted}`);
  console.log(`   Available    : ${available}  (8 per city)`);
  console.log(`   Booked       : ${booked}    (2 per city)`);

  // Top states
  const byState = await Room.aggregate([
    { $group: { _id: '$address.state', count: { $sum: 1 } } },
    { $sort:  { count: -1 } },
    { $limit: 10 },
  ]);
  console.log('\n📊 Top 10 states by room count:');
  byState.forEach(r => console.log(`   ${r._id}: ${r.count}`));

  console.log('\n✅ Open http://localhost:5173/rooms to see all listings!\n');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('\n❌ Seed failed:', err.message);
  process.exit(1);
});
