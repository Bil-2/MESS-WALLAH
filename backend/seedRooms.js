const mongoose = require('mongoose');
const User = require('./models/User');
const Room = require('./models/Room');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mess-wallah');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Indian cities data with realistic pricing tiers
const indianCities = [
  // Tier 1 Cities (High rent)
  { name: 'Mumbai', state: 'Maharashtra', pincode: '400001', lat: 18.9220, lng: 72.8347, tier: 1 },
  { name: 'Delhi', state: 'Delhi', pincode: '110001', lat: 28.6139, lng: 77.2090, tier: 1 },
  { name: 'Bangalore', state: 'Karnataka', pincode: '560001', lat: 12.9716, lng: 77.5946, tier: 1 },
  { name: 'Hyderabad', state: 'Telangana', pincode: '500001', lat: 17.3850, lng: 78.4867, tier: 1 },
  { name: 'Chennai', state: 'Tamil Nadu', pincode: '600001', lat: 13.0827, lng: 80.2707, tier: 1 },
  { name: 'Kolkata', state: 'West Bengal', pincode: '700001', lat: 22.5726, lng: 88.3639, tier: 1 },
  { name: 'Pune', state: 'Maharashtra', pincode: '411001', lat: 18.5204, lng: 73.8567, tier: 1 },
  { name: 'Ahmedabad', state: 'Gujarat', pincode: '380001', lat: 23.0225, lng: 72.5714, tier: 1 },

  // Tier 2 Cities (Medium rent)
  { name: 'Jaipur', state: 'Rajasthan', pincode: '302001', lat: 26.9124, lng: 75.7873, tier: 2 },
  { name: 'Lucknow', state: 'Uttar Pradesh', pincode: '226001', lat: 26.8467, lng: 80.9462, tier: 2 },
  { name: 'Kanpur', state: 'Uttar Pradesh', pincode: '208001', lat: 26.4499, lng: 80.3319, tier: 2 },
  { name: 'Nagpur', state: 'Maharashtra', pincode: '440001', lat: 21.1458, lng: 79.0882, tier: 2 },
  { name: 'Indore', state: 'Madhya Pradesh', pincode: '452001', lat: 22.7196, lng: 75.8577, tier: 2 },
  { name: 'Thane', state: 'Maharashtra', pincode: '400601', lat: 19.2183, lng: 72.9781, tier: 2 },
  { name: 'Bhopal', state: 'Madhya Pradesh', pincode: '462001', lat: 23.2599, lng: 77.4126, tier: 2 },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', pincode: '530001', lat: 17.6868, lng: 83.2185, tier: 2 },
  { name: 'Pimpri-Chinchwad', state: 'Maharashtra', pincode: '411017', lat: 18.6298, lng: 73.7997, tier: 2 },
  { name: 'Patna', state: 'Bihar', pincode: '800001', lat: 25.5941, lng: 85.1376, tier: 2 },
  { name: 'Vadodara', state: 'Gujarat', pincode: '390001', lat: 22.3072, lng: 73.1812, tier: 2 },
  { name: 'Ghaziabad', state: 'Uttar Pradesh', pincode: '201001', lat: 28.6692, lng: 77.4538, tier: 2 },
  { name: 'Ludhiana', state: 'Punjab', pincode: '141001', lat: 30.9010, lng: 75.8573, tier: 2 },
  { name: 'Agra', state: 'Uttar Pradesh', pincode: '282001', lat: 27.1767, lng: 78.0081, tier: 2 },
  { name: 'Nashik', state: 'Maharashtra', pincode: '422001', lat: 19.9975, lng: 73.7898, tier: 2 },
  { name: 'Faridabad', state: 'Haryana', pincode: '121001', lat: 28.4089, lng: 77.3178, tier: 2 },
  { name: 'Meerut', state: 'Uttar Pradesh', pincode: '250001', lat: 28.9845, lng: 77.7064, tier: 2 },
  { name: 'Rajkot', state: 'Gujarat', pincode: '360001', lat: 22.3039, lng: 70.8022, tier: 2 },
  { name: 'Kalyan-Dombivali', state: 'Maharashtra', pincode: '421201', lat: 19.2403, lng: 73.1305, tier: 2 },
  { name: 'Vasai-Virar', state: 'Maharashtra', pincode: '401201', lat: 19.4914, lng: 72.8054, tier: 2 },
  { name: 'Varanasi', state: 'Uttar Pradesh', pincode: '221001', lat: 25.3176, lng: 82.9739, tier: 2 },
  { name: 'Srinagar', state: 'Jammu and Kashmir', pincode: '190001', lat: 34.0837, lng: 74.7973, tier: 2 },
  { name: 'Aurangabad', state: 'Maharashtra', pincode: '431001', lat: 19.8762, lng: 75.3433, tier: 2 },
  { name: 'Dhanbad', state: 'Jharkhand', pincode: '826001', lat: 23.7957, lng: 86.4304, tier: 2 },
  { name: 'Amritsar', state: 'Punjab', pincode: '143001', lat: 31.6340, lng: 74.8723, tier: 2 },
  { name: 'Navi Mumbai', state: 'Maharashtra', pincode: '400614', lat: 19.0330, lng: 73.0297, tier: 2 },
  { name: 'Allahabad', state: 'Uttar Pradesh', pincode: '211001', lat: 25.4358, lng: 81.8463, tier: 2 },
  { name: 'Ranchi', state: 'Jharkhand', pincode: '834001', lat: 23.3441, lng: 85.3096, tier: 2 },
  { name: 'Howrah', state: 'West Bengal', pincode: '711101', lat: 22.5958, lng: 88.2636, tier: 2 },
  { name: 'Coimbatore', state: 'Tamil Nadu', pincode: '641001', lat: 11.0168, lng: 76.9558, tier: 2 },
  { name: 'Jabalpur', state: 'Madhya Pradesh', pincode: '482001', lat: 23.1815, lng: 79.9864, tier: 2 },
  { name: 'Gwalior', state: 'Madhya Pradesh', pincode: '474001', lat: 26.2183, lng: 78.1828, tier: 2 },

  // Tier 3 Cities (Lower rent)
  { name: 'Vijayawada', state: 'Andhra Pradesh', pincode: '520001', lat: 16.5062, lng: 80.6480, tier: 3 },
  { name: 'Jodhpur', state: 'Rajasthan', pincode: '342001', lat: 26.2389, lng: 73.0243, tier: 3 },
  { name: 'Madurai', state: 'Tamil Nadu', pincode: '625001', lat: 9.9252, lng: 78.1198, tier: 3 },
  { name: 'Raipur', state: 'Chhattisgarh', pincode: '492001', lat: 21.2514, lng: 81.6296, tier: 3 },
  { name: 'Kota', state: 'Rajasthan', pincode: '324001', lat: 25.2138, lng: 75.8648, tier: 3 },
  { name: 'Chandigarh', state: 'Chandigarh', pincode: '160001', lat: 30.7333, lng: 76.7794, tier: 3 },
  { name: 'Guwahati', state: 'Assam', pincode: '781001', lat: 26.1445, lng: 91.7362, tier: 3 },
  { name: 'Solapur', state: 'Maharashtra', pincode: '413001', lat: 17.6599, lng: 75.9064, tier: 3 },
  { name: 'Hubli-Dharwad', state: 'Karnataka', pincode: '580001', lat: 15.3647, lng: 75.1240, tier: 3 },
  { name: 'Bareilly', state: 'Uttar Pradesh', pincode: '243001', lat: 28.3670, lng: 79.4304, tier: 3 },
  { name: 'Moradabad', state: 'Uttar Pradesh', pincode: '244001', lat: 28.8386, lng: 78.7733, tier: 3 },
  { name: 'Mysore', state: 'Karnataka', pincode: '570001', lat: 12.2958, lng: 76.6394, tier: 3 },
  { name: 'Gurgaon', state: 'Haryana', pincode: '122001', lat: 28.4595, lng: 77.0266, tier: 3 },
  { name: 'Aligarh', state: 'Uttar Pradesh', pincode: '202001', lat: 27.8974, lng: 78.0880, tier: 3 },
  { name: 'Jalandhar', state: 'Punjab', pincode: '144001', lat: 31.3260, lng: 75.5762, tier: 3 },
  { name: 'Tiruchirappalli', state: 'Tamil Nadu', pincode: '620001', lat: 10.7905, lng: 78.7047, tier: 3 },
  { name: 'Bhubaneswar', state: 'Odisha', pincode: '751001', lat: 20.2961, lng: 85.8245, tier: 3 },
  { name: 'Salem', state: 'Tamil Nadu', pincode: '636001', lat: 11.6643, lng: 78.1460, tier: 3 },
  { name: 'Warangal', state: 'Telangana', pincode: '506001', lat: 17.9689, lng: 79.5941, tier: 3 },
  { name: 'Guntur', state: 'Andhra Pradesh', pincode: '522001', lat: 16.3067, lng: 80.4365, tier: 3 },
  { name: 'Bhiwandi', state: 'Maharashtra', pincode: '421302', lat: 19.3002, lng: 73.0630, tier: 3 },
  { name: 'Saharanpur', state: 'Uttar Pradesh', pincode: '247001', lat: 29.9680, lng: 77.5552, tier: 3 },
  { name: 'Gorakhpur', state: 'Uttar Pradesh', pincode: '273001', lat: 26.7606, lng: 83.3732, tier: 3 },
  { name: 'Bikaner', state: 'Rajasthan', pincode: '334001', lat: 28.0229, lng: 73.3119, tier: 3 },
  { name: 'Amravati', state: 'Maharashtra', pincode: '444601', lat: 20.9374, lng: 77.7796, tier: 3 },
  { name: 'Noida', state: 'Uttar Pradesh', pincode: '201301', lat: 28.5355, lng: 77.3910, tier: 3 },
  { name: 'Jamshedpur', state: 'Jharkhand', pincode: '831001', lat: 22.8046, lng: 86.2029, tier: 3 },
  { name: 'Bhilai', state: 'Chhattisgarh', pincode: '490001', lat: 21.1938, lng: 81.3509, tier: 3 },
  { name: 'Cuttack', state: 'Odisha', pincode: '753001', lat: 20.4625, lng: 85.8828, tier: 3 },
  { name: 'Firozabad', state: 'Uttar Pradesh', pincode: '283203', lat: 27.1592, lng: 78.3957, tier: 3 },
  { name: 'Kochi', state: 'Kerala', pincode: '682001', lat: 9.9312, lng: 76.2673, tier: 3 },
  { name: 'Nellore', state: 'Andhra Pradesh', pincode: '524001', lat: 14.4426, lng: 79.9865, tier: 3 },
  { name: 'Bhavnagar', state: 'Gujarat', pincode: '364001', lat: 21.7645, lng: 72.1519, tier: 3 },
  { name: 'Dehradun', state: 'Uttarakhand', pincode: '248001', lat: 30.3165, lng: 78.0322, tier: 3 },
  { name: 'Durgapur', state: 'West Bengal', pincode: '713201', lat: 23.5204, lng: 87.3119, tier: 3 },
  { name: 'Asansol', state: 'West Bengal', pincode: '713301', lat: 23.6739, lng: 86.9524, tier: 3 },
  { name: 'Rourkela', state: 'Odisha', pincode: '769001', lat: 22.2604, lng: 84.8536, tier: 3 },
  { name: 'Nanded', state: 'Maharashtra', pincode: '431601', lat: 19.1383, lng: 77.3210, tier: 3 },
  { name: 'Kolhapur', state: 'Maharashtra', pincode: '416001', lat: 16.7050, lng: 74.2433, tier: 3 },
  { name: 'Ajmer', state: 'Rajasthan', pincode: '305001', lat: 26.4499, lng: 74.6399, tier: 3 },
  { name: 'Akola', state: 'Maharashtra', pincode: '444001', lat: 20.7002, lng: 77.0082, tier: 3 },
  { name: 'Gulbarga', state: 'Karnataka', pincode: '585101', lat: 17.3297, lng: 76.8343, tier: 3 },
  { name: 'Jamnagar', state: 'Gujarat', pincode: '361001', lat: 22.4707, lng: 70.0577, tier: 3 },
  { name: 'Ujjain', state: 'Madhya Pradesh', pincode: '456001', lat: 23.1765, lng: 75.7885, tier: 3 },
  { name: 'Loni', state: 'Uttar Pradesh', pincode: '201102', lat: 28.7333, lng: 77.2833, tier: 3 },
  { name: 'Siliguri', state: 'West Bengal', pincode: '734001', lat: 26.7271, lng: 88.3953, tier: 3 },
  { name: 'Jhansi', state: 'Uttar Pradesh', pincode: '284001', lat: 25.4484, lng: 78.5685, tier: 3 },
  { name: 'Ulhasnagar', state: 'Maharashtra', pincode: '421001', lat: 19.2215, lng: 73.1645, tier: 3 },
  { name: 'Jammu', state: 'Jammu and Kashmir', pincode: '180001', lat: 32.7266, lng: 74.8570, tier: 3 },
  { name: 'Sangli-Miraj & Kupwad', state: 'Maharashtra', pincode: '416416', lat: 16.8524, lng: 74.5815, tier: 3 },
  { name: 'Mangalore', state: 'Karnataka', pincode: '575001', lat: 12.9141, lng: 74.8560, tier: 3 },
  { name: 'Erode', state: 'Tamil Nadu', pincode: '638001', lat: 11.3410, lng: 77.7172, tier: 3 },
  { name: 'Belgaum', state: 'Karnataka', pincode: '590001', lat: 15.8497, lng: 74.4977, tier: 3 },
  { name: 'Ambattur', state: 'Tamil Nadu', pincode: '600053', lat: 13.1143, lng: 80.1548, tier: 3 },
  { name: 'Tirunelveli', state: 'Tamil Nadu', pincode: '627001', lat: 8.7139, lng: 77.7567, tier: 3 },
  { name: 'Malegaon', state: 'Maharashtra', pincode: '423203', lat: 20.5579, lng: 74.5287, tier: 3 },
  { name: 'Gaya', state: 'Bihar', pincode: '823001', lat: 24.7914, lng: 85.0002, tier: 3 }
];

