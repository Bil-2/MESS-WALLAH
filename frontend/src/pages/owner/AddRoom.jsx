import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, MapPin, DollarSign, Upload, CheckCircle, X, Camera, AlertCircle, Image } from 'lucide-react';
import toast from 'react-hot-toast';
import ScrollReveal from '../../components/ScrollReveal';

const AddRoom = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Info
    title: '',
    description: '',
    roomType: 'single',
    genderPreference: 'any',

    // Location
    street: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',

    // Pricing
    rentPerMonth: '',
    securityDeposit: '',
    maintenanceCharges: '',

    // Amenities
    amenities: [],

    // Photos
    photos: [],

    // Rules
    smokingAllowed: false,
    petsAllowed: false,
    guestsAllowed: true,

    // Availability
    availableFrom: '',
    isAvailable: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxPhotos = 15; // Maximum 15 photos
    
    if (formData.photos.length + files.length > maxPhotos) {
      toast.error(`Maximum ${maxPhotos} photos allowed`);
      return;
    }

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB max
      
      if (!isImage) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      if (!isValidSize) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    // Convert to base64 for preview
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          photos: [...prev.photos, {
            file,
            preview: reader.result,
            name: file.name,
            type: 'uploaded'
          }]
        }));
      };
      reader.readAsDataURL(file);
    });

    // Show success message
    if (validFiles.length > 0) {
      toast.success(`${validFiles.length} photo(s) added successfully!`);
    }
  };

  const handleCameraCapture = (e) => {
    const files = Array.from(e.target.files);
    const maxPhotos = 15;
    
    if (formData.photos.length + files.length > maxPhotos) {
      toast.error(`Maximum ${maxPhotos} photos allowed`);
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          photos: [...prev.photos, {
            file,
            preview: reader.result,
            name: `Camera_${Date.now()}.jpg`,
            type: 'camera'
          }]
        }));
      };
      reader.readAsDataURL(file);
    });

    // Show success message
    if (files.length > 0) {
      toast.success(`📸 Live photo captured successfully!`);
    }
  };

  const handleRemovePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
    toast.success('Photo removed');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate minimum photos
    if (formData.photos.length < 8) {
      toast.error('Please upload at least 8 photos to reduce scams and build trust');
      setStep(4); // Go to photos step
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to list a room');
        navigate('/login');
        return;
      }

      // Create FormData for multipart upload
      const formDataToSend = new FormData();

      // Add basic info
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('roomType', formData.roomType);
      formDataToSend.append('genderPreference', formData.genderPreference);

      // Add location as nested object
      formDataToSend.append('address[street]', formData.street);
      formDataToSend.append('address[area]', formData.area);
      formDataToSend.append('address[city]', formData.city);
      formDataToSend.append('address[state]', formData.state);
      formDataToSend.append('address[pincode]', formData.pincode);
      if (formData.landmark) {
        formDataToSend.append('address[landmark]', formData.landmark);
      }

      // Add pricing
      formDataToSend.append('rentPerMonth', formData.rentPerMonth);
      formDataToSend.append('securityDeposit', formData.securityDeposit);
      if (formData.maintenanceCharges) {
        formDataToSend.append('maintenanceCharges', formData.maintenanceCharges);
      }

      // Add amenities
      formData.amenities.forEach(amenity => {
        formDataToSend.append('amenities[]', amenity);
      });

      // Add rules
      formDataToSend.append('smokingAllowed', formData.smokingAllowed);
      formDataToSend.append('petsAllowed', formData.petsAllowed);
      formDataToSend.append('guestsAllowed', formData.guestsAllowed);

      // Add availability
      if (formData.availableFrom) {
        formDataToSend.append('availableFrom', formData.availableFrom);
      }
      formDataToSend.append('isAvailable', formData.isAvailable);

      // Add photos with type information
      formData.photos.forEach((photo, index) => {
        formDataToSend.append('photos', photo.file);
        formDataToSend.append('photoTypes[]', photo.type || 'uploaded');
      });

      // Send to API
      const response = await fetch('http://localhost:5001/api/rooms', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Room listed successfully!');
        navigate('/owner-dashboard');
      } else {
        toast.error(data.message || 'Failed to list room');
      }
    } catch (error) {
      console.error('Error listing room:', error);
      toast.error('Failed to list room. Please try again.');
    }
  };

  const availableAmenities = [
    'WiFi', 'AC', 'Attached Bathroom', 'Balcony', 'Parking',
    'Kitchen Access', 'Mess/Food', 'Laundry', 'Security',
    'Furnished', 'Power Backup', 'Water Supply', 'Cleaning Service'
  ];

  const roomTypes = [
    { value: 'single', label: 'Single Room' },
    { value: 'shared', label: 'Shared Room' },
    { value: 'pg', label: 'PG' },
    { value: 'studio', label: 'Studio Apartment' }
  ];

  const genderOptions = [
    { value: 'any', label: 'Any' },
    { value: 'boys', label: 'Boys Only' },
    { value: 'girls', label: 'Girls Only' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/owner-dashboard')}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Add New Room
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            List your property and start receiving bookings
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= s
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                  }`}>
                  {s}
                </div>
                {s < 4 && (
                  <div className={`flex-1 h-1 mx-2 ${step > s ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Basic Info</span>
            <span>Location</span>
            <span>Pricing</span>
            <span>Details</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Basic Information</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Room Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Cozy Single Room near College"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Describe your room, nearby facilities, and what makes it special..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Room Type *
                  </label>
                  <select
                    name="roomType"
                    value={formData.roomType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    {roomTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Gender Preference *
                  </label>
                  <select
                    name="genderPreference"
                    value={formData.genderPreference}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    {genderOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
              >
                Next: Location Details
              </button>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Location Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Building name, street"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Area/Locality *
                  </label>
                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Koramangala"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Bangalore"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Karnataka"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{6}"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="6-digit pincode"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nearby Landmark
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Near Metro Station, College Gate"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
                >
                  Next: Pricing
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Pricing */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Pricing Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Monthly Rent (₹) *
                  </label>
                  <input
                    type="number"
                    name="rentPerMonth"
                    value={formData.rentPerMonth}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="8000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Security Deposit (₹) *
                  </label>
                  <input
                    type="number"
                    name="securityDeposit"
                    value={formData.securityDeposit}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="5000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Maintenance (₹/month)
                  </label>
                  <input
                    type="number"
                    name="maintenanceCharges"
                    value={formData.maintenanceCharges}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="500"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 py-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
                >
                  Next: Amenities & Details
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Amenities & Final */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Amenities & Details</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Select Amenities
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableAmenities.map(amenity => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => handleAmenityToggle(amenity)}
                      className={`px-4 py-3 rounded-xl border-2 transition-all ${formData.amenities.includes(amenity)
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                        }`}
                    >
                      {formData.amenities.includes(amenity) && (
                        <CheckCircle className="w-4 h-4 inline mr-2" />
                      )}
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <label className="flex items-center space-x-3 p-4 border border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <input
                    type="checkbox"
                    name="smokingAllowed"
                    checked={formData.smokingAllowed}
                    onChange={handleChange}
                    className="w-5 h-5 text-blue-600"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Smoking Allowed</span>
                </label>

                <label className="flex items-center space-x-3 p-4 border border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <input
                    type="checkbox"
                    name="petsAllowed"
                    checked={formData.petsAllowed}
                    onChange={handleChange}
                    className="w-5 h-5 text-blue-600"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Pets Allowed</span>
                </label>

                <label className="flex items-center space-x-3 p-4 border border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <input
                    type="checkbox"
                    name="guestsAllowed"
                    checked={formData.guestsAllowed}
                    onChange={handleChange}
                    className="w-5 h-5 text-blue-600"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Guests Allowed</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Available From
                </label>
                <input
                  type="date"
                  name="availableFrom"
                  value={formData.availableFrom}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Photo Upload Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Property Photos * (Minimum 8 required)
                  </label>
                  <span className={`text-sm font-semibold ${formData.photos.length >= 8 ? 'text-green-600' : 'text-orange-600'}`}>
                    {formData.photos.length} / 8 minimum
                  </span>
                </div>

                {/* Upload Options - Gallery and Camera */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Gallery Upload */}
                  <div className="relative">
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="photo-upload"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors bg-gray-50 dark:bg-gray-700/50 group"
                    >
                      <Image className="w-10 h-10 text-gray-400 group-hover:text-blue-500 mb-2 transition-colors" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        📁 Upload from Gallery
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center px-2">
                        Select multiple photos
                      </span>
                    </label>
                  </div>

                  {/* Camera Capture */}
                  <div className="relative">
                    <input
                      ref={cameraInputRef}
                      type="file"
                      id="camera-capture"
                      accept="image/*"
                      capture="environment"
                      onChange={handleCameraCapture}
                      className="hidden"
                    />
                    <label
                      htmlFor="camera-capture"
                      className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-orange-300 dark:border-orange-600 rounded-xl cursor-pointer hover:border-orange-500 dark:hover:border-orange-400 transition-colors bg-orange-50 dark:bg-orange-900/20 group"
                    >
                      <Camera className="w-10 h-10 text-orange-500 group-hover:text-orange-600 mb-2 transition-colors" />
                      <span className="text-sm font-medium text-orange-700 dark:text-orange-300 group-hover:text-orange-800 dark:group-hover:text-orange-200">
                        📸 Take Live Photo
                      </span>
                      <span className="text-xs text-orange-600 dark:text-orange-400 mt-1 text-center px-2">
                        Use your camera (Recommended)
                      </span>
                    </label>
                  </div>
                </div>

                {/* Info about photo types */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3">
                  <p className="text-xs text-green-800 dark:text-green-300 flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    <span><strong>Pro Tip:</strong> Live photos from your camera build more trust! Mix gallery photos with live captures.</span>
                  </p>
                </div>

                {/* Warning if less than 8 photos */}
                {formData.photos.length < 8 && (
                  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-orange-800 dark:text-orange-300 mb-1">
                          Why 8 photos minimum?
                        </p>
                        <ul className="text-xs text-orange-700 dark:text-orange-400 space-y-1">
                          <li>• Reduces scams and fake listings</li>
                          <li>• Builds trust with potential tenants</li>
                          <li>• Shows all aspects of your property</li>
                          <li>• Increases booking chances by 3x</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Photo Grid */}
                {formData.photos.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {formData.photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={photo.preview}
                          alt={`Room ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-600"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(index)}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                          {photo.type === 'camera' ? (
                            <>
                              <Camera className="w-3 h-3" />
                              <span>Live #{index + 1}</span>
                            </>
                          ) : (
                            <>
                              <Image className="w-3 h-3" />
                              <span>#{index + 1}</span>
                            </>
                          )}
                        </div>
                        {photo.type === 'camera' && (
                          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            <span>Live</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Photo Tips */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                  <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">
                    📸 Photo Tips for Better Bookings:
                  </p>
                  <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                    <li>• <strong>Use "Take Live Photo"</strong> - Builds 3x more trust!</li>
                    <li>• Take photos in good lighting (daytime preferred)</li>
                    <li>• Show room from different angles (4-5 angles minimum)</li>
                    <li>• Include bathroom, kitchen, and common areas</li>
                    <li>• Capture nearby facilities and landmarks</li>
                    <li>• Mix live camera photos with gallery uploads</li>
                    <li>• Avoid filters - show real property condition</li>
                    <li>• <strong>Mobile camera works on all devices!</strong></li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 py-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={formData.photos.length < 8}
                  className={`flex-1 py-4 rounded-xl font-semibold transition-colors ${
                    formData.photos.length >= 8
                      ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {formData.photos.length >= 8 ? 'List Room' : `Upload ${8 - formData.photos.length} more photos`}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddRoom;
