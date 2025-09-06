// Additional Demo Properties - Extended India Coverage
// Part 2: More states and districts across India

export const additionalProperties = [
  // UTTAR PRADESH
  {
    id: 'UP001',
    title: 'Lucknow Heritage Mess',
    type: 'mess',
    price: 6000,
    location: {
      state: 'Uttar Pradesh',
      district: 'Lucknow',
      city: 'Lucknow',
      area: 'Hazratganj',
      pincode: '226001'
    },
    owner: {
      name: 'Nawab Ahmed Khan',
      phone: '+91 9415123456',
      email: 'nawab.khan@gmail.com',
      experience: '20 years',
      rating: 4.9
    },
    property: {
      capacity: 70,
      rooms: 35,
      bathrooms: 12,
      amenities: ['WiFi', 'AC', 'Traditional Architecture', 'Security', 'Parking'],
      meals: ['Breakfast', 'Lunch', 'Dinner'],
      cuisine: ['Awadhi', 'Mughlai', 'North Indian']
    },
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    available: true
  },
  {
    id: 'UP002',
    title: 'Varanasi Ganga View PG',
    type: 'pg',
    price: 5500,
    location: {
      state: 'Uttar Pradesh',
      district: 'Varanasi',
      city: 'Varanasi',
      area: 'Assi Ghat',
      pincode: '221005'
    },
    owner: {
      name: 'Pandit Ramesh Tiwari',
      phone: '+91 9336789012',
      email: 'ramesh.tiwari@yahoo.com',
      experience: '18 years',
      rating: 4.6
    },
    property: {
      capacity: 20,
      rooms: 10,
      bathrooms: 4,
      amenities: ['WiFi', 'Fan', 'River View', 'Temple Nearby', 'Spiritual Environment'],
      meals: ['Breakfast', 'Lunch', 'Dinner'],
      cuisine: ['Pure Vegetarian', 'North Indian', 'Satvik Food']
    },
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    available: true
  },

  // PUNJAB
  {
    id: 'PB001',
    title: 'Amritsar Golden Temple Area Mess',
    type: 'mess',
    price: 7500,
    location: {
      state: 'Punjab',
      district: 'Amritsar',
      city: 'Amritsar',
      area: 'Hall Bazaar',
      pincode: '143001'
    },
    owner: {
      name: 'Sardar Jasbir Singh',
      phone: '+91 9872345678',
      email: 'jasbir.singh@gmail.com',
      experience: '14 years',
      rating: 4.8
    },
    property: {
      capacity: 50,
      rooms: 25,
      bathrooms: 8,
      amenities: ['WiFi', 'AC', 'Punjabi Culture', 'Security', 'Parking'],
      meals: ['Breakfast', 'Lunch', 'Dinner'],
      cuisine: ['Punjabi', 'North Indian', 'Langar Style']
    },
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    available: true
  },

  // HARYANA
  {
    id: 'HR001',
    title: 'Gurgaon Corporate Hub PG',
    type: 'pg',
    price: 18000,
    location: {
      state: 'Haryana',
      district: 'Gurgaon',
      city: 'Gurgaon',
      area: 'Cyber City',
      pincode: '122002'
    },
    owner: {
      name: 'Vikram Yadav',
      phone: '+91 9876543212',
      email: 'vikram.yadav@gmail.com',
      experience: '8 years',
      rating: 4.7
    },
    property: {
      capacity: 60,
      rooms: 30,
      bathrooms: 12,
      amenities: ['WiFi', 'AC', 'Gym', 'Swimming Pool', 'Security', 'Metro Connectivity'],
      meals: ['Breakfast', 'Dinner'],
      cuisine: ['Multi-Cuisine', 'Continental', 'Indian']
    },
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    available: true
  },

  // KERALA
  {
    id: 'KL001',
    title: 'Kochi Backwater Mess',
    type: 'mess',
    price: 8500,
    location: {
      state: 'Kerala',
      district: 'Ernakulam',
      city: 'Kochi',
      area: 'Marine Drive',
      pincode: '682031'
    },
    owner: {
      name: 'Ravi Menon',
      phone: '+91 9447123456',
      email: 'ravi.menon@gmail.com',
      experience: '12 years',
      rating: 4.9
    },
    property: {
      capacity: 40,
      rooms: 20,
      bathrooms: 8,
      amenities: ['WiFi', 'AC', 'Backwater View', 'Ayurvedic Spa', 'Security'],
      meals: ['Breakfast', 'Lunch', 'Dinner'],
      cuisine: ['Kerala Traditional', 'South Indian', 'Seafood']
    },
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    available: true
  },

  // ANDHRA PRADESH
  {
    id: 'AP001',
    title: 'Hyderabad IT Hub Mess',
    type: 'mess',
    price: 9500,
    location: {
      state: 'Andhra Pradesh',
      district: 'Hyderabad',
      city: 'Hyderabad',
      area: 'HITEC City',
      pincode: '500081'
    },
    owner: {
      name: 'Srinivas Reddy',
      phone: '+91 9849123456',
      email: 'srinivas.reddy@gmail.com',
      experience: '10 years',
      rating: 4.6
    },
    property: {
      capacity: 80,
      rooms: 40,
      bathrooms: 15,
      amenities: ['WiFi', 'AC', 'Tech-Friendly', 'Security', 'Parking', 'Cafeteria'],
      meals: ['Breakfast', 'Lunch', 'Dinner'],
      cuisine: ['Andhra', 'South Indian', 'Biryani Special']
    },
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    available: true
  },

  // TELANGANA
  {
    id: 'TS001',
    title: 'Warangal University Area PG',
    type: 'pg',
    price: 6500,
    location: {
      state: 'Telangana',
      district: 'Warangal',
      city: 'Warangal',
      area: 'NIT Campus Road',
      pincode: '506004'
    },
    owner: {
      name: 'Lakshmi Prasad',
      phone: '+91 9866789012',
      email: 'lakshmi.prasad@gmail.com',
      experience: '7 years',
      rating: 4.4
    },
    property: {
      capacity: 30,
      rooms: 15,
      bathrooms: 6,
      amenities: ['WiFi', 'AC', 'Study Room', 'Security', 'College Nearby'],
      meals: ['Breakfast', 'Lunch', 'Dinner'],
      cuisine: ['Telugu Traditional', 'South Indian']
    },
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    available: true
  },

  // ODISHA
  {
    id: 'OR001',
    title: 'Bhubaneswar Temple City Mess',
    type: 'mess',
    price: 5500,
    location: {
      state: 'Odisha',
      district: 'Khordha',
      city: 'Bhubaneswar',
      area: 'Old Town',
      pincode: '751002'
    },
    owner: {
      name: 'Jagannath Panda',
      phone: '+91 9437123456',
      email: 'jagannath.panda@gmail.com',
      experience: '16 years',
      rating: 4.7
    },
    property: {
      capacity: 45,
      rooms: 22,
      bathrooms: 8,
      amenities: ['WiFi', 'Fan', 'Temple View', 'Cultural Programs', 'Security'],
      meals: ['Breakfast', 'Lunch', 'Dinner'],
      cuisine: ['Odia Traditional', 'Jagannath Prasadam', 'Vegetarian']
    },
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    available: true
  },

  // BIHAR
  {
    id: 'BR001',
    title: 'Patna Education Hub PG',
    type: 'pg',
    price: 4500,
    location: {
      state: 'Bihar',
      district: 'Patna',
      city: 'Patna',
      area: 'Boring Road',
      pincode: '800001'
    },
    owner: {
      name: 'Manoj Kumar Singh',
      phone: '+91 9431234567',
      email: 'manoj.singh@gmail.com',
      experience: '13 years',
      rating: 4.3
    },
    property: {
      capacity: 35,
      rooms: 18,
      bathrooms: 6,
      amenities: ['WiFi', 'Fan', 'Library', 'Security', 'Coaching Centers Nearby'],
      meals: ['Breakfast', 'Lunch', 'Dinner'],
      cuisine: ['Bihari Traditional', 'North Indian']
    },
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    available: true
  },

  // JHARKHAND
  {
    id: 'JH001',
    title: 'Ranchi Hill Station Mess',
    type: 'mess',
    price: 5000,
    location: {
      state: 'Jharkhand',
      district: 'Ranchi',
      city: 'Ranchi',
      area: 'Kanke Road',
      pincode: '834008'
    },
    owner: {
      name: 'Tribal Cooperative Society',
      phone: '+91 9431987654',
      email: 'tribal.coop@gmail.com',
      experience: '9 years',
      rating: 4.5
    },
    property: {
      capacity: 40,
      rooms: 20,
      bathrooms: 7,
      amenities: ['WiFi', 'Fan', 'Hill View', 'Tribal Culture', 'Security'],
      meals: ['Breakfast', 'Lunch', 'Dinner'],
      cuisine: ['Tribal Traditional', 'North Indian', 'Organic Food']
    },
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    available: true
  }
];

// Combine with main properties
export const getAllProperties = () => {
  // This would import from demoProperties.js in actual implementation
  return [...additionalProperties];
};
