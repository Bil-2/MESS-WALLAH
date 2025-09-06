// Demo Properties Data - All India Coverage
// This file contains realistic property and owner data across major Indian cities

export const demoProperties = [
  // MAHARASHTRA
  {
    id: 'MH001',
    title: 'Modern Mess Near IIT Bombay',
    type: 'mess',
    price: 8500,
    location: {
      state: 'Maharashtra',
      district: 'Mumbai',
      city: 'Powai',
      area: 'IIT Campus Road',
      pincode: '400076'
    },
    owner: {
      name: 'Rajesh Sharma',
      phone: '+91 9876543210',
      email: 'rajesh.sharma@gmail.com',
      experience: '8 years',
      rating: 4.8
    },
    property: {
      capacity: 50,
      rooms: 25,
      bathrooms: 8,
      amenities: ['WiFi', 'AC', 'Laundry', 'Security', 'Parking'],
      meals: ['Breakfast', 'Lunch', 'Dinner'],
      cuisine: ['North Indian', 'South Indian', 'Gujarati']
    },
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    available: true
  },
  {
    id: 'MH002',
    title: 'Premium PG in Pune',
    type: 'pg',
    price: 12000,
    location: {
      state: 'Maharashtra',
      district: 'Pune',
      city: 'Kothrud',
      area: 'Near Karve Road',
      pincode: '411038'
    },
    owner: {
      name: 'Priya Patil',
      phone: '+91 9123456789',
      email: 'priya.patil@yahoo.com',
      experience: '5 years',
      rating: 4.6
    },
    property: {
      capacity: 30,
      rooms: 15,
      bathrooms: 6,
      amenities: ['WiFi', 'AC', 'Gym', 'Security', 'Parking', 'Housekeeping'],
      meals: ['Breakfast', 'Dinner'],
      cuisine: ['Maharashtrian', 'North Indian']
    },
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    available: true
  },

  // KARNATAKA
  {
    id: 'KA001',
    title: 'Tech Hub Mess Bangalore',
    type: 'mess',
    price: 9000,
    location: {
      state: 'Karnataka',
      district: 'Bangalore Urban',
      city: 'Koramangala',
      area: '5th Block',
      pincode: '560095'
    },
    owner: {
      name: 'Suresh Kumar',
      phone: '+91 9988776655',
      email: 'suresh.kumar@gmail.com',
      experience: '10 years',
      rating: 4.9
    },
    property: {
      capacity: 80,
      rooms: 40,
      bathrooms: 12,
      amenities: ['WiFi', 'AC', 'Laundry', 'Security', 'Parking', 'Recreation Room'],
      meals: ['Breakfast', 'Lunch', 'Dinner'],
      cuisine: ['South Indian', 'North Indian', 'Continental']
    },
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    available: true
  },
  {
    id: 'KA002',
    title: 'Mysore Palace View PG',
    type: 'pg',
    price: 7500,
    location: {
      state: 'Karnataka',
      district: 'Mysore',
      city: 'Mysore',
      area: 'Saraswathipuram',
      pincode: '570009'
    },
    owner: {
      name: 'Lakshmi Devi',
      phone: '+91 9445566778',
      email: 'lakshmi.devi@hotmail.com',
      experience: '12 years',
      rating: 4.7
    },
    property: {
      capacity: 25,
      rooms: 12,
      bathrooms: 5,
      amenities: ['WiFi', 'Fan', 'Laundry', 'Security', 'Garden'],
      meals: ['Breakfast', 'Lunch', 'Dinner'],
      cuisine: ['South Indian', 'Mysore Special']
    },
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    available: true
  },

  // TAMIL NADU
  {
    id: 'TN001',
    title: 'Chennai IT Corridor Mess',
    type: 'mess',
    price: 8000,
    location: {
      state: 'Tamil Nadu',
      district: 'Chennai',
      city: 'Sholinganallur',
      area: 'OMR Road',
      pincode: '600119'
    },
    owner: {
      name: 'Venkatesh Iyer',
      phone: '+91 9876543211',
      email: 'venkatesh.iyer@gmail.com',
      experience: '7 years',
      rating: 4.5
    },
    property: {
      capacity: 60,
      rooms: 30,
      bathrooms: 10,
      amenities: ['WiFi', 'AC', 'Laundry', 'Security', 'Parking', 'Power Backup'],
      meals: ['Breakfast', 'Lunch', 'Dinner'],
      cuisine: ['South Indian', 'Tamil Traditional']
    },
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    available: true
  },

  // DELHI
  {
    id: 'DL001',
    title: 'Delhi University Area PG',
    type: 'pg',
    price: 15000,
    location: {
      state: 'Delhi',
      district: 'North Delhi',
      city: 'Delhi',
      area: 'Kamla Nagar',
      pincode: '110007'
    },
    owner: {
      name: 'Amit Singh',
      phone: '+91 9811223344',
      email: 'amit.singh@gmail.com',
      experience: '6 years',
      rating: 4.4
    },
    property: {
      capacity: 40,
      rooms: 20,
      bathrooms: 8,
      amenities: ['WiFi', 'AC', 'Laundry', 'Security', 'Metro Nearby'],
      meals: ['Breakfast', 'Dinner'],
      cuisine: ['North Indian', 'Punjabi']
    },
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    available: true
  },

  // GUJARAT
  {
    id: 'GJ001',
    title: 'Ahmedabad Business District Mess',
    type: 'mess',
    price: 7000,
    location: {
      state: 'Gujarat',
      district: 'Ahmedabad',
      city: 'Ahmedabad',
      area: 'Vastrapur',
      pincode: '380015'
    },
    owner: {
      name: 'Kiran Patel',
      phone: '+91 9909876543',
      email: 'kiran.patel@gmail.com',
      experience: '9 years',
      rating: 4.6
    },
    property: {
      capacity: 45,
      rooms: 22,
      bathrooms: 7,
      amenities: ['WiFi', 'AC', 'Laundry', 'Security', 'Parking'],
      meals: ['Breakfast', 'Lunch', 'Dinner'],
      cuisine: ['Gujarati', 'North Indian', 'Jain Food']
    },
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    available: true
  },

  // RAJASTHAN
  {
    id: 'RJ001',
    title: 'Jaipur Pink City PG',
    type: 'pg',
    price: 9500,
    location: {
      state: 'Rajasthan',
      district: 'Jaipur',
      city: 'Jaipur',
      area: 'Malviya Nagar',
      pincode: '302017'
    },
    owner: {
      name: 'Maharani Devi',
      phone: '+91 9414567890',
      email: 'maharani.devi@gmail.com',
      experience: '11 years',
      rating: 4.8
    },
    property: {
      capacity: 35,
      rooms: 18,
      bathrooms: 6,
      amenities: ['WiFi', 'AC', 'Traditional Decor', 'Security', 'Parking'],
      meals: ['Breakfast', 'Lunch', 'Dinner'],
      cuisine: ['Rajasthani', 'North Indian']
    },
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    available: true
  },

  // WEST BENGAL
  {
    id: 'WB001',
    title: 'Kolkata Cultural Hub Mess',
    type: 'mess',
    price: 6500,
    location: {
      state: 'West Bengal',
      district: 'Kolkata',
      city: 'Kolkata',
      area: 'Salt Lake',
      pincode: '700064'
    },
    owner: {
      name: 'Subrata Chatterjee',
      phone: '+91 9830123456',
      email: 'subrata.chatterjee@gmail.com',
      experience: '15 years',
      rating: 4.7
    },
    property: {
      capacity: 55,
      rooms: 28,
      bathrooms: 9,
      amenities: ['WiFi', 'Fan', 'Laundry', 'Security', 'Cultural Programs'],
      meals: ['Breakfast', 'Lunch', 'Dinner'],
      cuisine: ['Bengali', 'North Indian', 'Chinese']
    },
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    available: true
  }
];

