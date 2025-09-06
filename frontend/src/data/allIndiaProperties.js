// All India Properties - Complete Database
import { demoProperties } from './demoProperties';
import { additionalProperties } from './moreProperties';

// Extended properties covering remaining states
const extendedProperties = [
  // ASSAM
  {
    id: 'AS001',
    title: 'Guwahati Tea Garden Mess',
    type: 'mess',
    price: 5000,
    location: {
      state: 'Assam',
      district: 'Kamrup',
      city: 'Guwahati',
      area: 'Paltan Bazaar',
      pincode: '781008'
    },
    owner: {
      name: 'Bhupen Hazarika',
      phone: '+91 9435123456',
      email: 'bhupen.hazarika@gmail.com',
      experience: '11 years',
      rating: 4.6
    },
    property: {
      capacity: 35,
      rooms: 18,
      bathrooms: 6,
      amenities: ['WiFi', 'Fan', 'Tea Garden View', 'Cultural Programs', 'Security'],
      meals: ['Breakfast', 'Lunch', 'Dinner'],
      cuisine: ['Assamese', 'Bengali', 'North East Special']
    },
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    available: true
  },

  // HIMACHAL PRADESH
  {
    id: 'HP001',
    title: 'Shimla Hill Station PG',
    type: 'pg',
    price: 12000,
    location: {
      state: 'Himachal Pradesh',
      district: 'Shimla',
      city: 'Shimla',
      area: 'Mall Road',
      pincode: '171001'
    },
    owner: {
      name: 'Raj Kumar Thakur',
      phone: '+91 9418123456',
      email: 'raj.thakur@gmail.com',
      experience: '15 years',
      rating: 4.9
    },
    property: {
      capacity: 25,
      rooms: 12,
      bathrooms: 5,
      amenities: ['WiFi', 'Heater', 'Mountain View', 'Fireplace', 'Security'],
      meals: ['Breakfast', 'Lunch', 'Dinner'],
      cuisine: ['Himachali', 'North Indian', 'Continental']
    },
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    available: true
  },

  // UTTARAKHAND
  {
    id: 'UK001',
    title: 'Dehradun Valley Mess',
    type: 'mess',
    price: 8000,
    location: {
      state: 'Uttarakhand',
      district: 'Dehradun',
      city: 'Dehradun',
      area: 'Rajpur Road',
      pincode: '248001'
    },
    owner: {
      name: 'Govind Singh Rawat',
      phone: '+91 9412345678',
      email: 'govind.rawat@gmail.com',
      experience: '12 years',
      rating: 4.7
    },
    property: {
      capacity: 50,
      rooms: 25,
      bathrooms: 8,
      amenities: ['WiFi', 'AC', 'Valley View', 'Yoga Center', 'Security'],
      meals: ['Breakfast', 'Lunch', 'Dinner'],
      cuisine: ['Garhwali', 'North Indian', 'Organic Food']
    },
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    available: true
  },

  // JAMMU & KASHMIR
  {
    id: 'JK001',
    title: 'Srinagar Dal Lake PG',
    type: 'pg',
    price: 10000,
    location: {
      state: 'Jammu and Kashmir',
      district: 'Srinagar',
      city: 'Srinagar',
      area: 'Dal Lake',
      pincode: '190001'
    },
    owner: {
      name: 'Abdul Rashid Khan',
      phone: '+91 9419123456',
      email: 'abdul.khan@gmail.com',
      experience: '20 years',
      rating: 4.8
    },
    property: {
      capacity: 20,
      rooms: 10,
      bathrooms: 4,
      amenities: ['WiFi', 'Heater', 'Lake View', 'Houseboat Experience', 'Security'],
      meals: ['Breakfast', 'Lunch', 'Dinner'],
      cuisine: ['Kashmiri', 'Mughlai', 'North Indian']
    },
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    available: true
  },

  // MADHYA PRADESH
  {
    id: 'MP001',
    title: 'Bhopal Lake City Mess',
    type: 'mess',
    price: 6500,
    location: {
      state: 'Madhya Pradesh',
      district: 'Bhopal',
      city: 'Bhopal',
      area: 'New Market',
      pincode: '462001'
    },
    owner: {
      name: 'Ramesh Agrawal',
      phone: '+91 9425123456',
      email: 'ramesh.agrawal@gmail.com',
      experience: '14 years',
      rating: 4.5
    },
    property: {
      capacity: 60,
      rooms: 30,
      bathrooms: 10,
      amenities: ['WiFi', 'AC', 'Lake View', 'Cultural Center', 'Security'],
      meals: ['Breakfast', 'Lunch', 'Dinner'],
      cuisine: ['Malwa', 'North Indian', 'Street Food']
    },
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    available: true
  },

  // CHHATTISGARH
  {
    id: 'CG001',
    title: 'Raipur Industrial Hub PG',
    type: 'pg',
    price: 7000,
    location: {
      state: 'Chhattisgarh',
      district: 'Raipur',
      city: 'Raipur',
      area: 'Shankar Nagar',
      pincode: '492007'
    },
    owner: {
      name: 'Santosh Kumar Sahu',
      phone: '+91 9425987654',
      email: 'santosh.sahu@gmail.com',
      experience: '8 years',
      rating: 4.4
    },
    property: {
      capacity: 40,
      rooms: 20,
      bathrooms: 7,
      amenities: ['WiFi', 'AC', 'Industrial Area', 'Transport Facility', 'Security'],
      meals: ['Breakfast', 'Lunch', 'Dinner'],
      cuisine: ['Chhattisgarhi', 'North Indian']
    },
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    available: true
  },

  // GOA
  {
    id: 'GA001',
    title: 'Panaji Beach Side Mess',
    type: 'mess',
    price: 15000,
    location: {
      state: 'Goa',
      district: 'North Goa',
      city: 'Panaji',
      area: 'Miramar Beach',
      pincode: '403001'
    },
    owner: {
      name: 'Maria Fernandes',
      phone: '+91 9823456789',
      email: 'maria.fernandes@gmail.com',
      experience: '10 years',
      rating: 4.9
    },
    property: {
      capacity: 30,
      rooms: 15,
      bathrooms: 6,
      amenities: ['WiFi', 'AC', 'Beach View', 'Water Sports', 'Security'],
      meals: ['Breakfast', 'Lunch', 'Dinner'],
      cuisine: ['Goan', 'Seafood', 'Continental']
    },
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    available: true
  }
];

