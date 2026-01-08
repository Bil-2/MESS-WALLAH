/**
 * Complete India Room Database Seeder
 * Seeds minimum 5 rooms per district across all Indian states
 * Marks one room as booked (isAvailable = false, isOccupied = true) in each district
 */

const mongoose = require('mongoose');
const Room = require('./models/Room');
const User = require('./models/User');
require('dotenv').config();

// Complete India State-District Mapping
const indiaData = {
  "Andhra Pradesh": ["Alluri Sitharama Raju", "Anakapalli", "Anantapuramu", "Annamayya", "Bapatla", "Chittoor", "Dr. B.R. Ambedkar Konaseema", "East Godavari", "Eluru", "Guntur", "Kakinada", "Krishna", "Kurnool", "Nandyal", "NTR", "Palnadu", "Parvathipuram Manyam", "Prakasam", "Sri Potti Sriramulu Nellore", "Sri Sathya Sai", "Srikakulam", "Tirupati", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"],

  "Arunachal Pradesh": ["Anjaw", "Changlang", "Kamle", "Kra Daadi", "Kurung Kumey", "Lepa Rada", "Lohit", "Longding", "Lower Dibang Valley", "Lower Siang", "Lower Subansiri", "Namsai", "Pakke Kessang", "Papum Pare", "Shi Yomi", "Siang", "Tawang", "Tirap", "Upper Dibang Valley", "Upper Siang", "Upper Subansiri", "West Kameng", "West Siang", "Itanagar Capital Complex", "Keyi Panyor", "Bichom"],

  "Assam": ["Bajali", "Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Dima Hasao", "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup", "Kamrup Metropolitan", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Sivasagar", "Sonitpur", "South Salmara-Mankachar", "Tamulpur", "Tinsukia", "Udalguri", "West Karbi Anglong"],

  "Bihar": ["Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran"],

  "Chhattisgarh": ["Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bijapur", "Bilaspur", "Dantewada", "Dhamtari", "Durg", "Gariaband", "Gaurela-Pendra-Marwahi", "Janjgir-Champa", "Jashpur", "Kabirdham", "Kanker", "Kondagaon", "Korba", "Koriya", "Mahasamund", "Manendragarh-Chirmiri-Bharatpur", "Mohla-Manpur-Ambagarh Chowki", "Mungeli", "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sarangarh-Bilaigarh", "Sakti", "Sukma", "Surajpur", "Surguja", "Khairagarh-Chhuikhadan-Gandai"],

  "Goa": ["North Goa", "South Goa"],

  "Gujarat": ["Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"],

  "Haryana": ["Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram", "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh", "Nuh", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"],

  "Himachal Pradesh": ["Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul & Spiti", "Mandi", "Shimla", "Sirmaur", "Solan", "Una"],

  "Jharkhand": ["Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahibganj", "Seraikela-Kharsawan", "Simdega", "West Singhbhum"],

  "Karnataka": ["Bagalkote", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikballapur", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayapura", "Vijayanagara", "Yadgir"],

  "Kerala": ["Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"],

  "Madhya Pradesh": ["Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Narmadapuram", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla", "Mandsaur", "Morena", "Narsinghpur", "Neemuch", "Niwari", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha", "Mauganj", "Maihar", "Pandhurna"],

  "Maharashtra": ["Ahmednagar", "Akola", "Amravati", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Chhatrapati Sambhajinagar", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Dharashiv", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"],

  "Manipur": ["Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West", "Jiribam", "Kakching", "Kamjong", "Kangpokpi", "Noney", "Pherzawl", "Senapati", "Tamenglong", "Tengnoupal", "Thoubal", "Ukhrul"],

  "Meghalaya": ["East Garo Hills", "East Jaintia Hills", "East Khasi Hills", "Eastern West Khasi Hills", "North Garo Hills", "Ri Bhoi", "South Garo Hills", "South West Garo Hills", "South West Khasi Hills", "West Garo Hills", "West Jaintia Hills", "West Khasi Hills"],

  "Mizoram": ["Aizawl", "Champhai", "Hnahthial", "Khawzawl", "Kolasib", "Lawngtlai", "Lunglei", "Mamit", "Saiha", "Saitual", "Serchhip"],

  "Nagaland": ["Chümoukedima", "Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon", "Niuland", "Noklak", "Peren", "Phek", "Shamator", "Tseminyu", "Tuensang", "Wokha", "Zunheboto"],

  "Odisha": ["Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Deogarh", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghapur", "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar", "Khordha", "Koraput", "Malkangiri", "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Subarnapur", "Sundargarh"],

  "Punjab": ["Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Mansa", "Moga", "Muktsar", "Pathankot", "Patiala", "Rupnagar", "Sahibzada Ajit Singh Nagar", "Sangrur", "Shahid Bhagat Singh Nagar", "Tarn Taran", "Malerkotla"],

  "Rajasthan": ["Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur", "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand", "Sawai Madhopur", "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur", "Anupgarh", "Balotra", "Beawar", "Deeg", "Didwana-Kuchaman", "Dudu", "Gangapur City", "Kekri", "Kotputli-Behror", "Khairthal-Tijara", "Neem Ka Thana", "Phalodi", "Salumbar", "Sanchore", "Shahpura", "Jaipur Heritage", "Jodhpur Rural"],

  "Sikkim": ["Gangtok", "Gyalshing", "Mangan", "Namchi", "Pakyong", "Soreng"],

  "Tamil Nadu": ["Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kancheepuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"],

  "Telangana": ["Adilabad", "Bhadradri Kothagudem", "Hanumakonda", "Hyderabad", "Jagtial", "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam", "Kumuram Bheem Asifabad", "Mahabubabad", "Mahabubnagar", "Mancherial", "Medak", "Medchal-Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Ranga Reddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal", "Yadadri Bhuvanagiri"],

  "Tripura": ["Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala", "South Tripura", "Unakoti", "West Tripura"],

  "Uttar Pradesh": ["Agra", "Aligarh", "Prayagraj", "Ambedkar Nagar", "Amroha", "Auraiya", "Azamgarh", "Badaun", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Ayodhya", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddh Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kheri", "Kushinagar", "Lalitpur", "Lucknow", "Mahoba", "Maharajganj", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Rae Bareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"],

  "Uttarakhand": ["Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar", "Uttarkashi"],

  "West Bengal": ["Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Bardhaman", "Paschim Medinipur", "Purba Bardhaman", "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"]
};

// Room type variations
const roomTypes = ['single', 'shared', 'studio', 'apartment'];

// Sample amenities combinations
const amenitiesCombinations = [
  ['wifi', 'ac', 'parking', 'security', 'waterSupply', 'powerBackup'],
  ['wifi', 'furnished', 'kitchen', 'security', 'waterSupply'],
  ['wifi', 'ac', 'laundry', 'security', 'mess', 'powerBackup'],
  ['wifi', 'furnished', 'gym', 'elevator', 'parking', 'security'],
  ['wifi', 'ac', 'tv', 'fridge', 'washingMachine', 'balcony'],
  ['wifi', 'kitchen', 'security', 'waterSupply', 'powerBackup'],
];

// Sample rules
const rulesOptions = [
  ['No smoking', 'No pets', 'Quiet hours after 10 PM'],
  ['No smoking', 'Visitors allowed till 8 PM', 'Keep common areas clean'],
  ['No pets', 'No loud music', 'Rent due by 5th of every month'],
  ['No smoking', 'No alcohol', 'Maintain cleanliness'],
];

// Generate random price based on state (tier-based pricing)
const getPriceRange = (state) => {
  const tier1 = ['Maharashtra', 'Karnataka', 'Delhi', 'Tamil Nadu', 'Telangana', 'Gujarat'];
  const tier2 = ['Uttar Pradesh', 'West Bengal', 'Haryana', 'Punjab', 'Rajasthan', 'Kerala'];

  if (tier1.includes(state)) {
    return { min: 5000, max: 15000 };
  } else if (tier2.includes(state)) {
    return { min: 3000, max: 10000 };
  } else {
    return { min: 2000, max: 8000 };
  }
};

// Generate random pincode (realistic-ish)
const generatePincode = () => {
  return String(100000 + Math.floor(Math.random() * 899999));
};

// Generate room data
const generateRoom = (state, district, index, isBooked, ownerId) => {
  const priceRange = getPriceRange(state);
  const rentPerMonth = Math.floor(Math.random() * (priceRange.max - priceRange.min + 1)) + priceRange.min;
  const securityDeposit = rentPerMonth * (Math.random() > 0.5 ? 2 : 1);
  const roomType = roomTypes[Math.floor(Math.random() * roomTypes.length)];

  const amenities = amenitiesCombinations[Math.floor(Math.random() * amenitiesCombinations.length)];
  const rules = rulesOptions[Math.floor(Math.random() * rulesOptions.length)];

  const streetNames = ['MG Road', 'Station Road', 'Gandhi Nagar', 'Market Road', 'College Road', 'NH Road'];
  const areaNames = ['Sector 12', 'Civil Lines', 'Sadar Bazaar', 'Railway Colony', 'University Area', 'Downtown'];

  return {
    owner: ownerId,
    title: `${roomType.charAt(0).toUpperCase() + roomType.slice(1)} Room in ${district}`,
    description: `Comfortable ${roomType} room available in ${district}, ${state}. ${isBooked ? 'Currently occupied.' : 'Available for immediate move-in.'}`,
    roomType,
    rentPerMonth,
    securityDeposit,
    address: {
      street: `${index + 1}/123, ${streetNames[Math.floor(Math.random() * streetNames.length)]}`,
      area: areaNames[Math.floor(Math.random() * areaNames.length)],
      city: district,
      state,
      pincode: generatePincode(),
    },
    amenities,
    photos: [{
      url: `https://res.cloudinary.com/demo/image/upload/sample_${index % 5 + 1}.jpg`,
      publicId: `room_${state}_${district}_${index}`,
      isPrimary: true,
      uploadType: 'uploaded',
      verified: true
    }],
    rules,
    preferences: ['Students preferred', 'Working professionals welcome'],
    maxOccupancy: roomType === 'shared' ? Math.floor(Math.random() * 3) + 2 : 1,
    isAvailable: !isBooked,
    isOccupied: isBooked,
    featured: Math.random() > 0.8, // 20% chance of being featured
    rating: Math.floor(Math.random() * 3) + 3, // 3-5 stars
    views: Math.floor(Math.random() * 100),
    verified: Math.random() > 0.3, // 70% verified
  };
};

// Main seeding function
const seedDatabase = async () => {
  try {
    console.log('[SEED] Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mess-wallah', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('[SEED] ✅ Connected to MongoDB');

    // Get or create a default owner
    let owner = await User.findOne({ role: 'owner' });
    if (!owner) {
      console.log('[SEED] Creating default owner...');
      owner = await User.create({
        name: 'System Owner',
        email: 'owner@messwallah.com',
        phone: '9999999999',
        password: 'password123',
        role: 'owner',
        isPhoneVerified: true,
        isEmailVerified: true
      });
    }

    console.log('[SEED] Starting database seeding...');
    console.log(`[SEED] Owner ID: ${owner._id}`);

    let totalRooms = 0;
    let totalBooked = 0;

    for (const [state, districts] of Object.entries(indiaData)) {
      console.log(`\n[SEED] Processing ${state} (${districts.length} districts)...`);

      for (const district of districts) {
        const roomsInDistrict = [];
        const numRooms = 5 + Math.floor(Math.random() * 3); // 5-7 rooms per district

        for (let i = 0; i < numRooms; i++) {
          const isBooked = i === 0; // First room is booked
          const room = generateRoom(state, district, i, isBooked, owner._id);
          roomsInDistrict.push(room);

          if (isBooked) totalBooked++;
        }

        await Room.insertMany(roomsInDistrict);
        totalRooms += roomsInDistrict.length;

        process.stdout.write(`\r[SEED] ${state}: ${districts.indexOf(district) + 1}/${districts.length} districts`);
      }
    }

    console.log(`\n\n[SEED] ✅ Seeding Complete!`);
    console.log(`[SEED]recap:`);
    console.log(`   - Total States: ${Object.keys(indiaData).length}`);
    console.log(`   - Total Districts: ${Object.values(indiaData).flat().length}`);
    console.log(`   - Total Rooms Created: ${totalRooms}`);
    console.log(`   - Booked Rooms: ${totalBooked}`);
    console.log(`   - Available Rooms: ${totalRooms - totalBooked}`);

    await mongoose.connection.close();
    console.log('[SEED] Database connection closed');
    process.exit(0);

  } catch (error) {
    console.error('[SEED] ❌ Error:', error.message);
    console.error(error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run seeder
seedDatabase();
