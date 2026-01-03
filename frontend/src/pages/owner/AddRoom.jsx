import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Camera, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

const AddRoom = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    rent: '',
    deposit: '',
    roomType: 'single',
    city: '',
    area: '',
    pincode: '',
    photos: []
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (formData.photos.length + files.length > 10) {
      toast.error('Maximum 10 photos allowed');
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          photos: [...prev.photos, { file, preview: reader.result }]
        }));
      };
      reader.readAsDataURL(file);
    });
    toast.success('Photos added successfully!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.photos.length < 5) {
      toast.error('Minimum 5 photos required');
      return;
    }

    toast.success('Room listed successfully!');
    navigate('/owner-dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <button
          onClick={() => navigate('/owner-dashboard')}
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-6 text-xl"
        >
          <ArrowLeft className="w-6 h-6" />
          <span>Back to Dashboard</span>
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <Home className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Add New Room
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              List your property and start receiving bookings
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Room Title */}
            <div>
              <label className="block text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Room Name *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 text-xl border-2 border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Clean Single Room near Metro"
              />
            </div>

            {/* Room Type */}
            <div>
              <label className="block text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Room Type *
              </label>
              <select
                name="roomType"
                value={formData.roomType}
                onChange={handleChange}
                className="w-full px-6 py-4 text-xl border-2 border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="single">Single Room</option>
                <option value="shared">Shared Room</option>
                <option value="studio">Studio Apartment</option>
                <option value="apartment">Full Apartment</option>
              </select>
            </div>

            {/* Rent and Deposit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Monthly Rent *
                </label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-600">₹</span>
                  <input
                    type="number"
                    name="rent"
                    value={formData.rent}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-6 py-4 text-xl border-2 border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="8000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Security Deposit *
                </label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-600">₹</span>
                  <input
                    type="number"
                    name="deposit"
                    value={formData.deposit}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-6 py-4 text-xl border-2 border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="5000"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 text-xl border-2 border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Bangalore, Mumbai, Delhi..."
                />
              </div>

              <div>
                <label className="block text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Pincode *
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                  maxLength="6"
                  pattern="[0-9]{6}"
                  className="w-full px-6 py-4 text-xl border-2 border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="560001"
                />
              </div>
            </div>

            <div>
              <label className="block text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Area/Locality *
              </label>
              <input
                type="text"
                name="area"
                value={formData.area}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 text-xl border-2 border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Koramangala, Andheri, Connaught Place..."
              />
            </div>

            {/* Photos */}
            <div>
              <label className="block text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Property Photos * (Minimum 5)
              </label>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                {formData.photos.length} photos added {formData.photos.length >= 5 && '(Ready)'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Camera Button */}
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center justify-center h-40 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl shadow-lg hover:shadow-xl transition-all text-white p-6">
                    <Camera className="w-12 h-12 mb-2" />
                    <span className="text-xl font-bold">Take Photo</span>
                    <span className="text-base mt-1">Use Camera</span>
                  </div>
                </label>

                {/* Gallery Button */}
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center justify-center h-40 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl shadow-lg hover:shadow-xl transition-all text-white p-6">
                    <Upload className="w-12 h-12 mb-2" />
                    <span className="text-xl font-bold">Upload Photos</span>
                    <span className="text-base mt-1">From Gallery</span>
                  </div>
                </label>
              </div>

              {/* Photo Grid */}
              {formData.photos.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {formData.photos.map((photo, i) => (
                    <div key={i} className="relative">
                      <img
                        src={photo.preview}
                        alt={`Photo ${i + 1}`}
                        className="w-full h-24 object-cover rounded-xl border-2 border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            photos: prev.photos.filter((_, idx) => idx !== i)
                          }));
                        }}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full font-bold hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-3xl text-2xl md:text-3xl font-bold shadow-2xl hover:shadow-3xl transition-all"
            >
              List My Room
            </button>

            <p className="text-center text-gray-600 dark:text-gray-400 text-lg">
              All fields marked with * are required
            </p>
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-3xl p-6 text-center">
          <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Need Help?
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Call: <a href="tel:+919876543210" className="text-blue-600 font-bold">+91 98765 43210</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddRoom;