// Search and filter functions
export const searchProperties = (query, filters = {}) => {
  let results = [...demoProperties];

  if (query) {
    const searchTerm = query.toLowerCase();
    results = results.filter(property =>
      property.title.toLowerCase().includes(searchTerm) ||
      property.location.state.toLowerCase().includes(searchTerm) ||
      property.location.city.toLowerCase().includes(searchTerm) ||
      property.location.area.toLowerCase().includes(searchTerm) ||
      property.owner.name.toLowerCase().includes(searchTerm)
    );
  }

  if (filters.state) {
    results = results.filter(property =>
      property.location.state.toLowerCase() === filters.state.toLowerCase()
    );
  }

  if (filters.city) {
    results = results.filter(property =>
      property.location.city.toLowerCase() === filters.city.toLowerCase()
    );
  }

  if (filters.type) {
    results = results.filter(property => property.type === filters.type);
  }

  if (filters.maxPrice) {
    results = results.filter(property => property.price <= filters.maxPrice);
  }

  return results;
};

// Get unique states and cities for filters
export const getStates = () => {
  const states = [...new Set(demoProperties.map(p => p.location.state))];
  return states.sort();
};

export const getCitiesByState = (state) => {
  const cities = demoProperties
    .filter(p => p.location.state === state)
    .map(p => p.location.city);
  return [...new Set(cities)].sort();
};