// Room types with descriptions
const roomTypes = ['single', 'shared', 'studio', 'apartment'];

// Amenities pool
const amenitiesPool = [
  'wifi', 'ac', 'parking', 'laundry', 'kitchen', 'balcony',
  'furnished', 'gym', 'security', 'elevator', 'water_supply',
  'power_backup', 'tv', 'fridge', 'washing_machine'
];

// Indian owner names pool
const indianOwnerNames = [
  'Rajesh Kumar', 'Priya Sharma', 'Amit Singh', 'Sunita Patel', 'Vikash Gupta',
  'Meera Joshi', 'Ravi Agarwal', 'Kavita Reddy', 'Suresh Yadav', 'Anita Verma',
  'Manoj Tiwari', 'Deepika Nair', 'Ashok Mishra', 'Pooja Bansal', 'Sanjay Jain',
  'Rekha Chopra', 'Vinod Kumar', 'Shweta Saxena', 'Ramesh Pandey', 'Neha Kapoor',
  'Ajay Sinha', 'Ritu Malhotra', 'Sunil Bhardwaj', 'Anjali Goyal', 'Prakash Dubey',
  'Seema Aggarwal', 'Rohit Mehta', 'Nisha Arora', 'Dinesh Chandra', 'Kiran Bhatia',
  'Mukesh Gupta', 'Sushma Rao', 'Anil Shukla', 'Preeti Srivastava', 'Girish Jha',
  'Mamta Dixit', 'Santosh Kumar', 'Vandana Singh', 'Harish Agrawal', 'Renu Mittal',
  'Yogesh Sharma', 'Sarita Jain', 'Naresh Gupta', 'Usha Tiwari', 'Brijesh Pal',
  'Sudha Mishra', 'Rakesh Pandey', 'Geeta Sahu', 'Mahesh Yadav', 'Lata Verma'
];

