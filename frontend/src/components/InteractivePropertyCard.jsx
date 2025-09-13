import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Star,
  Heart,
  Share2,
  Eye,
  Camera,
  Play,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Car,
  Utensils,
  Shield,
  Users,
  Phone,
  MessageCircle,
  Calendar,
  TrendingUp,
  Award,
  Zap,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const InteractivePropertyCard = ({ room, onBooking, onViewDetails }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showFullGallery, setShowFullGallery] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickInfo, setShowQuickInfo] = useState(false);
  const cardRef = useRef(null);

  // Mock images for demo
  const images = [
    '/api/placeholder/400/300',
    '/api/placeholder/400/300',
    '/api/placeholder/400/300',
    '/api/placeholder/400/300',
    '/api/placeholder/400/300'
  ];

  const amenities = [
    { id: 'wifi', icon: Wifi, label: 'High-Speed WiFi', available: true },
    { id: 'parking', icon: Car, label: 'Parking', available: true },
    { id: 'mess', icon: Utensils, label: 'Mess Facility', available: true },
    { id: 'security', icon: Shield, label: '24/7 Security', available: true },
    { id: 'gym', icon: Users, label: 'Gym', available: false }
  ];

  const highlights = [
    { icon: Award, label: 'Top Rated', color: 'text-yellow-500' },
    { icon: TrendingUp, label: 'Trending', color: 'text-orange-500' },
    { icon: Zap, label: 'Quick Book', color: 'text-blue-500' }
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: room.title,
          text: `Check out this amazing room: ${room.title}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const ImageGallery = () => (
    <AnimatePresence>
      {showFullGallery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowFullGallery(false)}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowFullGallery(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              ✕
            </button>

            <div className="relative">
              <img
                src={images[currentImageIndex]}
                alt={`Room ${currentImageIndex + 1}`}
                className="w-full h-[70vh] object-cover rounded-xl"
              />

              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <div className="flex justify-center mt-4 gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group relative"
      >
        {/* Image Section */}
        <div className="relative h-64 overflow-hidden">
          <motion.img
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            src={images[currentImageIndex]}
            alt={room.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Top Actions */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            <div className="flex gap-2">
              {highlights.map((highlight, index) => (
                <motion.div
                  key={highlight.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1"
                >
                  <highlight.icon className={`w-3 h-3 ${highlight.color}`} />
                  <span className="text-xs font-medium text-gray-800">
                    {highlight.label}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsLiked(!isLiked)}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleShare}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
              >
                <Share2 className="w-5 h-5 text-white" />
              </motion.button>
            </div>
          </div>

          {/* Image Navigation */}
          <AnimatePresence>
            {isHovered && images.length > 1 && (
              <>
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </>
            )}
          </AnimatePresence>

          {/* Bottom Actions */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-white text-sm font-semibold">{room.rating}</span>
              </div>

              <button
                onClick={() => setShowFullGallery(true)}
                className="bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm flex items-center gap-1 hover:bg-black/70 transition-colors"
              >
                <Camera className="w-4 h-4" />
                {images.length} Photos
              </button>
            </div>

            <button className="bg-purple-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm flex items-center gap-1 hover:bg-purple-600/90 transition-colors">
              <Play className="w-4 h-4" />
              Virtual Tour
            </button>
          </div>

          {/* Image Indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-1 line-clamp-1">
                {room.title}
              </h3>
              <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-2">
                <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="line-clamp-1">{room.location}</span>
              </div>
            </div>

            <div className="text-right ml-4">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                ₹{room.rent?.toLocaleString() || '12,000'}
              </div>
              <div className="text-sm text-gray-500">per month</div>
            </div>
          </div>

          {/* Quick Info Toggle */}
          <motion.div
            initial={false}
            animate={{ height: showQuickInfo ? 'auto' : '0' }}
            className="overflow-hidden"
          >
            <div className="pb-4">
              {/* Amenities */}
              <div className="grid grid-cols-5 gap-2 mb-4">
                {amenities.slice(0, 5).map((amenity) => {
                  const IconComponent = amenity.icon;
                  return (
                    <div
                      key={amenity.id}
                      className={`p-2 rounded-lg text-center ${amenity.available
                          ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                          : 'bg-gray-50 dark:bg-gray-800 text-gray-400'
                        }`}
                    >
                      <IconComponent className="w-4 h-4 mx-auto mb-1" />
                      <div className="text-xs font-medium">{amenity.label}</div>
                    </div>
                  );
                })}
              </div>

              {/* Owner Info */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {room.ownerName?.charAt(0) || 'R'}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {room.ownerName || 'Rajesh Kumar'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Verified Owner • Responds in ~2 hours
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                    <Phone className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowQuickInfo(!showQuickInfo)}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Eye className="w-4 h-4" />
              Quick Info
              {showQuickInfo ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={onViewDetails}
              className="flex-1 btn-ghost flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>

            <button
              onClick={onBooking}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Book Now
            </button>
          </div>
        </div>

        {/* Hover Effects */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-purple-500/5 to-transparent" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <ImageGallery />
    </>
  );
};

export default InteractivePropertyCard;
