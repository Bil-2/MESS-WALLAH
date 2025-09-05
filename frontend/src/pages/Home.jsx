import React from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiShield, FiStar, FiHome, FiCoffee, FiWifi } from 'react-icons/fi';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-600 via-orange-700 to-red-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect
              <span className="text-yellow-300"> Mess Room</span>
            </h1>
            <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
              Connect with verified mess owners and discover comfortable, affordable accommodations
              with quality food for students, bachelors, and working professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/rooms"
                className="bg-white text-orange-600 hover:bg-orange-50 font-semibold py-3 px-8 rounded-lg transition duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FiSearch className="mr-2" />
                Browse Mess Rooms
              </Link>
              <Link
                to="/register"
                className="border-2 border-white text-white hover:bg-white hover:text-orange-600 font-semibold py-3 px-8 rounded-lg transition duration-300"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose MESS WALLAH?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We make finding and renting mess rooms simple, secure, and hassle-free with quality food guaranteed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 card hover-lift">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiShield className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Mess Listings</h3>
              <p className="text-gray-600">
                All mess rooms and owners are verified to ensure your safety, hygiene, and quality food standards.
              </p>
            </div>

            <div className="text-center p-6 card hover-lift">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCoffee className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Food</h3>
              <p className="text-gray-600">
                Enjoy homely, nutritious meals with various cuisine options and dietary preferences catered.
              </p>
            </div>

            <div className="text-center p-6 card hover-lift">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiStar className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Rated & Reviewed</h3>
              <p className="text-gray-600">
                Read authentic reviews from previous residents about food quality, cleanliness, and service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600">
              Get started in just a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Search & Filter</h3>
              <p className="text-gray-600">
                Browse through verified mess rooms and filter by location, price, cuisine, and meal plans.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect & Book</h3>
              <p className="text-gray-600">
                Contact mess owners directly and send booking requests with your meal preferences.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Move In & Enjoy</h3>
              <p className="text-gray-600">
                Complete the booking process and enjoy quality meals in your new home away from home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">10K+</div>
              <div className="text-orange-100">Happy Residents</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">5K+</div>
              <div className="text-orange-100">Verified Mess Rooms</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">50+</div>
              <div className="text-orange-100">Cities Covered</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">4.8</div>
              <div className="text-orange-100">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What You Get
            </h2>
            <p className="text-gray-600">
              More than just a room - a complete living experience
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FiCoffee className="h-6 w-6 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Quality Meals</h4>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FiWifi className="h-6 w-6 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Free WiFi</h4>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FiShield className="h-6 w-6 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900">24/7 Security</h4>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FiHome className="h-6 w-6 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Furnished Rooms</h4>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Find Your Perfect Mess Room?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of satisfied residents who found their ideal accommodation with quality food through our platform.
          </p>
          <Link
            to="/register"
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 inline-block shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Get Started Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
              <h3 className="text-xl font-bold mb-4 navbar-brand">MESS WALLAH</h3>
              <p className="text-gray-400 mb-4">
                Making mess room rental simple, secure, and delicious for everyone.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Students</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/rooms" className="hover:text-white">Find Mess Rooms</Link></li>
                <li><Link to="/register" className="hover:text-white">Sign Up</Link></li>
                <li><button className="hover:text-white text-left">How It Works</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Mess Owners</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/register" className="hover:text-white">List Your Mess</Link></li>
                <li><button className="hover:text-white text-left">Owner Guide</button></li>
                <li><button className="hover:text-white text-left">Pricing</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white text-left">Help Center</button></li>
                <li><button className="hover:text-white text-left">Contact Us</button></li>
                <li><button className="hover:text-white text-left">Terms of Service</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MESS WALLAH. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
