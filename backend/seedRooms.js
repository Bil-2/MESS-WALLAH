/**
 * MESS-WALLAH Mega Seed Script — 8000+ rooms, fast bulk insert
 * Run: node seedRooms.js
 */
const mongoose = require('mongoose');
const dotenv   = require('dotenv');
const path     = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mess-wallah';
const TOTAL     = 8400;
const BATCH     = 500;   // insertMany batch size

// ── Minimal inline schemas (avoids middleware overhead during seeding) ────────
const roomSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const userSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
let Room, User;
try { Room = mongoose.model('Room'); } catch { Room = mongoose.model('Room', roomSchema); }
try { User = mongoose.model('User'); } catch { User = mongoose.model('User', userSchema); }

// ── Reference data ────────────────────────────────────────────────────────────
const CITIES = [
  { city:'Bangalore', state:'Karnataka',    pin:['560001','560034','560068','560095','560103'], lat:12.97, lng:77.59,
    areas:['Koramangala','Indiranagar','HSR Layout','Whitefield','Marathahalli','BTM Layout','Jayanagar','Malleshwaram','Bellandur','Electronic City'] },
  { city:'Mumbai',    state:'Maharashtra',  pin:['400001','400053','400076','400601','400066'], lat:19.07, lng:72.87,
    areas:['Andheri','Bandra','Powai','Thane','Borivali','Goregaon','Kurla','Mulund','Navi Mumbai','Dadar'] },
  { city:'Delhi',     state:'Delhi',        pin:['110001','110024','110045','110085','110017'], lat:28.61, lng:77.20,
    areas:['Lajpat Nagar','Karol Bagh','Dwarka','Rohini','Saket','Vasant Kunj','Malviya Nagar','Pitampura','Nehru Place','Janakpuri'] },
  { city:'Pune',      state:'Maharashtra',  pin:['411001','411027','411045','411014','411057'], lat:18.52, lng:73.85,
    areas:['Kothrud','Hinjewadi','Baner','Viman Nagar','Hadapsar','Wakad','Pimple Saudagar','Aundh','Shivajinagar','Camp'] },
  { city:'Hyderabad', state:'Telangana',    pin:['500001','500032','500084','500072','500018'], lat:17.38, lng:78.48,
    areas:['Gachibowli','Madhapur','Kondapur','Miyapur','Kukatpally','Secunderabad','Ameerpet','Jubilee Hills','Hitech City','Banjara Hills'] },
  { city:'Chennai',   state:'Tamil Nadu',   pin:['600001','600020','600040','600083','600044'], lat:13.08, lng:80.27,
    areas:['Adyar','Velachery','Anna Nagar','T. Nagar','Porur','Tambaram','Perambur','Chromepet','Sholinganallur','OMR'] },
  { city:'Kolkata',   state:'West Bengal',  pin:['700001','700019','700064','700091','700107'], lat:22.57, lng:88.36,
    areas:['Salt Lake','New Town','Park Street','Howrah','Dum Dum','Jadavpur','Behala','Tollygunge','Ballygunge','Rajarhat'] },
  { city:'Ahmedabad', state:'Gujarat',      pin:['380001','380006','380054','380058','380061'], lat:23.02, lng:72.57,
    areas:['Navrangpura','Vastrapur','Satellite','Maninagar','Bopal','Chandkheda','Gota','Thaltej','SG Highway','Prahlad Nagar'] },
  { city:'Jaipur',    state:'Rajasthan',    pin:['302001','302004','302017','302020','302033'], lat:26.91, lng:75.78,
    areas:['Malviya Nagar','Vaishali Nagar','Mansarovar','Jagatpura','Tonk Road','C Scheme','Bani Park','Raja Park','Sanganer','Sitapura'] },
  { city:'Noida',     state:'Uttar Pradesh',pin:['201301','201304','201306','201318','201309'], lat:28.53, lng:77.39,
    areas:['Sector 18','Sector 62','Sector 50','Sector 137','Greater Noida','Sector 15','Sector 44','Sector 63','Sector 125','Sector 29'] },
];

const ROOM_TYPES  = ['single','shared','studio','apartment'];

const AMENITIES_POOL = ['wifi','ac','parking','laundry','kitchen','balcony','furnished','gym',
  'security','elevator','waterSupply','powerBackup','tv','fridge','washingMachine','mess'];

const TITLES = [
  'Cozy {type} Room in {area}','Spacious {type} near Metro Station',
  'Fully Furnished {type} for Professionals','Budget-Friendly {type} in Prime Location',
  'Premium {type} with Modern Amenities','Well-Ventilated {type} near IT Hub',
  'Comfortable {type} for Working Professionals','Affordable {type} for Students',
  'Luxury {type} with AC & WiFi','Clean {type} with 24/7 Security',
  'Modern {type} with Balcony View','Newly Renovated {type} Available Now',
  'Spacious {type} with Attached Bathroom','Independent {type} in Gated Society',
  'PG-Style {type} All Bills Included',
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

const STREETS = ['MG Road','Gandhi Nagar Main Road','JP Nagar 5th Phase','Sector 14','Civil Lines',
  'Lake View Road','Green Park Extension','New Colony Street','100 Feet Road','Service Road',
  'Ring Road','Outer Ring Road','Hosur Road','NH-48','BDA Complex Road'];

const RULES_POOL = [
  ['No smoking inside','No pets allowed','Guests allowed till 10 PM','Quiet hours after 11 PM'],
  ['Vegetarian preferred','No loud music','Keep common areas clean'],
  ['No overnight guests','Bills shared equally','No alcohol on premises'],
  ['Working professionals preferred','Timely rent required','No parties'],
];

const TENANT_TYPES = ['All','Bachelor','Family','Couples','Student','Working Professional'];

// ── Helpers ───────────────────────────────────────────────────────────────────
const ri  = (mn, mx) => Math.floor(Math.random() * (mx - mn + 1)) + mn;
const rp  = arr      => arr[Math.floor(Math.random() * arr.length)];
const shuffle = a    => { const b=[...a]; for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];} return b; };

