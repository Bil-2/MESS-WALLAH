const Room = require('../models/Room');
const User = require('../models/User');

// Advanced search with multiple criteria
const advancedSearch = async (req, res) => {
  try {
    const {
      query,           // Text search
      city,            // City filter
      state,           // State filter
      minPrice,        // Minimum price
      maxPrice,        // Maximum price
      roomType,        // Single, Double, Triple, etc.
      amenities,       // Array of amenities
      cuisine,         // Food preferences
      gender,          // Boys, Girls, Co-ed
      latitude,        // For location-based search
      longitude,       // For location-based search
      radius,          // Search radius in km (default 10km)
      sortBy,          // price, rating, distance
      sortOrder,       // asc, desc
      page = 1,        // Pagination
      limit = 12       // Results per page
    } = req.query;

    // Build search pipeline
    let pipeline = [];

    // 1. Match stage - Basic filtering
    let matchStage = {
      isActive: true,
      isVerified: true
    };

    // Text search across multiple fields
    if (query) {
      matchStage.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { address: { $regex: query, $options: 'i' } },
        { city: { $regex: query, $options: 'i' } },
        { state: { $regex: query, $options: 'i' } },
        { ownerName: { $regex: query, $options: 'i' } },
        { 'amenities.name': { $regex: query, $options: 'i' } },
        { 'cuisine.type': { $regex: query, $options: 'i' } }
      ];
    }

    // Location filters
    if (city) {
      matchStage.city = { $regex: city, $options: 'i' };
    }
    if (state) {
      matchStage.state = { $regex: state, $options: 'i' };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      matchStage.monthlyRent = {};
      if (minPrice) matchStage.monthlyRent.$gte = parseInt(minPrice);
      if (maxPrice) matchStage.monthlyRent.$lte = parseInt(maxPrice);
    }

    // Room type filter
    if (roomType) {
      matchStage.roomType = { $regex: roomType, $options: 'i' };
    }

    // Gender preference filter
    if (gender) {
      matchStage.genderPreference = { $regex: gender, $options: 'i' };
    }

    // Amenities filter
    if (amenities) {
      const amenitiesList = Array.isArray(amenities) ? amenities : [amenities];
      matchStage['amenities.name'] = { $in: amenitiesList.map(a => new RegExp(a, 'i')) };
    }

    // Cuisine filter
    if (cuisine) {
      const cuisineList = Array.isArray(cuisine) ? cuisine : [cuisine];
      matchStage['cuisine.type'] = { $in: cuisineList.map(c => new RegExp(c, 'i')) };
    }

    pipeline.push({ $match: matchStage });

    // 2. Location-based search (if coordinates provided)
    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      const searchRadius = parseInt(radius) || 10; // Default 10km

      pipeline.push({
        $addFields: {
          distance: {
            $multiply: [
              {
                $acos: {
                  $add: [
                    {
                      $multiply: [
                        { $sin: { $multiply: [{ $divide: [lat, 180] }, Math.PI] } },
                        { $sin: { $multiply: [{ $divide: ['$coordinates.latitude', 180] }, Math.PI] } }
                      ]
                    },
                    {
                      $multiply: [
                        { $cos: { $multiply: [{ $divide: [lat, 180] }, Math.PI] } },
                        { $cos: { $multiply: [{ $divide: ['$coordinates.latitude', 180] }, Math.PI] } },
                        { $cos: { $multiply: [{ $divide: [{ $subtract: [lng, '$coordinates.longitude'] }, 180] }, Math.PI] } }
                      ]
                    }
                  ]
                }
              },
              6371 // Earth's radius in km
            ]
          }
        }
      });

      // Filter by radius
      pipeline.push({
        $match: {
          distance: { $lte: searchRadius }
        }
      });
    }

    // 3. Add calculated fields
    pipeline.push({
      $addFields: {
        averageRating: {
          $cond: {
            if: { $gt: [{ $size: '$reviews' }, 0] },
            then: { $avg: '$reviews.rating' },
            else: 0
          }
        },
        totalReviews: { $size: '$reviews' },
        priceScore: {
          $divide: [
            { $subtract: [15000, '$monthlyRent'] }, // Normalize price (assuming max 15k)
            15000
          ]
        }
      }
    });

    // 4. Sorting
    let sortStage = {};
    switch (sortBy) {
      case 'price':
        sortStage.monthlyRent = sortOrder === 'desc' ? -1 : 1;
        break;
      case 'rating':
        sortStage.averageRating = -1;
        sortStage.totalReviews = -1;
        break;
      case 'distance':
        if (latitude && longitude) {
          sortStage.distance = 1;
        }
        break;
      case 'relevance':
      default:
        // Relevance score based on multiple factors
        pipeline.push({
          $addFields: {
            relevanceScore: {
              $add: [
                { $multiply: ['$averageRating', 0.3] },
                { $multiply: ['$priceScore', 0.2] },
                { $multiply: [{ $divide: ['$totalReviews', 100] }, 0.2] },
                { $cond: { if: { $gt: ['$totalReviews', 10] }, then: 0.3, else: 0 } }
              ]
            }
          }
        });
        sortStage.relevanceScore = -1;
        break;
    }
    pipeline.push({ $sort: sortStage });

    // 5. Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: parseInt(limit) });

    // 6. Populate owner details
    pipeline.push({
      $lookup: {
        from: 'users',
        localField: 'owner',
        foreignField: '_id',
        as: 'ownerDetails'
      }
    });

    pipeline.push({
      $addFields: {
        ownerDetails: { $arrayElemAt: ['$ownerDetails', 0] }
      }
    });

    // Execute search
    const rooms = await Room.aggregate(pipeline);

    // Get total count for pagination
    const countPipeline = pipeline.slice(0, -3); // Remove skip, limit, and lookup
    countPipeline.push({ $count: 'total' });
    const countResult = await Room.aggregate(countPipeline);
    const totalResults = countResult[0]?.total || 0;

    // Calculate pagination info
    const totalPages = Math.ceil(totalResults / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.status(200).json({
      success: true,
      data: {
        rooms,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalResults,
          hasNextPage,
          hasPrevPage,
          resultsPerPage: parseInt(limit)
        },
        filters: {
          query,
          city,
          state,
          priceRange: { min: minPrice, max: maxPrice },
          roomType,
          amenities,
          cuisine,
          gender,
          location: latitude && longitude ? { latitude, longitude, radius } : null,
          sortBy,
          sortOrder
        }
      }
    });

  } catch (error) {
    console.error('❌ Advanced Search Error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get search suggestions based on user input
const getSearchSuggestions = async (req, res) => {
  try {
    const { query, limit = 10 } = req.query;

    if (!query || query.length < 2) {
      return res.status(200).json({
        success: true,
        data: {
          suggestions: [],
          categories: []
        }
      });
    }

    // Get suggestions from different categories
    const suggestions = await Promise.all([
      // City suggestions
      Room.distinct('city', {
        city: { $regex: query, $options: 'i' },
        isActive: true
      }),

      // Area/locality suggestions  
      Room.distinct('area', {
        area: { $regex: query, $options: 'i' },
        isActive: true
      }),

      // Amenity suggestions
      Room.distinct('amenities.name', {
        'amenities.name': { $regex: query, $options: 'i' },
        isActive: true
      }),

      // Popular searches (you can maintain this in a separate collection)
      Room.aggregate([
        {
          $match: {
            $or: [
              { title: { $regex: query, $options: 'i' } },
              { description: { $regex: query, $options: 'i' } }
            ],
            isActive: true
          }
        },
        {
          $group: {
            _id: '$city',
            count: { $sum: 1 },
            avgPrice: { $avg: '$monthlyRent' }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 3 }
      ])
    ]);

    const [cities, areas, amenities, popularSearches] = suggestions;

    // Format suggestions with proper filtering
    const formattedSuggestions = [
      ...cities.slice(0, 3).map(city => ({
        type: 'city',
        value: city,
        label: `${city} - City`,
        icon: '🏙️'
      })),
      ...areas.slice(0, 3).filter(Boolean).map(area => ({
        type: 'area',
        value: area,
        label: `${area} - Area`,
        icon: '📍'
      })),
      ...amenities.slice(0, 3).filter(Boolean).map(amenity => ({
        type: 'amenity',
        value: amenity,
        label: `${amenity} - Amenity`,
        icon: '🏠'
      })),
      ...popularSearches.slice(0, 3).map(search => ({
        type: 'popular',
        value: search._id,
        label: `${search._id} - ${search.count} properties`,
        icon: '🔥',
        metadata: {
          count: search.count,
          avgPrice: Math.round(search.avgPrice)
        }
      }))
    ].slice(0, parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        suggestions: formattedSuggestions,
        query,
        totalSuggestions: formattedSuggestions.length
      }
    });

  } catch (error) {
    console.error('❌ Search Suggestions Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get suggestions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get nearby properties based on coordinates
const getNearbyProperties = async (req, res) => {
  try {
    const { latitude, longitude, radius = 5, limit = 20 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const searchRadius = parseInt(radius);

    const nearbyRooms = await Room.aggregate([
      {
        $match: {
          isActive: true,
          isVerified: true,
          'coordinates.latitude': { $exists: true },
          'coordinates.longitude': { $exists: true }
        }
      },
      {
        $addFields: {
          distance: {
            $multiply: [
              {
                $acos: {
                  $add: [
                    {
                      $multiply: [
                        { $sin: { $multiply: [{ $divide: [lat, 180] }, Math.PI] } },
                        { $sin: { $multiply: [{ $divide: ['$coordinates.latitude', 180] }, Math.PI] } }
                      ]
                    },
                    {
                      $multiply: [
                        { $cos: { $multiply: [{ $divide: [lat, 180] }, Math.PI] } },
                        { $cos: { $multiply: [{ $divide: ['$coordinates.latitude', 180] }, Math.PI] } },
                        { $cos: { $multiply: [{ $divide: [{ $subtract: [lng, '$coordinates.longitude'] }, 180] }, Math.PI] } }
                      ]
                    }
                  ]
                }
              },
              6371 // Earth's radius in km
            ]
          }
        }
      },
      {
        $match: {
          distance: { $lte: searchRadius }
        }
      },
      {
        $sort: { distance: 1 }
      },
      {
        $limit: parseInt(limit)
      },
      {
        $lookup: {
          from: 'users',
          localField: 'owner',
          foreignField: '_id',
          as: 'ownerDetails'
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        properties: nearbyRooms,
        searchCenter: { latitude: lat, longitude: lng },
        radius: searchRadius,
        totalFound: nearbyRooms.length
      }
    });

  } catch (error) {
    console.error('❌ Nearby Properties Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to find nearby properties',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get filter options for the search interface
const getFilterOptions = async (req, res) => {
  try {
    const filterOptions = await Promise.all([
      // Cities
      Room.distinct('city', { isActive: true }),
      // States  
      Room.distinct('state', { isActive: true }),
      // Room types
      Room.distinct('roomType', { isActive: true }),
      // Amenities
      Room.distinct('amenities.name', { isActive: true }),
      // Cuisine types
      Room.distinct('cuisine.type', { isActive: true }),
      // Gender preferences
      Room.distinct('genderPreference', { isActive: true }),
      // Price range
      Room.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: null,
            minPrice: { $min: '$monthlyRent' },
            maxPrice: { $max: '$monthlyRent' },
            avgPrice: { $avg: '$monthlyRent' }
          }
        }
      ])
    ]);

    const [cities, states, roomTypes, amenities, cuisines, genderPreferences, priceRange] = filterOptions;

    res.status(200).json({
      success: true,
      data: {
        cities: cities.sort(),
        states: states.sort(),
        roomTypes: roomTypes.sort(),
        amenities: amenities.sort(),
        cuisines: cuisines.sort(),
        genderPreferences: genderPreferences.sort(),
        priceRange: priceRange[0] || { minPrice: 0, maxPrice: 15000, avgPrice: 7500 }
      }
    });

  } catch (error) {
    console.error('❌ Filter Options Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get filter options',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  advancedSearch,
  getSearchSuggestions,
  getNearbyProperties,
  getFilterOptions
};