// Indian mobile number generator
const generateIndianMobile = () => {
  const prefixes = ['98', '97', '96', '95', '94', '93', '92', '91', '90', '89', '88', '87', '86', '85', '84', '83', '82', '81', '80', '79', '78', '77', '76', '75', '74', '73', '72', '70'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const remaining = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
  return `${prefix}${remaining}`;
};

// Indian reviewer names by category
const indianReviewerNames = {
  student: [
    'Arjun Patel', 'Priyanka Sharma', 'Rohit Kumar', 'Sneha Gupta', 'Varun Singh',
    'Ananya Reddy', 'Karan Joshi', 'Ishita Agarwal', 'Nikhil Yadav', 'Riya Verma',
    'Aarav Tiwari', 'Diya Nair', 'Shubham Mishra', 'Tanvi Bansal', 'Harsh Jain',
    'Kavya Chopra', 'Aditya Kumar', 'Shreya Saxena', 'Yash Pandey', 'Nidhi Kapoor'
  ],
  family: [
    'Rajesh & Sunita Sharma', 'Amit & Priya Gupta', 'Suresh & Meera Patel', 'Vinod & Kavita Singh',
    'Manoj & Deepika Agarwal', 'Ashok & Pooja Reddy', 'Sanjay & Rekha Yadav', 'Ramesh & Neha Verma',
    'Ajay & Ritu Tiwari', 'Prakash & Anjali Nair', 'Rohit & Seema Mishra', 'Dinesh & Nisha Bansal',
    'Mukesh & Sushma Jain', 'Anil & Preeti Chopra', 'Girish & Mamta Kumar', 'Santosh & Vandana Saxena'
  ],
  bachelor: [
    'Vikash Gupta', 'Ravi Agarwal', 'Sunil Bhardwaj', 'Harish Agrawal', 'Yogesh Sharma',
    'Naresh Gupta', 'Brijesh Pal', 'Rakesh Pandey', 'Mahesh Yadav', 'Deepak Singh',
    'Ankit Verma', 'Sachin Joshi', 'Manish Reddy', 'Gaurav Mishra', 'Naveen Bansal',
    'Tarun Jain', 'Vishal Chopra', 'Abhishek Kumar', 'Nitin Saxena', 'Sumit Pandey'
  ]
};

// Review templates by room type
const reviewTemplates = {
  student: [
    "Great place for students! Very affordable and close to college. Owner is very understanding.",
    "Perfect for my studies. Quiet environment and good Wi-Fi. Highly recommend for students.",
    "Budget-friendly accommodation with all basic amenities. Great for college students like me.",
    "Nice place to stay during college years. Safe area and friendly owner.",
    "Good value for money. Clean rooms and study-friendly environment.",
    "Excellent for students! Near to university and has all necessary facilities.",
    "Stayed here during my engineering course. Very supportive owner and good facilities."
  ],
  family: [
    "Wonderful place for our family! Kids love it here and it's very safe.",
    "Perfect family accommodation. Spacious rooms and great neighborhood for children.",
    "We've been staying here for 2 years. Excellent for families with kids.",
    "Great place to raise a family. Good schools nearby and very peaceful area.",
    "Family-friendly environment with all necessary amenities. Highly recommended.",
    "Safe and secure place for families. Owner is very cooperative and understanding.",
    "Perfect for our family of 4. Clean, spacious and in a great location."
  ],
  bachelor: [
    "Great place for working professionals! Close to office and well-maintained.",
    "Perfect bachelor pad! Good amenities and reasonable rent.",
    "Excellent for single professionals. Safe area and good connectivity.",
    "Been staying here for 6 months. Great place for bachelors working in the city.",
    "Good accommodation for working professionals. Clean and well-furnished.",
    "Perfect for young professionals. Modern amenities and great location.",
    "Highly recommend for bachelors! Good value for money and nice facilities."
  ],
  apartment: [
    "Best apartment in the area! Great amenities and friendly atmosphere.",
    "Excellent apartment accommodation. Feels like home away from home.",
    "Great place for working professionals. Good amenities and clean rooms.",
    "Perfect apartment for students and professionals. Very well-managed.",
    "Homely environment with good amenities. Owner treats everyone like family.",
    "Best apartment experience! Clean rooms, good amenities, and friendly staff.",
    "Highly recommend this apartment. Great facilities and reasonable charges."
  ]
};

// Generate pricing based on city tier and room type
const generatePricing = (tier, roomType) => {
  let baseRent;

  switch (tier) {
    case 1: // Tier 1 cities
      baseRent = roomType === 'apartment' ? 25000 : roomType === 'studio' ? 18000 : roomType === 'shared' ? 12000 : 8000;
      break;
    case 2: // Tier 2 cities
      baseRent = roomType === 'apartment' ? 18000 : roomType === 'studio' ? 12000 : roomType === 'shared' ? 8000 : 6000;
      break;
    case 3: // Tier 3 cities
      baseRent = roomType === 'apartment' ? 12000 : roomType === 'studio' ? 8000 : roomType === 'shared' ? 5000 : 4000;
      break;
  }

  // Add some variation (±30%)
  const variation = (Math.random() - 0.5) * 0.6;
  const rent = Math.round(baseRent * (1 + variation));
  const deposit = rent * 2; // 2 months deposit

  return { rent, deposit };
};

// Generate random amenities
const generateAmenities = () => {
  const count = Math.floor(Math.random() * 6) + 3; // 3-8 amenities
  const shuffled = amenitiesPool.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Generate room title and description
const generateRoomDetails = (city, roomType) => {
  const titles = {
    single: [`Modern Single Room in ${city.name}`, `Cozy Single Room in ${city.name}`, `Premium Single Room in ${city.name}`],
    shared: [`Shared Room in ${city.name}`, `Shared Accommodation in ${city.name}`, `Shared Room in ${city.name}`],
    studio: [`Studio Apartment in ${city.name}`, `Studio Room in ${city.name}`, `Studio Accommodation in ${city.name}`],
    apartment: [`Apartment in ${city.name}`, `Apartment Accommodation in ${city.name}`, `Apartment Room in ${city.name}`]
  };

  const descriptions = {
    single: `Comfortable single accommodation in ${city.name} with modern amenities. Perfect for working professionals.`,
    shared: `Shared accommodation in ${city.name} with all necessary facilities. Ideal for students and professionals.`,
    studio: `Studio apartment in ${city.name} with modern amenities. Great for singles and couples.`,
    apartment: `Apartment accommodation in ${city.name} with all necessary facilities. Perfect for families and groups.`
  };

  return {
    title: titles[roomType][Math.floor(Math.random() * titles[roomType].length)],
    description: descriptions[roomType]
  };
};

// Generate random reviews for a room
const generateReviews = (roomType) => {
  const reviews = [];
  const reviewCount = Math.floor(Math.random() * 8) + 3; // 3-10 reviews
  const templates = reviewTemplates[roomType] || reviewTemplates.bachelor;

  for (let i = 0; i < reviewCount; i++) {
    const reviewerCategory = roomType === 'apartment' ? 'family' :
      roomType === 'single' ? 'bachelor' :
        roomType === 'shared' ? 'bachelor' : 'student';
    const reviewers = indianReviewerNames[reviewerCategory];
    const reviewer = reviewers[Math.floor(Math.random() * reviewers.length)];
    const template = templates[Math.floor(Math.random() * templates.length)];
    const rating = Math.floor(Math.random() * 2) + 4; // 4-5 stars mostly

    reviews.push({
      reviewerName: reviewer,
      rating: rating,
      comment: template,
      reviewDate: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)) // Random date within last year
    });
  }

  return reviews;
};

