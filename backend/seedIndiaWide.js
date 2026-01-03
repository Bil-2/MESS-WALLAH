const mongoose = require('mongoose');
const Room = require('./models/Room');
const User = require('./models/User');
const Booking = require('./models/Booking');
require('dotenv').config();

// Comprehensive India Districts Data - All States and Major Districts
const INDIA_DISTRICTS = {
  // States (28)
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Rajahmundry", "Tirupati", "Kadapa", "Anantapur", "Vizianagaram"],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Tawang", "Ziro", "Bomdila", "Tezu", "Changlang"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia", "Tezpur", "Bongaigaon", "Dhubri", "Karimganj"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga", "Purnia", "Arrah", "Begusarai", "Katihar", "Munger"],
  "Chhattisgarh": ["Raipur", "Bilaspur", "Durg", "Bhilai", "Korba", "Rajnandgaon", "Raigarh", "Jagdalpur", "Ambikapur"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar", "Anand", "Mehsana"],
  "Haryana": ["Gurugram", "Faridabad", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal", "Sonipat", "Panchkula"],
  "Himachal Pradesh": ["Shimla", "Dharamshala", "Solan", "Mandi", "Kullu", "Hamirpur", "Una", "Bilaspur", "Chamba"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Hazaribagh", "Giridih", "Ramgarh", "Dumka"],
  "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Davangere", "Bellary", "Gulbarga", "Shimoga", "Tumkur"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Palakkad", "Alappuzha", "Kannur", "Kottayam", "Malappuram"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam", "Rewa"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Amravati", "Kolhapur", "Nanded", "Thane"],
  "Manipur": ["Imphal", "Thoubal", "Bishnupur", "Churachandpur", "Kakching"],
  "Meghalaya": ["Shillong", "Tura", "Jowai", "Nongstoin", "Williamnagar"],
  "Mizoram": ["Aizawl", "Lunglei", "Champhai", "Serchhip", "Kolasib"],
  "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri", "Balasore", "Bhadrak", "Baripada"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Pathankot", "Hoshiarpur", "Moga", "Batala"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara", "Alwar", "Bharatpur", "Sikar"],
  "Sikkim": ["Gangtok", "Namchi", "Gyalshing", "Mangan", "Rangpo"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Erode", "Vellore", "Thoothukudi", "Tiruppur"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar", "Ramagundam", "Mahbubnagar", "Nalgonda", "Adilabad"],
  "Tripura": ["Agartala", "Udaipur", "Dharmanagar", "Kailashahar", "Ambassa"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Meerut", "Allahabad", "Bareilly", "Aligarh", "Moradabad"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur", "Kashipur", "Rishikesh", "Nainital"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Balurghat", "Bardhaman", "Jalpaiguri", "Malda", "Kharagpur"],

  // Union Territories (8)
  "Andaman and Nicobar": ["Port Blair", "Car Nicobar", "Diglipur", "Mayabunder", "Rangat"],
  "Chandigarh": ["Chandigarh"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Diu", "Silvassa"],
  "Delhi": ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi"],
  "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Udhampur"],
  "Ladakh": ["Leh", "Kargil"],
  "Lakshadweep": ["Kavaratti", "Agatti", "Amini"],
  "Puducherry": ["Puducherry", "Karaikal", "Mahe", "Yanam"]
};

const ROOM_TYPES = ['single', 'shared', 'studio', 'apartment'];
const AMENITIES = ['wifi', 'ac', 'parking', 'laundry', 'kitchen', 'balcony', 'furnished', 'gym', 'security', 'elevator', 'waterSupply', 'powerBackup', 'tv', 'fridge', 'washingMachine', 'mess'];
const PHOTO_URLS = [
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600',
  'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600',
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600',
  'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600'
];

// Helper Functions
function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomElements(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRent(roomType) {
  const baseRents = {
    single: { min: 3000, max: 8000 },
    shared: { min: 2000, max: 5000 },
    studio: { min: 6000, max: 15000 },
    apartment: { min: 8000, max: 20000 }
  };
  const range = baseRents[roomType];
  return getRandomInt(range.min, range.max);
}

// Create Owner
async function createOwner(district, state) {
  const ownerNames = ['Rajesh Kumar', 'Sunita Patel', 'Amit Sharma', 'Priya Singh', 'Vikram Reddy'];
  const email = `owner.${district.toLowerCase().replace(/\s+/g, '')}@messwallah.com`;

  let owner = await User.findOne({ email });
  if (!owner) {
    owner = await User.create({
      name: getRandomElement(ownerNames),
      email,
      password: '$2a$10$abcdefghijklmnopqrstuv', // Pre-hashed dummy password
      phone: `+91${getRandomInt(7000000000, 9999999999)}`,
      role: 'owner',
      isVerified: true
    });
  }
  return owner;
}

// Generate Room Data
function generateRoom(owner, district, state, index) {
  const roomType = getRandomElement(ROOM_TYPES);
  const rent = generateRent(roomType);
  const amenitiesList = getRandomElements(AMENITIES, getRandomInt(3, 7));
  const photos = getRandomElements(PHOTO_URLS, getRandomInt(2, 4)).map((url, idx) => ({
    url,
    publicId: `room_${Date.now()}_${index}_${idx}`,
    caption: idx === 0 ? 'Room View' : 'Interior View',
    isPrimary: idx === 0
  }));

  const roomTitles = [
    `Comfortable ${roomType.charAt(0).toUpperCase() + roomType.slice(1)} Room in ${district}`,
    `${roomType.charAt(0).toUpperCase() + roomType.slice(1)} Accommodation in ${district}`,
    `Modern ${roomType.charAt(0).toUpperCase() + roomType.slice(1)} Room near ${district} City Center`,
    `Affordable ${roomType.charAt(0).toUpperCase() + roomType.slice(1)} Stay in ${district}`,
    `Premium ${roomType.charAt(0).toUpperCase() + roomType.slice(1)} Room in ${district}`
  ];

  return {
    owner: owner._id,
    title: roomTitles[index % roomTitles.length],
    description: `${roomType.charAt(0).toUpperCase() + roomType.slice(1)} room in ${district}, ${state} with all necessary facilities. Perfect for students and working professionals.`,
    roomType,
    rentPerMonth: rent,
    securityDeposit: rent * 2,
    address: {
      street: `${getRandomInt(100, 999)}, Main Road`,
      area: `${district} Central`,
      city: district,
      state: state,
      pincode: `${getRandomInt(100000, 999999)}`
    },
    amenities: amenitiesList,
    photos,
    rules: [],
    preferences: [],
    availableFrom: new Date(),
    maxOccupancy: roomType === 'apartment' ? 4 : roomType === 'shared' ? 3 : roomType === 'double' ? 2 : 1,
    isActive: true,
    isAvailable: true,
    featured: Math.random() > 0.8,
    verified: Math.random() > 0.5,
    rating: parseFloat((4 + Math.random()).toFixed(1)),
    totalReviews: getRandomInt(0, 50)
  };
}

// Seed Database
async function seedDatabase() {
  try {
    console.log('🚀 Starting India-Wide Database Seeding...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mess-wallah');
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    console.log('🗑️  Clearing existing rooms and bookings...');
    await Room.deleteMany({});
    await Booking.deleteMany({});
    console.log('✅ Existing data cleared\n');

    let totalRooms = 0;
    let totalBookings = 0;
    const allRooms = [];

    // Create rooms for each district in each state
    for (const [state, districts] of Object.entries(INDIA_DISTRICTS)) {
      console.log(`\n📍 Processing ${state}...`);

      for (const district of districts) {
        const owner = await createOwner(district, state);

        // Create 5 rooms per district
        const districtRooms = [];
        for (let i = 0; i < 5; i++) {
          const roomData = generateRoom(owner, district, state, i);
          const room = await Room.create(roomData);
          districtRooms.push(room);
          totalRooms++;
        }

        allRooms.push(...districtRooms);

        // Create 1 booking for this district
        const bookedRoom = districtRooms[0];
        const tenantEmail = `tenant.${district.toLowerCase().replace(/\s+/g, '')}@example.com`;

        let tenant = await User.findOne({ email: tenantEmail });
        if (!tenant) {
          tenant = await User.create({
            name: `Student ${district}`,
            email: tenantEmail,
            password: '$2a$10$abcdefghijklmnopqrstuv',
            phone: `+91${getRandomInt(7000000000, 9999999999)}`,
            role: 'user',
            isVerified: true
          });
        }


        const checkIn = new Date();
        checkIn.setDate(checkIn.getDate() + getRandomInt(1, 30));
        const duration = getRandomInt(1, 12);

        await Booking.create({
          roomId: bookedRoom._id,
          userId: tenant._id,
          ownerId: owner._id,
          checkInDate: checkIn,
          duration,
          status: 'confirmed',
          pricing: {
            monthlyRent: bookedRoom.rentPerMonth,
            securityDeposit: bookedRoom.securityDeposit,
            totalAmount: bookedRoom.rentPerMonth * duration + bookedRoom.securityDeposit
          },
          seekerInfo: {
            name: tenant.name,
            phone: tenant.phone,
            email: tenant.email
          },
          paymentStatus: 'completed',
          paymentDetails: {
            paymentMethod: 'razorpay',
            paidAmount: bookedRoom.rentPerMonth * duration + bookedRoom.securityDeposit
          }
        });

        totalBookings++;

        process.stdout.write(`   ${district}: ✅ 5 rooms + 1 booking created\r`);
      }
      console.log(`\n✅ ${state}: ${districts.length} districts completed`);
    }

    console.log('\n\n' + '='.repeat(60));
    console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log(`📊 Total States/UTs: ${Object.keys(INDIA_DISTRICTS).length}`);
    console.log(`📊 Total Districts: ${Object.values(INDIA_DISTRICTS).flat().length}`);
    console.log(`🏠 Total Rooms Created: ${totalRooms}`);
    console.log(`📅 Total Bookings Created: ${totalBookings}`);
    console.log('='.repeat(60));
    console.log('\n✅ Database is ready for use!\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

// Run seeding
seedDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
