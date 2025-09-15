// Comprehensive Mock room data for MESS WALLAH with API-like structure
export const mockRooms = [
  {
    _id: '68c597a733be9e11bd88fa58',
    title: 'Premium Student Room - Koramangala',
    description: 'Spacious and well-furnished room perfect for students. Located in the heart of Koramangala with easy access to colleges and IT companies.',
    address: {
      street: '123 Main Street',
      area: 'Koramangala',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560034'
    },
    rentPerMonth: 12000,
    securityDeposit: 8000,
    rating: 4.8,
    reviewCount: 45,
    photos: [
      { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop', caption: 'Main room view' },
      { url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=600&fit=crop', caption: 'Bathroom' },
      { url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop', caption: 'Common area' },
      { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop', caption: 'Kitchen' }
    ],
    amenities: ['wifi', 'parking', 'mess', 'laundry', 'security', 'gym'],
    roomType: 'single',
    isAvailable: true,
    ownerName: 'Rajesh Kumar',
    ownerPhone: '+91 9876543210',
    features: [
      'Fully furnished room',
      'Attached bathroom',
      'Study table and chair',
      'Wardrobe',
      '24/7 security',
      'High-speed WiFi',
      'Mess facility available'
    ],
    reviews: [
      {
        reviewerName: 'Priya Sharma',
        rating: 5,
        comment: 'Excellent accommodation! Very clean and the owner is very helpful.',
        reviewDate: '2024-01-15'
      },
      {
        reviewerName: 'Arjun Patel',
        rating: 4,
        comment: 'Good location and facilities. Recommended for students.',
        reviewDate: '2024-01-10'
      }
    ]
  },
  {
    _id: '68c597a733be9e11bd88fa53',
    title: 'Cozy Girls PG - Whitefield',
    description: 'Safe and secure accommodation for working women and students. Modern amenities with homely atmosphere.',
    address: {
      street: '456 Park Avenue',
      area: 'Whitefield',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560066'
    },
    rentPerMonth: 9500,
    securityDeposit: 6000,
    rating: 4.6,
    reviewCount: 32,
    photos: [
      { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop', caption: 'Room interior' },
      { url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=600&fit=crop', caption: 'Modern bathroom' },
      { url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop', caption: 'Common lounge' },
      { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop', caption: 'Kitchen area' }
    ],
    amenities: ['wifi', 'mess', 'laundry', 'security', 'ac', 'parking'],
    roomType: 'shared',
    isAvailable: true,
    ownerName: 'Sunita Devi',
    ownerPhone: '+91 9876543211',
    features: [
      'Girls-only accommodation',
      'AC rooms available',
      'Nutritious meals',
      'CCTV surveillance',
      'Housekeeping service',
      'Recreation room'
    ],
    reviews: [
      {
        reviewerName: 'Anita Singh',
        rating: 5,
        comment: 'Very safe and comfortable for girls. Highly recommended!',
        reviewDate: '2024-01-20'
      }
    ]
  },
  {
    _id: '68c597a733be9e11bd88fa54',
    title: 'Budget Friendly Room - BTM Layout',
    description: 'Affordable accommodation for students and young professionals. Basic amenities with good connectivity.',
    address: {
      street: '789 College Road',
      area: 'BTM Layout',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560029'
    },
    rentPerMonth: 7500,
    securityDeposit: 4000,
    rating: 4.2,
    reviewCount: 28,
    photos: [
      { url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop', caption: 'Simple room setup' },
      { url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=600&fit=crop', caption: 'Clean bathroom' },
      { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop', caption: 'Shared kitchen' }
    ],
    amenities: ['wifi', 'mess', 'laundry', 'security'],
    roomType: 'shared',
    isAvailable: true,
    ownerName: 'Ramesh Gupta',
    ownerPhone: '+91 9876543212',
    features: [
      'Budget-friendly rent',
      'Near metro station',
      'Shared facilities',
      'Basic furniture',
      'Good ventilation'
    ],
    reviews: [
      {
        reviewerName: 'Vikash Kumar',
        rating: 4,
        comment: 'Good value for money. Perfect for students on budget.',
        reviewDate: '2024-01-12'
      }
    ]
  },
  {
    _id: '68c597a733be9e11bd88fa55',
    title: 'Luxury Studio Apartment - Indiranagar',
    description: 'Premium studio apartment with modern amenities. Perfect for working professionals seeking comfort and style.',
    address: {
      street: '321 Commercial Street',
      area: 'Indiranagar',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560038'
    },
    rentPerMonth: 18000,
    securityDeposit: 12000,
    rating: 4.9,
    reviewCount: 67,
    photos: [
      { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop', caption: 'Luxury studio' },
      { url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=600&fit=crop', caption: 'Premium bathroom' },
      { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop', caption: 'Modern kitchen' },
      { url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop', caption: 'Living area' }
    ],
    amenities: ['wifi', 'parking', 'gym', 'security', 'ac', 'balcony'],
    roomType: 'studio',
    isAvailable: true,
    ownerName: 'Priya Nair',
    ownerPhone: '+91 9876543213',
    features: [
      'Fully furnished studio',
      'Premium location',
      'Modern appliances',
      'Gym access',
      'Balcony with view',
      'High-speed internet'
    ],
    reviews: [
      {
        reviewerName: 'Rohit Sharma',
        rating: 5,
        comment: 'Amazing place! Worth every penny. Great location and facilities.',
        reviewDate: '2024-01-25'
      }
    ]
  },
  {
    _id: '68c597a733be9e11bd88fa56',
    title: 'Family Room - Jayanagar',
    description: 'Spacious accommodation suitable for small families or groups. Peaceful neighborhood with all necessary amenities.',
    address: {
      street: '654 Temple Street',
      area: 'Jayanagar',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560011'
    },
    rentPerMonth: 15000,
    securityDeposit: 10000,
    rating: 4.7,
    reviewCount: 41,
    photos: [
      { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop', caption: 'Family room' },
      { url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=600&fit=crop', caption: 'Spacious bathroom' },
      { url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop', caption: 'Common area' }
    ],
    amenities: ['wifi', 'parking', 'mess', 'laundry', 'security', 'playground'],
    roomType: 'family',
    isAvailable: true,
    ownerName: 'Lakshmi Rao',
    ownerPhone: '+91 9876543214',
    features: [
      'Family-friendly environment',
      'Spacious rooms',
      'Children play area',
      'Peaceful locality',
      'Good connectivity'
    ],
    reviews: [
      {
        reviewerName: 'Suresh Family',
        rating: 5,
        comment: 'Perfect for families. Kids love the play area. Very safe neighborhood.',
        reviewDate: '2024-01-18'
      }
    ]
  },
  {
    _id: '68c597a733be9e11bd88fa79',
    title: 'Luxury PG - Whitefield',
    description: 'Premium accommodation with modern amenities. Perfect for IT professionals working in Whitefield tech corridor.',
    address: {
      street: '456 Tech Park Road',
      area: 'Whitefield',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560066'
    },
    rentPerMonth: 15000,
    securityDeposit: 10000,
    rating: 4.9,
    reviewCount: 67,
    photos: [
      { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop', caption: 'Luxury room interior' },
      { url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=600&fit=crop', caption: 'Premium bathroom' },
      { url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop', caption: 'Common lounge area' },
      { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop', caption: 'Modern kitchen' },
      { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop', caption: 'Rooftop terrace' }
    ],
    amenities: ['wifi', 'parking', 'mess', 'laundry', 'security', 'gym', 'swimming_pool', 'ac'],
    roomType: 'single',
    isAvailable: true,
    ownerName: 'Vikram Reddy',
    ownerPhone: '+91 9876543215',
    features: [
      'Fully AC rooms',
      'High-speed WiFi',
      'Swimming pool access',
      'Gym facility',
      'Rooftop terrace',
      'Premium food service',
      '24/7 power backup',
      'Housekeeping service',
      'Parking available'
    ],
    owner: {
      _id: 'owner5',
      name: 'Vikram Reddy',
      phone: '+91 9876543215',
      email: 'vikram@example.com',
      verified: true
    },
    rules: ['No smoking', 'No loud music after 10 PM', 'Visitors allowed till 11 PM'],
    preferences: ['Working professionals preferred', 'IT employees welcome'],
    reviews: [
      {
        reviewerName: 'Rahul Sharma',
        rating: 5,
        comment: 'Excellent facilities! The swimming pool and gym are amazing. Perfect for IT professionals.',
        reviewDate: '2024-01-25'
      },
      {
        reviewerName: 'Neha Agarwal',
        rating: 5,
        comment: 'Very luxurious and well-maintained. The food quality is outstanding.',
        reviewDate: '2024-01-22'
      },
      {
        reviewerName: 'Karthik Nair',
        rating: 4,
        comment: 'Great location for Whitefield IT companies. Highly recommended!',
        reviewDate: '2024-01-20'
      }
    ]
  },
  // Additional rooms for comprehensive data
  {
    _id: '68c597a733be9e11bd88fa80',
    title: 'Modern Studio - HSR Layout',
    description: 'Contemporary studio apartment with all modern amenities. Perfect for young professionals.',
    address: {
      street: '789 Sector 2',
      area: 'HSR Layout',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560102'
    },
    rentPerMonth: 18000,
    securityDeposit: 12000,
    rating: 4.7,
    reviewCount: 34,
    photos: [
      { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop', caption: 'Studio interior' },
      { url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=600&fit=crop', caption: 'Modern bathroom' },
      { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop', caption: 'Kitchenette' }
    ],
    amenities: ['wifi', 'parking', 'ac', 'security', 'gym'],
    roomType: 'studio',
    isAvailable: true,
    ownerName: 'Priya Nair',
    ownerPhone: '+91 9876543216',
    features: ['Fully furnished', 'AC', 'Modern kitchen', 'Gym access', 'Parking'],
    owner: {
      _id: 'owner6',
      name: 'Priya Nair',
      phone: '+91 9876543216',
      email: 'priya@example.com',
      verified: true
    },
    rules: ['No pets', 'No smoking'],
    preferences: ['Working professionals'],
    reviews: [
      {
        reviewerName: 'Amit Kumar',
        rating: 5,
        comment: 'Perfect studio for professionals. Great location and amenities.',
        reviewDate: '2024-01-28'
      }
    ]
  },
  {
    _id: '68c597a733be9e11bd88fa81',
    title: 'Cozy Room - Indiranagar',
    description: 'Comfortable accommodation in the heart of Indiranagar. Close to pubs, restaurants and metro.',
    address: {
      street: '12th Main Road',
      area: 'Indiranagar',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560038'
    },
    rentPerMonth: 14000,
    securityDeposit: 8000,
    rating: 4.5,
    reviewCount: 42,
    photos: [
      { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop', caption: 'Cozy room' },
      { url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=600&fit=crop', caption: 'Clean bathroom' }
    ],
    amenities: ['wifi', 'mess', 'laundry', 'security'],
    roomType: 'single',
    isAvailable: true,
    ownerName: 'Suresh Reddy',
    ownerPhone: '+91 9876543217',
    features: ['Near metro', 'Furnished', 'Good connectivity'],
    owner: {
      _id: 'owner7',
      name: 'Suresh Reddy',
      phone: '+91 9876543217',
      email: 'suresh@example.com',
      verified: true
    },
    rules: ['No loud music after 10 PM'],
    preferences: ['Young professionals'],
    reviews: [
      {
        reviewerName: 'Sneha Patel',
        rating: 4,
        comment: 'Great location! Easy access to everything in Indiranagar.',
        reviewDate: '2024-01-26'
      }
    ]
  },
  {
    _id: '68c597a733be9e11bd88fa82',
    title: 'Shared Room - Electronic City',
    description: 'Budget-friendly shared accommodation near IT companies in Electronic City.',
    address: {
      street: 'Phase 1',
      area: 'Electronic City',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560100'
    },
    rentPerMonth: 6000,
    securityDeposit: 3000,
    rating: 4.1,
    reviewCount: 56,
    photos: [
      { url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop', caption: 'Shared room' },
      { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop', caption: 'Common kitchen' }
    ],
    amenities: ['wifi', 'mess', 'laundry', 'security'],
    roomType: 'shared',
    isAvailable: true,
    ownerName: 'Ramesh Kumar',
    ownerPhone: '+91 9876543218',
    features: ['Near IT companies', 'Budget-friendly', 'Good transport'],
    owner: {
      _id: 'owner8',
      name: 'Ramesh Kumar',
      phone: '+91 9876543218',
      email: 'ramesh@example.com',
      verified: true
    },
    rules: ['No smoking', 'Maintain cleanliness'],
    preferences: ['IT professionals', 'Students'],
    reviews: [
      {
        reviewerName: 'Rajesh Singh',
        rating: 4,
        comment: 'Good value for money. Perfect for IT employees.',
        reviewDate: '2024-01-24'
      }
    ]
  }
];

// API-like response helpers
export const createApiResponse = (data, success = true, message = '', pagination = null) => {
  return {
    success,
    message,
    data,
    pagination,
    timestamp: new Date().toISOString()
  };
};

// Function to get room by ID with API response format
export const getRoomById = (id) => {
  const room = mockRooms.find(room => room._id === id);
  if (room) {
    return createApiResponse(room, true, 'Room found successfully');
  }
  return createApiResponse(null, false, 'Room not found');
};

// Function to get all rooms with optional filters and pagination
export const getAllRooms = (filters = {}, page = 1, limit = 12) => {
  let filteredRooms = [...mockRooms];

  // Apply filters
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredRooms = filteredRooms.filter(room => 
      room.title.toLowerCase().includes(searchTerm) ||
      room.address.area.toLowerCase().includes(searchTerm) ||
      room.address.city.toLowerCase().includes(searchTerm) ||
      room.description.toLowerCase().includes(searchTerm)
    );
  }

  if (filters.location) {
    const locationTerm = filters.location.toLowerCase();
    filteredRooms = filteredRooms.filter(room => 
      room.address.area.toLowerCase().includes(locationTerm) ||
      room.address.city.toLowerCase().includes(locationTerm)
    );
  }

  if (filters.roomType) {
    filteredRooms = filteredRooms.filter(room => room.roomType === filters.roomType);
  }

  if (filters.minRent) {
    filteredRooms = filteredRooms.filter(room => room.rentPerMonth >= parseInt(filters.minRent));
  }

  if (filters.maxRent) {
    filteredRooms = filteredRooms.filter(room => room.rentPerMonth <= parseInt(filters.maxRent));
  }

  if (filters.amenities && filters.amenities.length > 0) {
    filteredRooms = filteredRooms.filter(room => 
      filters.amenities.every(amenity => room.amenities.includes(amenity))
    );
  }

  // Apply pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedRooms = filteredRooms.slice(startIndex, endIndex);

  const pagination = {
    currentPage: page,
    totalPages: Math.ceil(filteredRooms.length / limit),
    totalItems: filteredRooms.length,
    itemsPerPage: limit,
    hasNextPage: endIndex < filteredRooms.length,
    hasPrevPage: page > 1
  };

  return createApiResponse({
    rooms: paginatedRooms,
    pagination
  }, true, `Found ${filteredRooms.length} rooms`);
};

// Function to get featured rooms
export const getFeaturedRooms = (limit = 6) => {
  const featuredRooms = mockRooms
    .filter(room => room.rating >= 4.5)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);

  return createApiResponse(featuredRooms, true, 'Featured rooms retrieved successfully');
};

// Function to get room statistics
export const getRoomStats = () => {
  const stats = {
    totalRooms: mockRooms.length,
    availableRooms: mockRooms.filter(room => room.isAvailable).length,
    averageRent: Math.round(mockRooms.reduce((sum, room) => sum + room.rentPerMonth, 0) / mockRooms.length),
    averageRating: (mockRooms.reduce((sum, room) => sum + room.rating, 0) / mockRooms.length).toFixed(1),
    roomTypes: {
      single: mockRooms.filter(room => room.roomType === 'single').length,
      shared: mockRooms.filter(room => room.roomType === 'shared').length,
      studio: mockRooms.filter(room => room.roomType === 'studio').length,
      family: mockRooms.filter(room => room.roomType === 'family').length
    },
    cities: [...new Set(mockRooms.map(room => room.address.city))],
    areas: [...new Set(mockRooms.map(room => room.address.area))]
  };

  return createApiResponse(stats, true, 'Room statistics retrieved successfully');
};

// Function to search rooms by location
export const searchRoomsByLocation = (location, limit = 10) => {
  const locationTerm = location.toLowerCase();
  const rooms = mockRooms.filter(room => 
    room.address.area.toLowerCase().includes(locationTerm) ||
    room.address.city.toLowerCase().includes(locationTerm)
  ).slice(0, limit);

  return createApiResponse(rooms, true, `Found ${rooms.length} rooms in ${location}`);
};

export default mockRooms;