// Create default owner user
const createDefaultOwner = async () => {
  try {
    const existingOwner = await User.findOne({ email: 'owner@messwallah.com' });
    if (existingOwner) {
      console.log('✅ Default owner already exists');
      return existingOwner._id;
    }

    const defaultOwner = new User({
      name: indianOwnerNames[Math.floor(Math.random() * indianOwnerNames.length)],
      email: 'owner@messwallah.com',
      password: 'password123', // This will be hashed by the User model
      phone: generateIndianMobile(),
      role: 'owner',
      isVerified: true
    });

    const savedOwner = await defaultOwner.save();
    console.log('✅ Created default owner user');
    return savedOwner._id;
  } catch (error) {
    console.error('❌ Error creating default owner:', error);
    throw error;
  }
};

// Generate rooms for a city
const generateRoomsForCity = (city, ownerId) => {
  const rooms = [];

  for (let i = 0; i < 10; i++) {
    const roomType = roomTypes[Math.floor(Math.random() * roomTypes.length)];
    const pricing = generatePricing(city.tier, roomType);
    const amenities = generateAmenities();
    const roomDetails = generateRoomDetails(city, roomType);
    const reviews = generateReviews(roomType);
    const ownerName = indianOwnerNames[Math.floor(Math.random() * indianOwnerNames.length)];
    const ownerPhone = generateIndianMobile();

    rooms.push({
      ownerId: ownerId,
      title: roomDetails.title,
      description: roomDetails.description,
      address: {
        street: `${Math.floor(Math.random() * 999) + 1}, ${roomDetails.title.split(' ')[0]} Street`,
        area: `${city.name} Central`,
        city: city.name,
        state: city.state,
        pincode: city.pincode,
        lat: city.lat,
        lng: city.lng
      },
      rentPerMonth: pricing.rent,
      securityDeposit: pricing.deposit,
      maxOccupancy: roomType === 'apartment' ? 4 : roomType === 'studio' ? 2 : roomType === 'shared' ? 3 : 1,
      roomType: roomType,
      amenities: amenities,
      photos: [
        {
          url: `https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500`,
          publicId: `room_${Date.now()}_1`,
          caption: 'Room View',
          isPrimary: true
        },
        {
          url: `https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500`,
          publicId: `room_${Date.now()}_2`,
          caption: 'Interior View',
          isPrimary: false
        }
      ],
      owner: ownerId, // Use the ownerId parameter
      reviews: [], // Will be populated after creating users
      ownerName: ownerName,
      ownerPhone: ownerPhone,
      availableFrom: new Date('2024-01-01'),
      isActive: true,
      isAvailable: true,
      featured: Math.random() < 0.3 // 30% chance of being featured
    });
  }

  return rooms;
};

// Main seeding function
const seedDatabase = async () => {
  try {
    // Create default owner
    const ownerId = await createDefaultOwner();

    // Clear existing rooms
    await Room.deleteMany({});
    console.log('🗑️ Cleared existing rooms');

    // Generate rooms for each city
    const rooms = indianCities.reduce((acc, city) => acc.concat(generateRoomsForCity(city, ownerId)), []);

    // Create rooms
    const createdRooms = await Room.insertMany(rooms);

    console.log('\n🎉 Database seeded successfully!');
    console.log('Sample rooms created:');
    createdRooms.forEach((room, index) => {
      console.log(`${index + 1}. ${room.title} - ${room.address.city}`);
    });

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

// Run the seeding process
const runSeed = async () => {
  try {
    await connectDB();
    await seedDatabase();
    console.log('\n✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Execute if run directly
if (require.main === module) {
  runSeed();
}

module.exports = { seedDatabase };
