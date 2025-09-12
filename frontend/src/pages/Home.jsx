import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Users, Star, ArrowRight } from 'lucide-react';
import RoomCard from '../components/RoomCard';
import api, { roomsAPI } from '../utils/api';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalRooms: 0,
    totalUsers: 0,
    totalBookings: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedRooms();
    fetchStats();
  }, []);

  const fetchFeaturedRooms = async () => {
    try {
      setLoading(true);
      const response = await api.get('/rooms?limit=6&featured=true');
      setFeaturedRooms(response.data.rooms || []);
    } catch (error) {
      console.error('Error fetching featured rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/rooms/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const searchParams = new URLSearchParams();
    if (searchQuery.trim()) {
      searchParams.set('q', searchQuery.trim());
    }
    if (location.trim()) {
      searchParams.set('location', location.trim());
    }
    navigate(`/search?${searchParams.toString()}`);
  };

  const popularLocations = [
    'Delhi', 'Mumbai', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect
              <span className="block text-primary-200">Mess & Room</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Discover comfortable accommodations with delicious homemade food.
              Perfect for students and working professionals.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search for rooms, mess, PG..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Location (City, Area)"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Search className="w-5 h-5" />
                  <span>Search</span>
                </button>
              </div>
            </form>

            {/* Popular Locations */}
            <div className="mt-8">
              <p className="text-primary-200 mb-4">Popular locations:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {popularLocations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      setLocation(loc);
                      const searchParams = new URLSearchParams();
                      searchParams.set('location', loc);
                      navigate(`/search?${searchParams.toString()}`);
                    }}
                    className="px-4 py-2 bg-primary-500 bg-opacity-20 hover:bg-opacity-30 rounded-full text-sm transition-colors"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                {stats.totalRooms.toLocaleString()}+
              </div>
              <p className="text-gray-600">Verified Rooms</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                {stats.totalUsers.toLocaleString()}+
              </div>
              <p className="text-gray-600">Happy Customers</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                {stats.totalBookings.toLocaleString()}+
              </div>
              <p className="text-gray-600">Successful Bookings</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Mess Wallah?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We make finding your perfect accommodation simple, safe, and affordable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Verified Owners
              </h3>
              <p className="text-gray-600">
                All our property owners are verified with proper documentation for your safety.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Quality Assured
              </h3>
              <p className="text-gray-600">
                Every property is inspected and rated by our team to ensure quality standards.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Prime Locations
              </h3>
              <p className="text-gray-600">
                Find accommodations in prime locations with easy access to colleges and offices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Rooms Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Featured Rooms
              </h2>
              <p className="text-gray-600">
                Handpicked accommodations that offer the best value and comfort.
              </p>
            </div>
            <button
              onClick={() => navigate('/search')}
              className="hidden md:flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-gray-200 rounded-lg h-80 animate-pulse"></div>
              ))}
            </div>
          ) : featuredRooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredRooms.map((room) => (
                <RoomCard key={room._id} room={room} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Featured Rooms Available
              </h3>
              <p className="text-gray-600 mb-4">
                Check back later for featured accommodations.
              </p>
              <button
                onClick={() => navigate('/search')}
                className="btn-primary"
              >
                Browse All Rooms
              </button>
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <button
              onClick={() => navigate('/search')}
              className="btn-primary"
            >
              View All Rooms
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Find Your Perfect Room?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students and professionals who found their ideal accommodation with us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/search')}
              className="bg-white text-primary-600 hover:bg-gray-50 px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Start Searching
            </button>
            <button
              onClick={() => navigate('/login')}
              className="bg-primary-500 hover:bg-primary-400 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              List Your Property
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
