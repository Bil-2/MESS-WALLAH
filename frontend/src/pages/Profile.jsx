import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Camera, Save, Edit3, Shield, Bell } from 'lucide-react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 98765 43210',
    dateOfBirth: '1995-06-15',
    address: {
      street: '123 College Street',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001'
    },
    college: 'Indian Institute of Technology',
    course: 'Computer Science Engineering',
    year: '4th Year',
    bio: 'Final year engineering student looking for comfortable and affordable accommodation near campus.',
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true
    }
  });

  const [tempData, setTempData] = useState(profileData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setTempData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setTempData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePreferenceChange = (preference) => {
    setTempData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [preference]: !prev.preferences[preference]
      }
    }));
  };

  const handleSave = () => {
    setProfileData(tempData);
    setIsEditing(false);
    // Here you would typically make an API call to save the data
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setTempData(profileData);
    setIsEditing(false);
  };

  const profileSections = [
    {
      title: 'Personal Information',
      icon: <User className="w-5 h-5" />,
      fields: [
        { key: 'name', label: 'Full Name', type: 'text', required: true },
        { key: 'email', label: 'Email Address', type: 'email', required: true },
        { key: 'phone', label: 'Phone Number', type: 'tel', required: true },
        { key: 'dateOfBirth', label: 'Date of Birth', type: 'date' }
      ]
    },
    {
      title: 'Address',
      icon: <MapPin className="w-5 h-5" />,
      fields: [
        { key: 'address.street', label: 'Street Address', type: 'text' },
        { key: 'address.city', label: 'City', type: 'text' },
        { key: 'address.state', label: 'State', type: 'text' },
        { key: 'address.pincode', label: 'PIN Code', type: 'text' }
      ]
    },
    {
      title: 'Academic Information',
      icon: <Calendar className="w-5 h-5" />,
      fields: [
        { key: 'college', label: 'College/University', type: 'text' },
        { key: 'course', label: 'Course', type: 'text' },
        { key: 'year', label: 'Year', type: 'text' }
      ]
    }
  ];

  const getFieldValue = (key) => {
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      return tempData[parent]?.[child] || '';
    }
    return tempData[key] || '';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors duration-200">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-gray-500 dark:text-gray-400" />
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {profileData.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                {profileData.course} • {profileData.year}
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {profileData.college}
              </p>
              <div className="flex justify-center md:justify-start">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSave}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors duration-200">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">About Me</h2>
          {isEditing ? (
            <textarea
              name="bio"
              value={tempData.bio}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
              placeholder="Tell us about yourself..."
            />
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              {profileData.bio || 'No bio added yet.'}
            </p>
          )}
        </div>

        {/* Profile Sections */}
        {profileSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors duration-200">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg text-blue-600 dark:text-blue-400 mr-3">
                {section.icon}
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {section.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.fields.map((field, fieldIndex) => (
                <div key={fieldIndex}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {isEditing ? (
                    <input
                      type={field.type}
                      name={field.key}
                      value={getFieldValue(field.key)}
                      onChange={handleInputChange}
                      required={field.required}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white py-2">
                      {getFieldValue(field.key) || 'Not provided'}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Notification Preferences */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors duration-200">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg text-purple-600 dark:text-purple-400 mr-3">
              <Bell className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Notification Preferences
            </h2>
          </div>

          <div className="space-y-4">
            {Object.entries(profileData.preferences).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Receive notifications via {key.replace('Notifications', '').toLowerCase()}
                  </p>
                </div>
                <button
                  onClick={() => isEditing && handlePreferenceChange(key)}
                  disabled={!isEditing}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    } ${!isEditing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg text-red-600 dark:text-red-400 mr-3">
              <Shield className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Security Settings
            </h2>
          </div>

          <div className="space-y-4">
            <button className="w-full text-left p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <h3 className="font-medium text-gray-900 dark:text-white mb-1">Change Password</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Update your account password</p>
            </button>

            <button className="w-full text-left p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <h3 className="font-medium text-gray-900 dark:text-white mb-1">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security to your account</p>
            </button>

            <button className="w-full text-left p-4 border border-red-200 dark:border-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900 transition-colors text-red-600 dark:text-red-400">
              <h3 className="font-medium mb-1">Delete Account</h3>
              <p className="text-sm">Permanently delete your account and all data</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
