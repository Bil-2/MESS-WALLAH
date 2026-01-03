import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import ScrollReveal from '../components/ScrollReveal';
import toast from 'react-hot-toast';

const GoogleAuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuthUser } = useAuthContext();

  useEffect(() => {
    const handleGoogleAuth = () => {
      try {
        // Get token and user data from URL parameters
        const token = searchParams.get('token');
        const userDataString = searchParams.get('user');

        if (!token || !userDataString) {
          toast.error('Authentication failed. Please try again.');
          navigate('/login');
          return;
        }

        // Parse user data
        const userData = JSON.parse(decodeURIComponent(userDataString));

        // Store token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));

        // Update context state IMMEDIATELY
        if (setAuthUser) {
          setAuthUser(userData);
        }

        // Show success message
        toast.success(`Welcome back, ${userData.name}!`);

        // Redirect to profile or home
        setTimeout(() => {
          navigate('/profile');
        }, 1000);
      } catch (error) {
        console.error('Error handling Google auth:', error);
        toast.error('Authentication failed. Please try again.');
        navigate('/login');
      }
    };

    handleGoogleAuth();
  }, [searchParams, navigate, setAuthUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center">
      <ScrollReveal animation="fade-up">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Completing Sign In...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we set up your account
          </p>
        </div>
      </ScrollReveal>
    </div>
  );
};

export default GoogleAuthSuccess;
