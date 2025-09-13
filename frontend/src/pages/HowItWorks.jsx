import React from 'react';
import { Search, MapPin, Calendar, CreditCard, CheckCircle, Users } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <Search className="w-8 h-8" />,
      title: "Search & Browse",
      description: "Browse through hundreds of verified mess accommodations in your preferred location with detailed photos and amenities.",
      details: ["Filter by location, price, and amenities", "View detailed photos and descriptions", "Read reviews from previous tenants"]
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Visit & Inspect",
      description: "Schedule a visit to inspect the property, meet the owner, and get a feel for the neighborhood and facilities.",
      details: ["Schedule convenient visit times", "Meet property owners personally", "Inspect rooms and common areas"]
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Book Your Stay",
      description: "Select your preferred dates, duration, and complete the booking process with our secure payment system.",
      details: ["Choose flexible booking duration", "Secure online booking process", "Instant booking confirmation"]
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Secure Payment",
      description: "Make secure payments through our platform with multiple payment options and get instant confirmation.",
      details: ["Multiple payment methods", "Secure transaction processing", "Digital receipts and invoices"]
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Move In",
      description: "Complete the documentation, get your keys, and start enjoying your new mess accommodation.",
      details: ["Quick documentation process", "Key handover ceremony", "24/7 customer support"]
    }
  ];

  const benefits = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Verified Properties",
      description: "All properties are verified and inspected by our team"
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Secure Payments",
      description: "100% secure payment processing with multiple options"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Prime Locations",
      description: "Properties in prime locations near colleges and offices"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            How MESS WALLAH Works
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
            Find and book your perfect mess accommodation in just 5 simple steps
          </p>
        </div>
      </div>

      {/* Steps Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Simple Process, Great Results
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Our streamlined process makes finding and booking mess accommodation easy and secure
          </p>
        </div>

        <div className="space-y-16">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col lg:flex-row items-center gap-8">
              {/* Step Number and Icon */}
              <div className="flex-shrink-0 text-center lg:text-left">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full mb-4">
                  <span className="text-2xl font-bold">{index + 1}</span>
                </div>
                <div className="text-blue-600 dark:text-blue-400">
                  {step.icon}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                  {step.description}
                </p>
                <ul className="space-y-2">
                  {step.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center text-gray-600 dark:text-gray-400">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visual Element */}
              <div className="flex-shrink-0 lg:w-1/3">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-colors duration-200">
                  <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg flex items-center justify-center">
                    <div className="text-blue-600 dark:text-blue-400">
                      {step.icon}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white dark:bg-gray-800 py-16 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose MESS WALLAH?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              We make mess accommodation booking safe, simple, and reliable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Find Your Perfect Mess?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Join thousands of students who have found their ideal accommodation through MESS WALLAH
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Browse Rooms
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              List Your Property
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
