import React from 'react';
import { CheckCircle, Users, TrendingUp, Shield, Clock, Star, ArrowRight } from 'lucide-react';

const OwnerGuide = () => {
  const benefits = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Reach More Students",
      description: "Connect with thousands of students actively looking for mess accommodation in your area."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Increase Revenue",
      description: "Maximize your occupancy rates and rental income with our proven marketing strategies."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Transactions",
      description: "All payments are processed securely through our platform with guaranteed payment protection."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Save Time",
      description: "Automated booking management, tenant screening, and communication tools save you hours."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Create Your Listing",
      description: "Add detailed information about your property, including photos, amenities, and pricing.",
      tips: ["Use high-quality photos", "Write detailed descriptions", "Set competitive pricing"]
    },
    {
      number: "02",
      title: "Get Verified",
      description: "Our team will verify your property and contact details to build trust with potential tenants.",
      tips: ["Provide accurate information", "Respond to verification calls", "Complete documentation"]
    },
    {
      number: "03",
      title: "Receive Bookings",
      description: "Start receiving booking requests from verified students and manage them through our dashboard.",
      tips: ["Respond quickly to inquiries", "Keep availability updated", "Maintain good ratings"]
    },
    {
      number: "04",
      title: "Manage Tenants",
      description: "Use our tools to manage tenant relationships, payments, and property maintenance.",
      tips: ["Regular communication", "Timely maintenance", "Fair policies"]
    }
  ];

  const features = [
    "Professional photography assistance",
    "24/7 customer support",
    "Automated rent collection",
    "Tenant screening services",
    "Digital lease agreements",
    "Maintenance request management",
    "Performance analytics",
    "Marketing optimization"
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      location: "Bangalore",
      rating: 5,
      text: "MESS WALLAH has transformed my rental business. I've increased my occupancy rate by 40% and the automated systems save me so much time.",
      properties: 3
    },
    {
      name: "Priya Sharma",
      location: "Delhi",
      rating: 5,
      text: "The platform is incredibly easy to use and the support team is always helpful. My properties are always fully booked now.",
      properties: 2
    },
    {
      name: "Mohammed Ali",
      location: "Hyderabad",
      rating: 5,
      text: "Best decision I made for my rental business. The secure payment system and tenant verification gives me peace of mind.",
      properties: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Grow Your Rental Business
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto">
              Join thousands of property owners who have increased their rental income by up to 40% with MESS WALLAH
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
                List Your Property Free
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-green-600 transition-colors">
                Watch Demo Video
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose MESS WALLAH?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We provide everything you need to successfully manage and grow your rental property business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-200">
                <div className="text-green-600 dark:text-green-400 mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
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

      {/* How It Works Section */}
      <div className="bg-white dark:bg-gray-800 py-20 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Get started in just 4 simple steps
            </p>
          </div>

          <div className="space-y-16">
            {steps.map((step, index) => (
              <div key={index} className={`flex flex-col lg:flex-row items-center gap-8 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}>
                <div className="flex-1">
                  <div className="flex items-center mb-4">
                    <span className="text-4xl font-bold text-green-600 dark:text-green-400 mr-4">
                      {step.number}
                    </span>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                    {step.description}
                  </p>
                  <div className="space-y-2">
                    {step.tips.map((tip, tipIndex) => (
                      <div key={tipIndex} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-400">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-1 lg:max-w-md">
                  <div className="bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 rounded-lg p-8 h-64 flex items-center justify-center">
                    <div className="text-6xl text-green-600 dark:text-green-400 font-bold">
                      {step.number}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features for Property Owners
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Everything you need to manage your properties efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-colors duration-200">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-900 dark:text-white font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white dark:bg-gray-800 py-20 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Property Owners Say
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Real stories from successful property owners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 transition-colors duration-200">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.location} • {testimonial.properties} properties
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Maximize Your Rental Income?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Join over 10,000+ property owners who trust MESS WALLAH to grow their rental business
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center">
              Start Listing Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-green-600 transition-colors">
              Schedule a Demo
            </button>
          </div>
          <p className="text-sm opacity-75 mt-4">
            No setup fees • Free listing • 24/7 support
          </p>
        </div>
      </div>
    </div>
  );
};

export default OwnerGuide;
