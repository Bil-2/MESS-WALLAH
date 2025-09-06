import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    phone: '',
    college: '',
    course: '',
    year: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setLoading(true);
    const result = await register(formData);
    if (result.success) {
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100 transition-colors duration-200">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200"
            >
              sign in to existing account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'student' })}
                  className={`p-3 border rounded-lg text-center transition-colors duration-200 ${formData.role === 'student'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                    }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'owner' })}
                  className={`p-3 border rounded-lg text-center transition-colors duration-200 ${formData.role === 'owner'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                    }`}
                >
                  Property Owner
                </button>
              </div>
            </div>

            {/* Basic Info */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
                Full Name
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="input-field pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-colors duration-200"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="input-field pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-colors duration-200"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
                Phone Number
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="h-5 w-5 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="input-field pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-colors duration-200"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Student-specific fields */}
            {formData.role === 'student' && (
              <>
                <div>
                  <label htmlFor="college" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
                    College/University
                  </label>
                  <input
                    id="college"
                    name="college"
                    type="text"
                    required
                    className="input-field bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-colors duration-200"
                    placeholder="Enter your college name"
                    value={formData.college}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="course" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
                      Course
                    </label>
                    <input
                      id="course"
                      name="course"
                      type="text"
                      required
                      className="input-field bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-colors duration-200"
                      placeholder="e.g. Computer Science"
                      value={formData.course}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
                      Year
                    </label>
                    <select
                      id="year"
                      name="year"
                      required
                      className="input-field bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-colors duration-200"
                      value={formData.year}
                      onChange={handleChange}
                    >
                      <option value="" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">Select Year</option>
                      <option value="1" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">1st Year</option>
                      <option value="2" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">2nd Year</option>
                      <option value="3" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">3rd Year</option>
                      <option value="4" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">4th Year</option>
                      <option value="5" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">5th Year</option>
                      <option value="6" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">6th Year</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="input-field pl-10 pr-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-colors duration-200"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="input-field pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-colors duration-200"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-primary-400 dark:focus:ring-offset-gray-800 disabled:opacity-50 transition-colors duration-200"
            >
              {loading ? (
                <div className="spinner border-white dark:border-gray-200"></div>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
