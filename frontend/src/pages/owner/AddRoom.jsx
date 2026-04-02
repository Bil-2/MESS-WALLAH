import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Camera, Upload, User, Phone, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { useAuthContext } from '../../context/AuthContext';

const AddRoom = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const [formData, setFormData] = useState({
    title: '',
    rent: '',
    deposit: '',
    roomType: 'single',
    city: '',
    area: '',
    pincode: '',
    ownerName: user?.name || '',
    ownerPhone: user?.phone || '',
    ownerEmail: user?.email || '',
    livePhotos: [],
    galleryPhotos: [],
    aadharDocument: null
  });

  const totalPhotos = formData.livePhotos.length + formData.galleryPhotos.length;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e, isLive) => {
    const files = Array.from(e.target.files);

    if (totalPhotos + files.length > 10) {
      toast.error('Maximum 10 photos allowed in total');
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          ...(isLive
            ? { livePhotos: [...prev.livePhotos, { file, preview: reader.result }] }
            : { galleryPhotos: [...prev.galleryPhotos, { file, preview: reader.result }] })
        }));
      };
      reader.readAsDataURL(file);
    });

    toast.success(`${isLive ? 'Live' : 'Gallery'} photos added successfully!`);
  };

  const handleAadharUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, aadharDocument: file }));
      toast.success('Aadhar document uploaded securely.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.livePhotos.length < 5) {
      toast.error('Minimum 5 Live photos are required for security verification.');
      return;
    }

    if (!formData.aadharDocument) {
      toast.error('Aadhar Card is strictly required for owner verification.');
      return;
    }

    // Prepare FormData
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('rentPerMonth', formData.rent); // Note backend expects rentPerMonth
    submitData.append('securityDeposit', formData.deposit); // backend expects securityDeposit
    submitData.append('roomType', formData.roomType);

    // Append nested address fields
    submitData.append('address.city', formData.city);
    submitData.append('address.area', formData.area);
    submitData.append('address.pincode', formData.pincode);
    submitData.append('address.street', formData.area); // fallback since street input isn't here
    submitData.append('address.state', 'Unknown'); // fallback since state input isn't here

    submitData.append('description', formData.title); // fallback

    // Append Owner Specific Contact Details
    if (formData.ownerName) submitData.append('ownerName', formData.ownerName);
    if (formData.ownerPhone) submitData.append('ownerPhone', formData.ownerPhone);
    if (formData.ownerEmail) submitData.append('ownerEmail', formData.ownerEmail);

    // Append Aadhar
    submitData.append('aadharDocument', formData.aadharDocument);

    // Append Live Photos Count
    submitData.append('livePhotosCount', formData.livePhotos.length);

    // Append all photos
    formData.livePhotos.forEach(p => submitData.append('photos', p.file));
    formData.galleryPhotos.forEach(p => submitData.append('photos', p.file));

    try {
      toast.loading('Uploading room data and verifying security documents...', { id: 'submit' });
      await api.post('/rooms', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Room listed successfully with maximum security verification!', { id: 'submit' });
      navigate('/owner-dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to list room', { id: 'submit' });
    }
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

            {/* Aadhar Upload */}
            <div>
              <label className="block text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                Aadhar Card <span className="text-sm font-medium text-emerald-600 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/50 px-2 py-1 rounded-md">Security Required</span>
              </label>
              <p className="text-sm text-gray-500 mb-3">Please upload a clear image of your Aadhar Card for owner verification.</p>

              <label htmlFor="aadharUpload" className="flex flex-col items-center justify-center w-full min-h-[8rem] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative overflow-hidden p-4">
                <input type="file" id="aadharUpload" name="aadharUpload" accept="image/*,application/pdf" className="hidden" onChange={handleAadharUpload} required />
                <div className="flex flex-col items-center justify-center text-gray-500 w-full text-center">
                  <Upload className="w-8 h-8 mb-2" />
                  <p className="text-sm font-semibold break-words max-w-full">
                    {formData.aadharDocument ? formData.aadharDocument.name : 'Click to Upload Aadhar Card'}
                  </p>
                </div>
                {formData.aadharDocument && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                )}
              </label>
            </div>

            {/* Photos */}
            <div>
              <label className="block text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Property Photos *
              </label>
              <p className="text-lg text-rose-600 dark:text-rose-400 font-medium mb-4">
                Anti-Scam Protocol: You must capture at least 5 LIVE photos using your camera before unlocking the Gallery Upload feature.
              </p>

              <div className="flex gap-4 mb-4 text-sm font-medium flex-wrap">
                <span className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 px-3 py-1 rounded-full">Live: {formData.livePhotos.length}/5</span>
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 px-3 py-1 rounded-full">Gallery: {formData.galleryPhotos.length}</span>
                <span className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700">Total: {totalPhotos}/10</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Camera Button */}
                <label htmlFor="cameraUpload" className="cursor-pointer">
                  <input
                    type="file"
                    id="cameraUpload"
                    name="cameraUpload"
                    accept="image/*"
                    capture="environment"
                    onChange={(e) => handlePhotoUpload(e, true)}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center justify-center h-40 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl shadow-lg hover:shadow-xl transition-all text-white p-6">
                    <Camera className="w-12 h-12 mb-2" />
                    <span className="text-xl font-bold">Take Live Photo</span>
                    <span className="text-base mt-1">Use Camera</span>
                  </div>
                </label>

                {/* Gallery Button */}
                <label htmlFor="galleryUpload" className={formData.livePhotos.length < 5 ? "cursor-not-allowed opacity-50 relative" : "cursor-pointer"}>
                  <input
                    type="file"
                    id="galleryUpload"
                    name="galleryUpload"
                    accept="image/*"
                    multiple
                    disabled={formData.livePhotos.length < 5}
                    onChange={(e) => handlePhotoUpload(e, false)}
                    className="hidden"
                  />
                  <div className={`flex flex-col items-center justify-center h-40 bg-gradient-to-br transition-all rounded-3xl p-6 ${formData.livePhotos.length < 5 ? 'bg-gray-600 text-gray-300' : 'from-blue-500 to-cyan-600 text-white shadow-lg hover:shadow-xl'}`}>
                    {formData.livePhotos.length < 5 ? (
                      <div className="flex items-center justify-center flex-col text-center w-full h-full">
                        <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span className="text-sm font-bold text-gray-300">Locked</span>
                        <span className="text-xs mt-1 text-gray-400">Take {5 - formData.livePhotos.length} more Live Photos</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 mb-2" />
                        <span className="text-lg md:text-xl font-bold text-center">Upload Photos</span>
                        <span className="text-sm md:text-base mt-1">From Gallery</span>
                      </>
                    )}
                  </div>
                </label>
              </div>

              {/* Photo Grid */}
              {totalPhotos > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {/* Render Live Photos */}
                  {formData.livePhotos.map((photo, i) => (
                    <div key={`live-${i}`} className="relative border-4 border-green-400 rounded-xl overflow-hidden">
                      <div className="absolute top-0 left-0 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-br-lg z-10 font-bold">LIVE</div>
                      <img src={photo.preview} alt={`Live ${i + 1}`} className="w-full h-24 object-cover" />
                      <button type="button" onClick={() => setFormData(prev => ({ ...prev, livePhotos: prev.livePhotos.filter((_, idx) => idx !== i) }))} className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 z-10 text-white rounded-full font-bold hover:bg-red-600 shadow-md flex items-center justify-center text-sm leading-none">×</button>
                    </div>
                  ))}

                  {/* Render Gallery Photos */}
                  {formData.galleryPhotos.map((photo, i) => (
                    <div key={`gall-${i}`} className="relative border-2 border-gray-300 rounded-xl overflow-hidden">
                      <div className="absolute top-0 left-0 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-br-lg z-10 font-bold">GALLERY</div>
                      <img src={photo.preview} alt={`Gallery ${i + 1}`} className="w-full h-24 object-cover" />
                      <button type="button" onClick={() => setFormData(prev => ({ ...prev, galleryPhotos: prev.galleryPhotos.filter((_, idx) => idx !== i) }))} className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 z-10 text-white rounded-full font-bold hover:bg-red-600 shadow-md flex items-center justify-center text-sm leading-none">×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Owner Contact Details */}
            <div className="p-6 bg-blue-50 dark:bg-gray-800 rounded-3xl border border-blue-100 dark:border-gray-700">
              <h3 className="block text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">
                Owner Contact Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Owner Name *</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} required className="w-full pl-12 pr-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="John Doe" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Mobile Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input type="tel" name="ownerPhone" value={formData.ownerPhone} onChange={handleChange} required className="w-full pl-12 pr-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="+91 9876543210" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input type="email" name="ownerEmail" value={formData.ownerEmail} onChange={handleChange} required className="w-full pl-12 pr-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="john@example.com" />
                  </div>
                </div>
              </div>
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
