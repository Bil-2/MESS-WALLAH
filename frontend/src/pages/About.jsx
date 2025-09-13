import React from 'react';
import { Users, Target, Award, Heart, MapPin, Clock, Shield, Star } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Wide Coverage',
      description: 'Properties across 15+ Indian states with authentic local experiences'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Verified Properties',
      description: 'All accommodations are verified for safety and quality standards'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support for all your accommodation needs'
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Quality Assured',
      description: 'Curated mess accommodations with authentic reviews and ratings'
    }
  ];

  const stats = [
    { number: '54+', label: 'Properties Listed' },
    { number: '15+', label: 'States Covered' },
    { number: '1000+', label: 'Happy Students' },
    { number: '4.8', label: 'Average Rating' }
  ];

  const team = [
    {
      name: 'Rajesh Kumar',
      role: 'Founder & CEO',
      image: 'https://via.placeholder.com/150x150',
      description: 'Former student who experienced the struggle of finding good mess accommodation'
    },
    {
      name: 'Priya Sharma',
      role: 'Head of Operations',
      image: 'https://via.placeholder.com/150x150',
      description: 'Ensures quality standards and customer satisfaction across all properties'
    },
    {
      name: 'Amit Patel',
      role: 'Technology Lead',
      image: 'https://via.placeholder.com/150x150',
      description: 'Builds and maintains the platform that connects students with accommodations'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About MESS WALLAH
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Connecting students with quality mess accommodations across India
          </p>
          <div className="flex justify-center">
            <Heart className="w-12 h-12 text-red-400" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Target className="w-16 h-16 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Our Mission
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
            We believe every student deserves a comfortable, safe, and affordable place to stay while pursuing their education.
            MESS WALLAH was born from the personal experience of struggling to find quality mess accommodations during college years.
            Our mission is to eliminate this struggle by connecting students with verified, quality mess accommodations across India.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Why Choose MESS WALLAH?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-200 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg text-blue-600 dark:text-blue-400">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 md:p-12 shadow-md mb-16 transition-colors duration-200">
          <div className="flex justify-center mb-6">
            <Users className="w-16 h-16 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Our Story
          </h2>
          <div className="prose prose-lg max-w-4xl mx-auto text-gray-600 dark:text-gray-400">
            <p className="mb-6">
              MESS WALLAH started as a simple idea during our college days. Like many students, we faced the challenge of finding
              clean, affordable, and safe mess accommodations. The process was time-consuming, unreliable, and often led to
              disappointing experiences.
            </p>
            <p className="mb-6">
              We realized that thousands of students across India face the same problem every year. That's when we decided to
              create a platform that would bridge the gap between students looking for quality accommodations and property owners
              who provide them.
            </p>
            <p>
              Today, MESS WALLAH has grown into a trusted platform that serves students across 15+ Indian states, with over 54
              verified properties and thousands of satisfied customers. We continue to expand our reach while maintaining our
              commitment to quality and student satisfaction.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-200">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 md:p-12 text-white text-center">
          <div className="flex justify-center mb-6">
            <Award className="w-16 h-16" />
          </div>
          <h2 className="text-3xl font-bold mb-8">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-3">Transparency</h3>
              <p className="text-purple-100">
                We believe in honest communication and transparent pricing with no hidden fees.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Quality</h3>
              <p className="text-purple-100">
                Every property is verified and maintained to ensure the highest standards of quality.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Support</h3>
              <p className="text-purple-100">
                We're here to help 24/7, ensuring you have the support you need throughout your stay.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
