const mongoose = require('mongoose');
const Room = require('./models/Room');
const User = require('./models/User');
const Booking = require('./models/Booking');
require('dotenv').config();

// COMPLETE India District Mapping - ALL 700+ Districts
const INDIA_DISTRICTS = {
  // States (28)
  "Andhra Pradesh": ["Alluri Sitharama Raju", "Anakapalli", "Anantapur", "Annamayya", "Bapatla", "Chittoor", "Dr. B.R. Ambedkar Konaseema", "Eluru", "Guntur", "Kakinada", "Krishna", "Kurnool", "Nandyal", "NTR", "Palnadu", "Parvathipuram Manyam", "Prakasam", "Srikakulam", "Sri Potti Sriramulu Nellore", "Sri Sathya Sai", "Tirupati", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"],
  
  "Arunachal Pradesh": ["Anjaw", "Changlang", "Dibang Valley", "East Kameng", "East Siang", "Kamle", "Kra Daadi", "Kurung Kumey", "Lepa Rada", "Lohit", "Longding", "Lower Dibang Valley", "Lower Siang", "Lower Subansiri", "Namsai", "Pakke Kessang", "Papum Pare", "Shi Yomi", "Siang", "Tawang", "Tirap", "Upper Siang", "Upper Subansiri", "West Kameng", "West Siang", "Itanagar Capital Complex"],
  
  "Assam": ["Bajali", "Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Dima Hasao", "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup", "Kamrup Metropolitan", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Sivasagar", "Sonitpur", "South Salmara-Mankachar", "Tinsukia", "Udalguri", "West Karbi Anglong"],
  
  "Bihar": ["Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran"],
  
  "Chhattisgarh": ["Balod", "Baloda Bazar-Bhatapara", "Balrampur", "Bastar", "Bemetara", "Bijapur", "Bilaspur", "Dantewada", "Dhamtari", "Durg", "Gariaband", "Gaurela-Pendra-Marwahi", "Janjgir-Champa", "Jashpur", "Kabirdham", "Kanker", "Kondagaon", "Korba", "Koriya", "Mahasamund", "Manendragarh-Chirmiri-Bharatpur", "Mohla-Manpur-Ambagarh Chowki", "Mungeli", "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sakti", "Sarangarh-Bilaigarh", "Sukma", "Surajpur", "Surguja", "Khairagarh-Chhuikhadan-Gandai"],
  
  "Goa": ["North Goa", "South Goa"],
  
  "Gujarat": ["Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", "Botad", "Chhota Udepur", "Dahod", "Dang", "Devbhumi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"],
  
  "Haryana": ["Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram", "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh", "Mewat", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"],
  
  "Himachal Pradesh": ["Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul and Spiti", "Mandi", "Shimla", "Sirmaur", "Solan", "Una"],
  
  "Jharkhand": ["Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahibganj", "Seraikela Kharsawan", "Simdega", "West Singhbhum"],
  
  "Karnataka": ["Bagalkot", "Bangalore Rural", "Bangalore Urban", "Belgaum", "Bellary", "Bidar", "Chamarajanagar", "Chikkaballapur", "Chikmagalur", "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Gulbarga", "Hassan", "Haveri", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysore", "Raichur", "Ramanagara", "Shimoga", "Tumkur", "Udupi", "Uttara Kannada", "Vijayapura", "Yadgir", "Vijayanagara"],
  
  "Kerala": ["Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"],
  
  "Madhya Pradesh": ["Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Hoshangabad", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla", "Mandsaur", "Morena", "Narsinghpur", "Neemuch", "Niwari", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha", "Mauganj", "Maihar", "Pandhurna"],
  
  "Maharashtra": ["Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"],
  
  "Manipur": ["Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West", "Jiribam", "Kakching", "Kamjong", "Kangpokpi", "Noney", "Pherzawl", "Senapati", "Tamenglong", "Tengnoupal", "Thoubal", "Ukhrul"],
  
  "Meghalaya": ["East Garo Hills", "East Jaintia Hills", "East Khasi Hills", "Eastern West Khasi Hills", "North Garo Hills", "Ri Bhoi", "South Garo Hills", "South West Garo Hills", "South West Khasi Hills", "West Garo Hills", "West Jaintia Hills", "West Khasi Hills"],
  
  "Mizoram": ["Aizawl", "Champhai", "Hnahthial", "Khawzawl", "Kolasib", "Lawngtlai", "Lunglei", "Mamit", "Saiha", "Saitual", "Serchhip"],
  
  "Nagaland": ["Chumoukedima", "Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon", "Niuland", "Noklak", "Peren", "Phek", "Shamator", "Tseminyu", "Tuensang", "Wokha", "Zunheboto"],
  
  "Odisha": ["Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Deogarh", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur", "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Keonjhar", "Khordha", "Koraput", "Malkangiri", "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Subarnapur", "Sundargarh"],
  
  "Punjab": ["Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Malerkotla", "Mansa", "Moga", "Muktsar", "Pathankot", "Patiala", "Rupnagar", "Sahibzada Ajit Singh Nagar", "Sangrur", "Shahid Bhagat Singh Nagar", "Tarn Taran"],
  
  "Rajasthan": ["Ajmer", "Alwar", "Anupgarh", "Balotra", "Banswara", "Baran", "Barmer", "Beawar", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Deeg", "Dholpur", "Didwana-Kuchaman", "Dudha", "Dungarpur", "Ganganagar", "Gangapur City", "Hanumangarh", "Jaipur City", "Jaipur Rural", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur City", "Jodhpur Rural", "Kekri", "Karauli", "Khairthal-Tijara", "Kota", "Kotputli-Behror", "Nagaur", "Neem Ka Thana", "Pali", "Phalodi", "Pratapgarh", "Rajsamand", "Salumbar", "Sanchore", "Sawai Madhopur", "Shahpura", "Sikar", "Sirohi", "Tonk", "Udaipur"],
  
  "Sikkim": ["Gangtok", "Gyalshing", "Pakyong", "Namchi", "Soreng", "Mangan"],
  
  "Tamil Nadu": ["Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"],
  
  "Telangana": ["Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam", "Kumuram Bheem", "Mahabubabad", "Mahbubnagar", "Mancherial", "Medak", "Medchal-Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Rangareddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal", "Hanamkonda", "Yadadri Bhuvanagiri"],
  
  "Tripura": ["Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala", "South Tripura", "Unakoti", "West Tripura"],
  
  "Uttar Pradesh": ["Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Ayodhya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kheri", "Kushinagar", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Prayagraj", "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"],
  
  "Uttarakhand": ["Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar", "Uttarkashi"],
  
  "West Bengal": ["Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Bardhaman", "Paschim Medinipur", "Purba Bardhaman", "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"],
  
  // Union Territories (8)
  "Andaman and Nicobar": ["Nicobar", "North and Middle Andaman", "South Andaman"],
  
  "Chandigarh": ["Chandigarh"],
  
  "Dadra and Nagar Haveli and Daman and Diu": ["Dadra and Nagar Haveli", "Daman", "Diu"],
  
  "Delhi": ["Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi", "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi"],
  
  "Jammu and Kashmir": ["Anantnag", "Bandipora", "Baramulla", "Budgam", "Doda", "Ganderbal", "Jammu", "Kathua", "Kishtwar", "Kulgam", "Kupwara", "Poonch", "Pulwama", "Rajouri", "Ramban", "Reasi", "Samba", "Shopian", "Srinagar", "Udhampur"],
  
  "Ladakh": ["Kargil", "Leh"],
  
  "Lakshadweep": ["Kavaratti"],
  
  "Puducherry": ["Karaikal", "Mahe", "Puducherry", "Yanam"]
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

async function createOwner(district, state) {
  const ownerNames = ['Rajesh Kumar', 'Sunita Patel', 'Amit Sharma', 'Priya Singh', 'Vikram Reddy'];
  const email = `owner.${district.toLowerCase().replace(/\s+/g, '')}@messwallah.com`;
  
  let owner = await User.findOne({ email });
  if (!owner) {
    owner = await User.create({
      name: getRandomElement(ownerNames),
      email,
      password: '$2a$10$abcdefghijklmnopqrstuv',
      phone: `+91${getRandomInt(7000000000, 9999999999)}`,
      role: 'owner',
      isVerified: true
    });
  }
  return owner;
}

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
    `Modern ${roomType.charAt(0).toUpperCase() + roomType.slice(1)} Room near ${district}`,
    `Affordable ${roomType.charAt(0).toUpperCase() + roomType.slice(1)} Stay in ${district}`,
    `Premium ${roomType.charAt(0).toUpperCase() + roomType.slice(1)} Room in ${district}`
  ];

  return {
    owner: owner._id,
    title: roomTitles[index % roomTitles.length],
    description: `${roomType.charAt(0).toUpperCase() + roomType.slice(1)} room in ${district}, ${state}. Perfect for students and working professionals.`,
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
    maxOccupancy: roomType === 'apartment' ? 4 : roomType === 'shared' ? 3 : 1,
    isActive: true,
    isAvailable: true,
    featured: Math.random() > 0.8,
    verified: Math.random() > 0.5,
    rating: parseFloat((4 + Math.random()).toFixed(1)),
    totalReviews: getRandomInt(0, 50)
  };
}

async function seedDatabase() {
  try {
    console.log('🚀 Starting COMPLETE India-Wide Database Seeding...\n');
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mess-wallah');
    console.log('✅ Connected to MongoDB\n');

    console.log('🗑️  Clearing existing rooms and bookings...');
    await Room.deleteMany({});
    await Booking.deleteMany({});
    console.log('✅ Existing data cleared\n');

    let totalRooms = 0;
    let totalBookings = 0;
    let totalDistricts = 0;

    for (const [state, districts] of Object.entries(INDIA_DISTRICTS)) {
      console.log(`\n📍 Processing ${state}...`);
      
      for (const district of districts) {
        totalDistricts++;
        const owner = await createOwner(district, state);
        
        const districtRooms = [];
        for (let i = 0; i < 5; i++) {
          const roomData = generateRoom(owner, district, state, i);
          const room = await Room.create(roomData);
          districtRooms.push(room);
          totalRooms++;
        }
        
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
        
        process.stdout.write(`   ${district}: ✅ 5 rooms + 1 booking\r`);
      }
      console.log(`\n✅ ${state}: ${districts.length} districts completed`);
    }

    console.log('\n\n' + '='.repeat(80));
    console.log('🎉 COMPLETE INDIA SEEDING SUCCESSFUL!');
    console.log('='.repeat(80));
    console.log(`📊 Total States/UTs: ${Object.keys(INDIA_DISTRICTS).length}`);
    console.log(`📊 Total Districts: ${totalDistricts}`);
    console.log(`🏠 Total Rooms Created: ${totalRooms}`);
    console.log(`📅 Total Bookings Created: ${totalBookings}`);
    console.log('='.repeat(80));
    console.log('\n✅ Complete India Database Ready!\n');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

seedDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