function makeRoom(i, ownerId) {
  const cityData  = CITIES[i % CITIES.length];
  const area      = rp(cityData.areas);
  const roomType  = ROOM_TYPES[i % ROOM_TYPES.length];
  const titleTpl  = TITLES[i % TITLES.length];
  const title     = titleTpl.replace('{type}', roomType[0].toUpperCase()+roomType.slice(1)).replace('{area}', area);

  const baseRent = roomType==='single'    ? ri(5000,14000)
                 : roomType==='shared'    ? ri(3500,9000)
                 : roomType==='studio'    ? ri(11000,22000)
                 : ri(16000,42000);

  const amenities = shuffle(AMENITIES_POOL).slice(0, ri(4,11));

  // Use local room images (200 images available)
  const numPhotos = ri(2, 5);
  const photos = Array.from({ length: numPhotos }, (_, p) => {
    const imgNum = ((i * 3 + p) % 200) + 1;
    return {
      url:        `/images/rooms/room-${imgNum}.jpg`,
      publicId:   `local_${i}_p${p}`,
      caption:    p === 0 ? 'Main View' : `Interior ${p}`,
      isPrimary:  p === 0,
      uploadType: 'uploaded',
      verified:   true,
    };
  });

  const coords = {
    lat: cityData.lat + (Math.random() - 0.5) * 0.12,
    lng: cityData.lng + (Math.random() - 0.5) * 0.12,
  };

  return {
    owner:           ownerId,
    title,
    description:     DESCS[i % DESCS.length],
    roomType,
    rentPerMonth:    baseRent,
    securityDeposit: baseRent * ri(1, 3),
    address: {
      street:      `${ri(1,300)}, ${rp(STREETS)}`,
      area,
      city:        cityData.city,
      state:       cityData.state,
      pincode:     rp(cityData.pin),
      coordinates: coords,
    },
    amenities,
    photos,
    rules:       rp(RULES_POOL),
    preferences: [],
    tenantType:  [rp(TENANT_TYPES)],
    maxOccupancy: roomType==='shared' ? ri(2,4) : 1,
    isActive:    true,
    isAvailable: Math.random() > 0.08,
    isOccupied:  false,
    featured:    i < 20,
    rating:      parseFloat((Math.random()*2+3).toFixed(1)),
    totalReviews:ri(0, 120),
    views:       ri(5, 2000),
    verified:    i % 4 !== 0,
    availableFrom: new Date(),
    ownerDetails: {
      name:  `Owner ${(i % 500) + 1}`,
      phone: `9${ri(600000000,999999999)}`,
      email: `owner${(i%500)+1}@messwallah.com`,
    },
  };
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function seed() {
  console.log(`\n🚀 MESS-WALLAH MEGA SEED — ${TOTAL} rooms\n`);
  console.log(`🔌 Connecting to: ${MONGO_URI}`);

  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 });
  console.log('✅ Connected\n');

  // Remove old rooms
  const old = await Room.countDocuments();
  if (old > 0) {
    process.stdout.write(`🗑️  Deleting ${old} existing rooms... `);
    await Room.deleteMany({});
    console.log('done.\n');
  }

  // Ensure owner exists
  let owner = await User.findOne({ email: 'owner@messwallah.com' });
  if (!owner) {
    owner = await User.create({
      name:'Mess Wallah Admin', email:'owner@messwallah.com',
      password:'$2b$12$LQv3c1yqBwEHFl.Q3W9qfO9glS9K9dMzOC2iINNFxeASaTYR2SMSC',
      phone:'9876543210', role:'owner', isVerified:true,
    });
    console.log('👤 Owner created:', owner._id);
  } else {
    console.log('👤 Owner found:', owner._id);
  }

  const ownerId = owner._id;
  const batches = Math.ceil(TOTAL / BATCH);
  let inserted  = 0;
  const start   = Date.now();

  console.log(`\n📦 Inserting ${TOTAL} rooms in ${batches} batches of ${BATCH}...\n`);

  for (let b = 0; b < batches; b++) {
    const from  = b * BATCH;
    const count = Math.min(BATCH, TOTAL - from);
    const docs  = Array.from({ length: count }, (_, k) => makeRoom(from + k, ownerId));

    await Room.insertMany(docs, { ordered: false });
    inserted += count;

    const pct  = Math.round((inserted / TOTAL) * 100);
    const secs = ((Date.now() - start) / 1000).toFixed(1);
    process.stdout.write(`\r   ✅ ${inserted}/${TOTAL} rooms  (${pct}%)  ${secs}s`);
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\n\n🎉 Done! Inserted ${inserted} rooms in ${elapsed}s\n`);

  // Summary by city
  const byCity = await Room.aggregate([
    { $group: { _id: '$address.city', count: { $sum: 1 } } },
    { $sort:  { count: -1 } },
  ]);
  console.log('📊 Rooms by city:');
  byCity.forEach(r => console.log(`   ${r._id}: ${r.count}`));

  console.log('\n✅ Open http://localhost:5173/rooms to see all listings!\n');
  await mongoose.disconnect();
}

seed().catch(err => { console.error('❌', err.message); process.exit(1); });
