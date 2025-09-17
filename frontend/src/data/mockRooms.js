// Base room templates for generating large dataset
const baseRoomTemplates = [
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
  },
  {
    _id: '68c597a733be9e11bd88fa83',
    title: 'Premium Girls PG - Marathahalli',
    description: 'Exclusive accommodation for girls with top-notch security and modern amenities. Located near tech parks.',
    address: {
      street: '45 Tech Park Road',
      area: 'Marathahalli',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560037'
    },
    rentPerMonth: 15000,
    securityDeposit: 10000,
    rating: 4.9,
    reviewCount: 67,
    photos: [
      { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop', caption: 'Main room' },
      { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop', caption: 'Common area' }
    ],
    amenities: ['wifi', 'ac', 'mess', 'laundry', 'security', 'gym', 'parking'],
    roomType: 'single',
    isAvailable: true,
    ownerName: 'Meera Patel',
    ownerPhone: '+91 9876543219',
    features: ['Girls only', 'CCTV surveillance', 'Biometric access', 'Modern kitchen'],
    owner: {
      _id: 'owner9',
      name: 'Meera Patel',
      phone: '+91 9876543219',
      email: 'meera@example.com',
      verified: true
    },
    reviews: [
      {
        reviewerName: 'Sneha Gupta',
        rating: 5,
        comment: 'Excellent safety measures and very clean rooms.',
        reviewDate: '2024-01-20'
      }
    ]
  },
  {
    _id: '68c597a733be9e11bd88fa84',
    title: 'Student Hostel - Banashankari',
    description: 'Affordable hostel accommodation for students with mess facility and study rooms.',
    address: {
      street: '78 College Road',
      area: 'Banashankari',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560070'
    },
    rentPerMonth: 8500,
    securityDeposit: 5000,
    rating: 4.2,
    reviewCount: 89,
    photos: [
      { url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop', caption: 'Dormitory' },
      { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop', caption: 'Study room' }
    ],
    amenities: ['wifi', 'mess', 'laundry', 'security', 'library'],
    roomType: 'shared',
    isAvailable: true,
    ownerName: 'Ravi Shankar',
    ownerPhone: '+91 9876543220',
    features: ['Study rooms', 'Library access', 'Mess included', 'Near colleges'],
    owner: {
      _id: 'owner10',
      name: 'Ravi Shankar',
      phone: '+91 9876543220',
      email: 'ravi@example.com',
      verified: true
    },
    reviews: [
      {
        reviewerName: 'Karthik M',
        rating: 4,
        comment: 'Good for students, affordable and clean.',
        reviewDate: '2024-01-18'
      }
    ]
  },
  {
    _id: '68c597a733be9e11bd88fa85',
    title: 'Executive Room - MG Road',
    description: 'Premium accommodation for executives and business travelers. Located in the heart of the city.',
    address: {
      street: '12 MG Road',
      area: 'MG Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001'
    },
    rentPerMonth: 25000,
    securityDeposit: 15000,
    rating: 4.7,
    reviewCount: 34,
    photos: [
      { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop', caption: 'Executive room' },
      { url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=600&fit=crop', caption: 'Business center' }
    ],
    amenities: ['wifi', 'ac', 'parking', 'gym', 'business-center', 'concierge'],
    roomType: 'executive',
    isAvailable: true,
    ownerName: 'Anita Sharma',
    ownerPhone: '+91 9876543221',
    features: ['Business center', 'Concierge service', 'Premium location', 'Metro access'],
    owner: {
      _id: 'owner11',
      name: 'Anita Sharma',
      phone: '+91 9876543221',
      email: 'anita@example.com',
      verified: true
    },
    reviews: [
      {
        reviewerName: 'Rajesh Kumar',
        rating: 5,
        comment: 'Perfect for business stays, excellent service.',
        reviewDate: '2024-01-22'
      }
    ]
  },
  {
    _id: '68c597a733be9e11bd88fa86',
    title: 'Cozy Studio - Rajajinagar',
    description: 'Compact studio apartment perfect for single professionals. Modern amenities in a quiet neighborhood.',
    address: {
      street: '34 Rajaji Nagar',
      area: 'Rajajinagar',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560010'
    },
    rentPerMonth: 11000,
    securityDeposit: 7000,
    rating: 4.4,
    reviewCount: 28,
    photos: [
      { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop', caption: 'Studio layout' },
      { url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop', caption: 'Kitchen area' }
    ],
    amenities: ['wifi', 'ac', 'parking', 'security'],
    roomType: 'studio',
    isAvailable: true,
    ownerName: 'Deepak Joshi',
    ownerPhone: '+91 9876543222',
    features: ['Compact design', 'Modern kitchen', 'Quiet area', 'Good connectivity'],
    owner: {
      _id: 'owner12',
      name: 'Deepak Joshi',
      phone: '+91 9876543222',
      email: 'deepak@example.com',
      verified: true
    },
    reviews: [
      {
        reviewerName: 'Pooja Singh',
        rating: 4,
        comment: 'Nice studio, perfect for single person.',
        reviewDate: '2024-01-16'
      }
    ]
  },
  {
    _id: '68c597a733be9e11bd88fa87',
    title: 'Family Suite - Malleshwaram',
    description: 'Spacious family accommodation with separate bedrooms and living area. Perfect for families.',
    address: {
      street: '67 Malleshwaram Circle',
      area: 'Malleshwaram',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560003'
    },
    rentPerMonth: 22000,
    securityDeposit: 12000,
    rating: 4.6,
    reviewCount: 41,
    photos: [
      { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop', caption: 'Living room' },
      { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop', caption: 'Master bedroom' }
    ],
    amenities: ['wifi', 'parking', 'security', 'playground', 'garden'],
    roomType: 'family',
    isAvailable: true,
    ownerName: 'Lakshmi Devi',
    ownerPhone: '+91 9876543223',
    features: ['Family friendly', 'Separate bedrooms', 'Garden access', 'Near schools'],
    owner: {
      _id: 'owner13',
      name: 'Lakshmi Devi',
      phone: '+91 9876543223',
      email: 'lakshmi@example.com',
      verified: true
    },
    reviews: [
      {
        reviewerName: 'Suresh Family',
        rating: 5,
        comment: 'Excellent for families, kids love the garden.',
        reviewDate: '2024-01-14'
      }
    ]
  },
  {
    _id: '68c597a733be9e11bd88fa88',
    title: 'Budget Room - Yelahanka',
    description: 'Affordable accommodation for students and budget travelers. Basic amenities with good connectivity.',
    address: {
      street: '89 New Town',
      area: 'Yelahanka',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560064'
    },
    rentPerMonth: 6500,
    securityDeposit: 3000,
    rating: 3.9,
    reviewCount: 52,
    photos: [
      { url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop', caption: 'Simple room' },
      { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop', caption: 'Common area' }
    ],
    amenities: ['wifi', 'mess', 'laundry', 'security'],
    roomType: 'shared',
    isAvailable: true,
    ownerName: 'Manjunath Reddy',
    ownerPhone: '+91 9876543224',
    features: ['Budget friendly', 'Near airport', 'Good transport', 'Basic amenities'],
    owner: {
      _id: 'owner14',
      name: 'Manjunath Reddy',
      phone: '+91 9876543224',
      email: 'manjunath@example.com',
      verified: true
    },
    reviews: [
      {
        reviewerName: 'Student Group',
        rating: 4,
        comment: 'Good value for money, clean and safe.',
        reviewDate: '2024-01-12'
      }
    ]
  }
];

// Complete India Districts Data
const indiaDistrictsData = {
  "Andhra Pradesh": [
    "Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool",
    "Prakasam", "Srikakulam", "Sri Potti Sriramulu Nellore", "Visakhapatnam",
    "Vizianagaram", "West Godavari", "YSR Kadapa"
  ],
  "Arunachal Pradesh": [
    "Tawang", "West Kameng", "East Kameng", "Papum Pare", "Kurung Kumey",
    "Kra Daadi", "Lower Subansiri", "Upper Subansiri", "West Siang",
    "East Siang", "Siang", "Upper Siang", "Lower Siang", "Lower Dibang Valley",
    "Dibang Valley", "Anjaw", "Lohit", "Namsai", "Changlang", "Tirap", "Longding"
  ],
  "Assam": [
    "Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo",
    "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Goalpara",
    "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup", "Kamrup Metropolitan",
    "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon",
    "Nagaon", "Nalbari", "Dima Hasao", "Sivasagar", "Sonitpur",
    "South Salmara-Mankachar", "Tinsukia", "Udalguri", "West Karbi Anglong"
  ],
  "Bihar": [
    "Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur",
    "Bhojpur", "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj",
    "Jamui", "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj",
    "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur",
    "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa",
    "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan",
    "Supaul", "Vaishali", "West Champaran"
  ],
  "Chhattisgarh": [
    "Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bijapur",
    "Bilaspur", "Dantewada", "Dhamtari", "Durg", "Gariaband", "Janjgir-Champa",
    "Jashpur", "Kabirdham", "Kanker", "Kondagaon", "Korba", "Koriya",
    "Mahasamund", "Mungeli", "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon",
    "Sukma", "Surajpur", "Surguja"
  ],
  "Goa": ["North Goa", "South Goa"],
  "Gujarat": [
    "Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch",
    "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhoomi Dwarka",
    "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda",
    "Kutch", "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari",
    "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat",
    "Surendranagar", "Tapi", "Vadodara", "Valsad"
  ],
  "Haryana": [
    "Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram",
    "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh",
    "Nuh", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak",
    "Sirsa", "Sonipat", "Yamunanagar"
  ],
  "Himachal Pradesh": [
    "Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul and Spiti",
    "Mandi", "Shimla", "Sirmaur", "Solan", "Una"
  ],
  "Jharkhand": [
    "Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa",
    "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti",
    "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh",
    "Ranchi", "Sahibganj", "Seraikela Kharsawan", "Simdega", "West Singhbhum"
  ],
  "Karnataka": [
    "Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban",
    "Bidar", "Chamarajanagar", "Chikballapur", "Chikkamagaluru", "Chitradurga",
    "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri",
    "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru",
    "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada",
    "Vijayapura", "Yadgir"
  ],
  "Kerala": [
    "Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam",
    "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta",
    "Thiruvananthapuram", "Thrissur", "Wayanad"
  ],
  "Madhya Pradesh": [
    "Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani",
    "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara",
    "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior",
    "Harda", "Hoshangabad", "Indore", "Jabalpur", "Jhabua", "Katni",
    "Khandwa", "Khargone", "Mandla", "Mandsaur", "Morena", "Narsinghpur",
    "Neemuch", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar",
    "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur",
    "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria",
    "Vidisha"
  ],
  "Maharashtra": [
    "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara",
    "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli",
    "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban",
    "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar",
    "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara",
    "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"
  ],
  "Manipur": [
    "Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West",
    "Jiribam", "Kakching", "Kamjong", "Kangpokpi", "Noney", "Pherzawl",
    "Senapati", "Tamenglong", "Tengnoupal", "Thoubal", "Ukhrul"
  ],
  "Meghalaya": [
    "East Garo Hills", "East Jaintia Hills", "East Khasi Hills", "North Garo Hills",
    "Ri Bhoi", "South Garo Hills", "South West Garo Hills", "South West Khasi Hills",
    "West Garo Hills", "West Jaintia Hills", "West Khasi Hills"
  ],
  "Mizoram": [
    "Aizawl", "Champhai", "Hnahthial", "Khawzawl", "Kolasib",
    "Lawngtlai", "Lunglei", "Mamit", "Saiha", "Saitual", "Serchhip"
  ],
  "Nagaland": [
    "Chumoukedima", "Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung",
    "Mon", "Niuland", "Noklak", "Peren", "Phek", "Shamator",
    "Tseminyu", "Tuensang", "Wokha", "Zunheboto"
  ],
  "Odisha": [
    "Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh",
    "Cuttack", "Deogarh", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur",
    "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara",
    "Kendujhar", "Khordha", "Koraput", "Malkangiri", "Mayurbhanj",
    "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada",
    "Sambalpur", "Subarnapur", "Sundargarh"
  ],
  "Punjab": [
    "Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib",
    "Fazilka", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar",
    "Kapurthala", "Ludhiana", "Malerkotla", "Mansa", "Moga",
    "Mohali", "Muktsar", "Pathankot", "Patiala", "Rupnagar",
    "Sangrur", "Shaheed Bhagat Singh Nagar", "Tarn Taran"
  ],
  "Rajasthan": [
    "Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur",
    "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa",
    "Dholpur", "Dungarpur", "Hanumangarh", "Jaipur", "Jaisalmer",
    "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli",
    "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand",
    "Sawai Madhopur", "Sikar", "Sirohi", "Sri Ganganagar",
    "Tonk", "Udaipur"
  ],
  "Sikkim": ["East Sikkim", "North Sikkim", "South Sikkim", "West Sikkim"],
  "Tamil Nadu": [
    "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore",
    "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kancheepuram",
    "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam",
    "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram",
    "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur",
    "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur",
    "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore",
    "Viluppuram", "Virudhunagar"
  ],
  "Telangana": [
    "Adilabad", "Bhadradri Kothagudem", "Hanamkonda", "Hyderabad", "Jagitial",
    "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy",
    "Karimnagar", "Khammam", "Komaram Bheem Asifabad", "Mahabubabad",
    "Mahabubnagar", "Mancherial", "Medak", "Medchal–Malkajgiri", "Mulugu",
    "Nagarkurnool", "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad",
    "Peddapalli", "Rajanna Sircilla", "Rangareddy", "Sangareddy",
    "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal",
    "Yadadri Bhuvanagiri"
  ],
  "Tripura": [
    "Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala",
    "South Tripura", "Unakoti", "West Tripura"
  ],
  "Uttar Pradesh": [
    "Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha",
    "Auraiya", "Ayodhya", "Azamgarh", "Baghpat", "Bahraich",
    "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly",
    "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr",
    "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah",
    "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar",
    "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur",
    "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi",
    "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi",
    "Kheri", "Kushinagar", "Lalitpur", "Lucknow", "Maharajganj",
    "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur",
    "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Prayagraj",
    "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar",
    "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", "Sitapur",
    "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"
  ],
  "Uttarakhand": [
    "Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun",
    "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh",
    "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar", "Uttarkashi"
  ],
  "West Bengal": [
    "Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur",
    "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram",
    "Kalimpong", "Kolkata", "Malda", "Murshidabad", "Nadia",
    "North 24 Parganas", "Paschim Bardhaman", "Paschim Medinipur",
    "Purba Bardhaman", "Purba Medinipur", "Purulia",
    "South 24 Parganas", "Uttar Dinajpur"
  ],
  "Andaman and Nicobar Islands": ["Nicobar", "North and Middle Andaman", "South Andaman"],
  "Chandigarh": ["Chandigarh"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Dadra and Nagar Haveli", "Daman", "Diu"],
  "Delhi": [
    "Central Delhi", "East Delhi", "New Delhi", "North Delhi",
    "North East Delhi", "North West Delhi", "Shahdara", "South Delhi",
    "South East Delhi", "South West Delhi", "West Delhi"
  ],
  "Jammu and Kashmir": [
    "Anantnag", "Bandipora", "Baramulla", "Budgam", "Doda", "Ganderbal",
    "Jammu", "Kathua", "Kishtwar", "Kulgam", "Kupwara", "Poonch",
    "Pulwama", "Rajouri", "Ramban", "Reasi", "Samba", "Shopian",
    "Srinagar", "Udhampur"
  ],
  "Ladakh": ["Kargil", "Leh"],
  "Lakshadweep": ["Agatti", "Amini", "Androth", "Kavaratti", "Kalpeni", "Minicoy"],
  "Puducherry": ["Karaikal", "Mahe", "Puducherry", "Yanam"]
};

// Indian names database for realistic owner names
const indianNames = {
  male: [
    'Rajesh Kumar', 'Amit Sharma', 'Suresh Gupta', 'Vikash Singh', 'Ravi Patel', 'Manoj Agarwal',
    'Deepak Verma', 'Sanjay Jain', 'Ashok Yadav', 'Ramesh Tiwari', 'Vinod Kumar', 'Anil Mishra',
    'Prakash Pandey', 'Santosh Dubey', 'Mukesh Srivastava', 'Dinesh Chandra', 'Naresh Joshi',
    'Mahesh Tripathi', 'Yogesh Saxena', 'Sunil Shukla', 'Ajay Rastogi', 'Vijay Malhotra',
    'Rohit Bansal', 'Sachin Goyal', 'Nitin Aggarwal', 'Kiran Chopra', 'Mohan Lal',
    'Govind Prasad', 'Brijesh Pathak', 'Harish Chandra', 'Jagdish Prasad', 'Kamlesh Kumar',
    'Lokesh Gupta', 'Nitesh Sharma', 'Pankaj Singh', 'Rakesh Agarwal', 'Shailesh Tiwari',
    'Umesh Verma', 'Vimal Kumar', 'Yashpal Singh', 'Bharat Bhushan', 'Chandra Prakash'
  ],
  female: [
    'Sunita Devi', 'Meera Sharma', 'Kavita Gupta', 'Priya Singh', 'Anjali Patel', 'Rekha Agarwal',
    'Pooja Verma', 'Neeta Jain', 'Seema Yadav', 'Geeta Tiwari', 'Sushma Kumar', 'Usha Mishra',
    'Vandana Pandey', 'Kiran Dubey', 'Mamta Srivastava', 'Nisha Chandra', 'Ritu Joshi',
    'Shobha Tripathi', 'Asha Saxena', 'Lata Shukla', 'Manju Rastogi', 'Sudha Malhotra',
    'Anita Bansal', 'Babita Goyal', 'Chhaya Aggarwal', 'Deepika Chopra', 'Kamala Devi',
    'Pushpa Prasad', 'Radha Pathak', 'Sarita Chandra', 'Veena Prasad', 'Archana Kumar',
    'Bharti Gupta', 'Chandni Sharma', 'Divya Singh', 'Hemlata Agarwal', 'Jyoti Tiwari',
    'Kalpana Verma', 'Lalita Kumar', 'Madhuri Singh', 'Nirmala Bhushan', 'Purnima Prakash'
  ]
};

const roomTypes = ['single', 'shared', 'studio', 'family', 'executive'];
const amenitiesList = ['wifi', 'ac', 'parking', 'mess', 'laundry', 'security', 'gym', 'library', 'garden', 'balcony'];

// Function to get all districts as a flat array
const getAllDistricts = () => {
  const allDistricts = [];
  Object.keys(indiaDistrictsData).forEach(state => {
    indiaDistrictsData[state].forEach(district => {
      allDistricts.push({ state, district });
    });
  });
  return allDistricts;
};

// Function to generate realistic Indian mobile number
const generateMobileNumber = (index) => {
  const prefixes = ['98', '97', '96', '95', '94', '93', '92', '91', '90', '89', '88', '87', '86', '85', '84', '83', '82', '81', '80', '79', '78', '77', '76', '75', '74', '73', '72', '70'];
  const prefix = prefixes[index % prefixes.length];
  const remaining = String(index).padStart(8, '0').slice(-8);
  return `+91 ${prefix}${remaining}`;
};

// Function to generate room for specific district
const generateRoomForDistrict = (index, stateDistrictInfo) => {
  const { state, district } = stateDistrictInfo;
  const roomType = roomTypes[index % roomTypes.length];
  
  // Price varies by state (metro cities more expensive)
  const metroStates = ['Maharashtra', 'Karnataka', 'Delhi', 'Tamil Nadu', 'Gujarat', 'Haryana'];
  const isMetro = metroStates.includes(state);
  const baseRent = isMetro ? 
    Math.floor(Math.random() * 25000) + 8000 : // 8000-33000 for metro
    Math.floor(Math.random() * 15000) + 3000;  // 3000-18000 for non-metro
  
  const rating = (Math.random() * 2 + 3).toFixed(1); // 3.0-5.0
  const reviewCount = Math.floor(Math.random() * 100) + 10;
  
  // Select random amenities
  const numAmenities = Math.floor(Math.random() * 6) + 3; // 3-8 amenities
  const selectedAmenities = amenitiesList
    .sort(() => 0.5 - Math.random())
    .slice(0, numAmenities);

  // Generate realistic owner name
  const allNames = [...indianNames.male, ...indianNames.female];
  const ownerName = allNames[index % allNames.length];
  const ownerPhone = generateMobileNumber(index);

  const roomTitles = [
    `Premium ${roomType} Room - ${district}`,
    `Cozy ${roomType} PG - ${district}`,
    `Modern ${roomType} Accommodation - ${district}`,
    `Comfortable ${roomType} Stay - ${district}`,
    `Luxury ${roomType} Room - ${district}`,
    `Budget ${roomType} Room - ${district}`,
    `Spacious ${roomType} PG - ${district}`,
    `Executive ${roomType} Suite - ${district}`
  ];

  const descriptions = [
    `Well-furnished ${roomType} room perfect for students and professionals. Located in ${district}, ${state} with excellent connectivity.`,
    `Safe and secure accommodation in ${district}, ${state}. Modern amenities with homely atmosphere.`,
    `Affordable accommodation for students and young professionals in ${district}, ${state}. Basic amenities with good connectivity.`,
    `Premium accommodation with modern amenities in ${district}, ${state}. Perfect for working professionals.`,
    `Spacious accommodation suitable for families and groups in ${district}, ${state}. Peaceful neighborhood.`
  ];

  // Handle city name normalization for better search
  const bangaloreAreas = ['Bengaluru Urban', 'Koramangala', 'Whitefield', 'BTM Layout', 'Indiranagar', 'Electronic City', 'Marathahalli', 'HSR Layout', 'Jayanagar', 'Rajajinagar', 'Malleshwaram', 'Banashankari', 'Yelahanka'];
  const normalizedCity = bangaloreAreas.includes(district) ? 'Bangalore' : district;
  
  return {
    _id: `68c597a733be9e11bd88f${String(index).padStart(3, '0')}`,
    title: roomTitles[index % roomTitles.length],
    description: descriptions[index % descriptions.length],
    address: {
      street: `${Math.floor(Math.random() * 999) + 1} ${district} Street`,
      area: district,
      city: normalizedCity,
      state: state,
      pincode: `${Math.floor(Math.random() * 900000) + 100000}`
    },
    rentPerMonth: baseRent,
    securityDeposit: Math.floor(baseRent * 0.6),
    rating: parseFloat(rating),
    reviewCount: reviewCount,
    photos: [
      { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop', caption: 'Main room view' },
      { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop', caption: 'Common area' },
      { url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop', caption: 'Kitchen' }
    ],
    amenities: selectedAmenities,
    roomType: roomType,
    isAvailable: Math.random() > 0.1, // 90% available
    ownerName: ownerName,
    ownerPhone: ownerPhone,
    features: [
      'Fully furnished room',
      'Good connectivity',
      '24/7 security',
      selectedAmenities.includes('wifi') ? 'High-speed WiFi' : 'Basic internet',
      selectedAmenities.includes('mess') ? 'Mess facility available' : 'Kitchen access'
    ],
    owner: {
      _id: `owner${index}`,
      name: ownerName,
      phone: ownerPhone,
      email: `${ownerName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      verified: Math.random() > 0.2 // 80% verified
    },
    reviews: [
      {
        reviewerName: `User ${Math.floor(Math.random() * 1000)}`,
        rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
        comment: `Good accommodation in ${district}. Owner ${ownerName} is very helpful and responsive.`,
        reviewDate: '2024-01-15'
      }
    ]
  };
};

// Important districts with metro areas - 15 rooms each (12 available, 3 booked)
const importantDistricts = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "YSR Kadapa"],
  "Arunachal Pradesh": ["Itanagar", "Tawang", "Pasighat"],
  "Assam": ["Guwahati", "Dibrugarh", "Jorhat", "Silchar"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Dantewada", "Jagdalpur"],
  "Goa": ["Panaji", "Margao"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
  "Haryana": ["Gurugram", "Faridabad", "Panipat", "Ambala", "Hisar"],
  "Himachal Pradesh": ["Shimla", "Dharamshala", "Mandi", "Solan"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro"],
  "Karnataka": ["Bengaluru Urban", "Koramangala", "Whitefield", "BTM Layout", "Indiranagar", "Electronic City", "Marathahalli", "HSR Layout", "Jayanagar", "Rajajinagar", "Malleshwaram", "Banashankari", "Yelahanka", "Mysuru", "Mangalore", "Hubballi-Dharwad"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Kollam", "Alappuzha"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain"],
  "Maharashtra": ["Mumbai City", "Pune", "Nagpur", "Nashik", "Aurangabad"],
  "Manipur": ["Imphal East", "Imphal West", "Churachandpur"],
  "Meghalaya": ["Shillong", "Tura"],
  "Mizoram": ["Aizawl", "Lunglei", "Champhai"],
  "Nagaland": ["Kohima", "Dimapur", "Mokokchung"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Sambalpur", "Rourkela"],
  "Punjab": ["Amritsar", "Ludhiana", "Patiala", "Jalandhar", "Mohali"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer"],
  "Sikkim": ["Gangtok", "Namchi"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"],
  "Tripura": ["Agartala", "Udaipur"],
  "Uttar Pradesh": ["Lucknow", "Kanpur Nagar", "Agra", "Varanasi", "Ghaziabad"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Nainital", "Rishikesh"],
  "West Bengal": ["Kolkata", "Howrah", "Darjeeling", "Siliguri", "Asansol"],
  "Andaman and Nicobar Islands": ["Port Blair"],
  "Chandigarh": ["Chandigarh"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Diu", "Silvassa"],
  "Delhi": ["New Delhi", "Central Delhi", "South Delhi", "East Delhi", "North Delhi"],
  "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Jammu City"],
  "Ladakh": ["Leh", "Kargil"],
  "Lakshadweep": ["Kavaratti"],
  "Puducherry": ["Puducherry", "Karaikal"]
};

// Function to generate room with specific availability
const generateRoomWithAvailability = (index, stateDistrictInfo, isAvailable = true) => {
  const room = generateRoomForDistrict(index, stateDistrictInfo);
  room.isAvailable = isAvailable;
  return room;
};

// Generate rooms for important districts
export const mockRooms = [];
let roomIndex = 0;

// Generate 15 rooms per important district (12 available, 3 booked)
Object.keys(importantDistricts).forEach(state => {
  importantDistricts[state].forEach(district => {
    const districtInfo = { state, district };
    
    // Generate 15 rooms for this district
    for (let i = 0; i < 15; i++) {
      const isAvailable = i < 12; // First 12 are available, last 3 are booked
      mockRooms.push(generateRoomWithAvailability(roomIndex++, districtInfo, isAvailable));
    }
  });
});

// Add rooms from remaining districts to reach good coverage
const allDistricts = getAllDistricts();
const remainingDistricts = allDistricts.filter(districtInfo => {
  const importantList = importantDistricts[districtInfo.state] || [];
  return !importantList.includes(districtInfo.district);
});

// Add 1-3 rooms from remaining districts (optimized for faster search)
remainingDistricts.slice(0, 150).forEach(districtInfo => {
  const numRooms = Math.floor(Math.random() * 2) + 1; // 1-2 rooms (reduced for performance)
  for (let i = 0; i < numRooms; i++) {
    const isAvailable = Math.random() > 0.2; // 80% available
    mockRooms.push(generateRoomWithAvailability(roomIndex++, districtInfo, isAvailable));
  }
});

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
export const getAllRooms = (filters = {}, page = 1, limit = 50) => {
  let filteredRooms = [...mockRooms];

  // Apply filters
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase().trim();
    
    // Handle common city name variations and normalize spaces
    const normalizedSearchTerm = searchTerm.replace(/\s+/g, '').toLowerCase();
    
    const cityAliases = {
      'bangalore': ['bengaluru', 'bengaluru urban', 'bangalore', 'bangaluru', 'bengalore'],
      'bengaluru': ['bengaluru', 'bengaluru urban', 'bangalore', 'bangaluru', 'bengalore'],
      'mumbai': ['mumbai', 'mumbai city', 'bombay'],
      'delhi': ['delhi', 'new delhi', 'central delhi', 'south delhi', 'east delhi', 'north delhi'],
      'chennai': ['chennai', 'madras'],
      'kolkata': ['kolkata', 'calcutta'],
      'hyderabad': ['hyderabad', 'secunderabad'],
      'pune': ['pune', 'poona'],
      'vizag': ['visakhapatnam', 'vizag'],
      'visakhapatnam': ['visakhapatnam', 'vizag']
    };
    
    // Get all possible search terms including aliases (check both original and normalized)
    const searchTerms = cityAliases[searchTerm] || cityAliases[normalizedSearchTerm] || [searchTerm, normalizedSearchTerm];
    
    // Optimized search with early return for exact matches
    filteredRooms = filteredRooms.filter(room => {
      const title = room.title.toLowerCase();
      const area = room.address.area.toLowerCase();
      const city = room.address.city.toLowerCase();
      const state = room.address.state.toLowerCase();
      const description = room.description.toLowerCase();
      
      // Check against all search terms (including aliases)
      return searchTerms.some(term => {
        // Check for exact matches first (fastest)
        if (area === term || city === term) {
          return true;
        }
        
        // Then check for partial matches
        return title.includes(term) ||
               area.includes(term) ||
               city.includes(term) ||
               state.includes(term) ||
               description.includes(term);
      });
    });
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