// Combine all properties
export const allIndiaProperties = [
  ...demoProperties,
  ...additionalProperties,
  ...extendedProperties
];

// Enhanced search functionality
export const searchAllProperties = (query = '', filters = {}) => {
  let results = [...allIndiaProperties];

  // Text search
  if (query && query.trim()) {
    const searchTerm = query.toLowerCase().trim();
    results = results.filter(property =>
      property.title.toLowerCase().includes(searchTerm) ||
      property.location.state.toLowerCase().includes(searchTerm) ||
      property.location.district.toLowerCase().includes(searchTerm) ||
      property.location.city.toLowerCase().includes(searchTerm) ||
      property.location.area.toLowerCase().includes(searchTerm) ||
      property.location.pincode.includes(searchTerm) ||
      property.owner.name.toLowerCase().includes(searchTerm) ||
      property.property.amenities.some(amenity =>
        amenity.toLowerCase().includes(searchTerm)
      ) ||
      property.property.cuisine.some(cuisine =>
        cuisine.toLowerCase().includes(searchTerm)
      )
    );
  }

  // State filter
  if (filters.state && filters.state !== 'all') {
    results = results.filter(property =>
      property.location.state.toLowerCase() === filters.state.toLowerCase()
    );
  }

  // City filter
  if (filters.city && filters.city !== 'all') {
    results = results.filter(property =>
      property.location.city.toLowerCase() === filters.city.toLowerCase()
    );
  }

  // Type filter
  if (filters.type && filters.type !== 'all') {
    results = results.filter(property => property.type === filters.type);
  }

  // Price range filter
  if (filters.minPrice) {
    results = results.filter(property => property.price >= filters.minPrice);
  }
  if (filters.maxPrice) {
    results = results.filter(property => property.price <= filters.maxPrice);
  }

  // Amenities filter
  if (filters.amenities && filters.amenities.length > 0) {
    results = results.filter(property =>
      filters.amenities.every(amenity =>
        property.property.amenities.some(propAmenity =>
          propAmenity.toLowerCase().includes(amenity.toLowerCase())
        )
      )
    );
  }

  // Sort results
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'price_low':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        results.sort((a, b) => b.owner.rating - a.owner.rating);
        break;
      case 'experience':
        results.sort((a, b) =>
          parseInt(b.owner.experience) - parseInt(a.owner.experience)
        );
        break;
      default:
        // Keep original order
        break;
    }
  }

  return results;
};

// Get all unique states
export const getAllStates = () => {
  const states = [...new Set(allIndiaProperties.map(p => p.location.state))];
  return states.sort();
};

// Get cities by state
export const getCitiesByState = (state) => {
  if (!state || state === 'all') return [];
  const cities = allIndiaProperties
    .filter(p => p.location.state.toLowerCase() === state.toLowerCase())
    .map(p => p.location.city);
  return [...new Set(cities)].sort();
};

// Get districts by state
export const getDistrictsByState = (state) => {
  if (!state || state === 'all') return [];
  const districts = allIndiaProperties
    .filter(p => p.location.state.toLowerCase() === state.toLowerCase())
    .map(p => p.location.district);
  return [...new Set(districts)].sort();
};

// Get all unique amenities
export const getAllAmenities = () => {
  const amenities = allIndiaProperties.reduce((acc, property) => {
    return [...acc, ...property.property.amenities];
  }, []);
  return [...new Set(amenities)].sort();
};

// Get property by ID
export const getPropertyById = (id) => {
  return allIndiaProperties.find(property => property.id === id);
};

// Get properties by owner
export const getPropertiesByOwner = (ownerName) => {
  return allIndiaProperties.filter(property =>
    property.owner.name.toLowerCase().includes(ownerName.toLowerCase())
  );
};

// Get statistics
export const getPropertyStats = () => {
  return {
    totalProperties: allIndiaProperties.length,
    totalStates: getAllStates().length,
    totalCities: [...new Set(allIndiaProperties.map(p => p.location.city))].length,
    averagePrice: Math.round(
      allIndiaProperties.reduce((sum, p) => sum + p.price, 0) / allIndiaProperties.length
    ),
    averageRating: (
      allIndiaProperties.reduce((sum, p) => sum + p.owner.rating, 0) / allIndiaProperties.length
    ).toFixed(1),
    typeDistribution: {
      mess: allIndiaProperties.filter(p => p.type === 'mess').length,
      pg: allIndiaProperties.filter(p => p.type === 'pg').length
    }
  };
};
