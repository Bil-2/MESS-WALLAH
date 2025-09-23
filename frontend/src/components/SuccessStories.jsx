import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiUsers, FiHeart, FiAward } from 'react-icons/fi';

const SuccessStories = () => {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [currentCategory, setCurrentCategory] = useState(0);

  const reviewCategories = [
    {
      title: "Bachelor Reviews",
      icon: <FiUsers className="w-6 h-6" />,
      color: "from-blue-500 to-purple-600",
      reviews: [
        {
          name: "Arjun Sharma",
          initial: "A",
          review: "Amazing experience! The room was clean, affordable, and the location in Koramangala was perfect for my IT job. The WiFi is super fast and the food quality is excellent.",
          location: "Koramangala, Bangalore",
          rating: 5
        },
        {
          name: "Rahul Patel",
          initial: "R",
          review: "Best PG in Pune! The community here is amazing, made so many friends. The security is top-notch and the management is very responsive to any issues.",
          location: "Pune",
          rating: 5
        },
        {
          name: "Vikash Kumar",
          initial: "V",
          review: "Great value for money in Delhi. The room is spacious and the mess food reminds me of home. Only suggestion would be better AC in summer months.",
          location: "Delhi",
          rating: 4
        }
      ]
    },
    {
      title: "Family Reviews",
      icon: <FiHeart className="w-6 h-6" />,
      color: "from-pink-500 to-rose-600",
      reviews: [
        {
          name: "Priya & Rajesh Gupta",
          initial: "P",
          review: "Perfect for our small family! The 2BHK in Gurgaon is well-maintained, safe neighborhood, and great schools nearby for our daughter. Highly recommend!",
          location: "Gurgaon",
          rating: 5
        },
        {
          name: "Sunita & Anil Singh",
          initial: "S",
          review: "Excellent service! We found a beautiful 3BHK in Hyderabad through MessWallah. The verification process gave us confidence and the owner is very cooperative.",
          location: "Hyderabad",
          rating: 5
        },
        {
          name: "Meera & Suresh Nair",
          initial: "M",
          review: "Good experience overall in Chennai. The family-friendly environment and nearby amenities made our transition smooth. Could improve on maintenance response time.",
          location: "Chennai",
          rating: 4
        }
      ]
    },
    {
      title: "Senior Citizen Reviews",
      icon: <FiAward className="w-6 h-6" />,
      color: "from-green-500 to-teal-600",
      reviews: [
        {
          name: "Kamala Devi",
          initial: "K",
          review: "Wonderful experience! The ground floor room in Jaipur is perfect for my mobility needs. The caretaker is very caring and the medical facilities nearby are excellent.",
          location: "Jaipur",
          rating: 5
        },
        {
          name: "Ramesh Chandra",
          initial: "R",
          review: "At 68, finding suitable accommodation was challenging. MessWallah understood my needs perfectly. The senior-friendly room in Kolkata has all necessary facilities.",
          location: "Kolkata",
          rating: 5
        },
        {
          name: "Lakshmi Iyer",
          initial: "L",
          review: "Good service for senior citizens in Mumbai. The location is peaceful and the staff is respectful. Would appreciate more recreational activities for elderly residents.",
          location: "Mumbai",
          rating: 4
        }
      ]
    }
  ];

  const allReviews = reviewCategories.flatMap(category =>
    category.reviews.map(review => ({
      ...review,
      categoryTitle: category.title,
      categoryColor: category.color,
      categoryIcon: category.icon
    }))
  );

  // Auto-rotate reviews every 5 seconds (reduced frequency)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReviewIndex((prev) => (prev + 1) % allReviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [allReviews.length]);

  // Update category based on current review
  useEffect(() => {
    const currentReview = allReviews[currentReviewIndex];
    const categoryIndex = reviewCategories.findIndex(cat => cat.title === currentReview?.categoryTitle);
    setCurrentCategory(categoryIndex);
  }, [currentReviewIndex, allReviews, reviewCategories]);

  const currentReview = allReviews[currentReviewIndex];

  const reviewVariants = {
    enter: {
      opacity: 0,
      x: 50
    },
    center: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      x: -50,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
      />
    ));
  };

  return (
    <div className="py-16 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            💬 Success Stories
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-700 dark:text-gray-300 mb-6"
          >
            Discover how MessWallah transformed the lives of thousands of students across India
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center space-x-6 text-lg"
          >
            <div className="flex items-center space-x-2">
              <div className="flex">
                {renderStars(5)}
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">4.9/5 Rating</span>
            </div>
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
            <div className="flex items-center space-x-2">
              <FiUsers className="w-5 h-5 text-blue-500" />
              <span className="font-semibold text-gray-900 dark:text-white">50,000+ Happy Students</span>
            </div>
          </motion.div>
        </div>

        {/* Review Display */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentReviewIndex}
              initial="enter"
              animate="center"
              exit="exit"
              variants={reviewVariants}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700"
            >
              {/* Review Header */}
              <div className="flex items-start space-x-4 mb-6">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${currentReview?.categoryColor} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                  {currentReview?.initial}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {currentReview?.name}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-400 mb-2">
                    {currentReview?.location}
                  </p>
                  <div className="flex items-center space-x-1">
                    {renderStars(currentReview?.rating || 5)}
                  </div>
                </div>
                <div className={`p-2 rounded-lg bg-gradient-to-r ${currentReview?.categoryColor} bg-opacity-10`}>
                  {currentReview?.categoryIcon}
                </div>
              </div>

              {/* Review Content */}
              <blockquote className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed italic">
                "{currentReview?.review}"
              </blockquote>

              {/* Category Badge */}
              <div className="mt-6 flex justify-between items-center">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${currentReview?.categoryColor} text-white`}>
                  {currentReview?.categoryTitle}
                </span>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Review {currentReviewIndex + 1} of {allReviews.length}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center mt-8 space-x-2">
          {allReviews.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${index === currentReviewIndex
                  ? `w-8 bg-gradient-to-r ${currentReview?.categoryColor}`
                  : 'w-2 bg-gray-300 dark:bg-gray-600'
                }`}
              animate={{
                scale: index === currentReviewIndex ? 1.2 : 1,
              }}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default SuccessStories;
