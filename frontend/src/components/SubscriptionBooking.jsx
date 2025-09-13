import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  Utensils,
  Check,
  Star,
  CreditCard,
  Shield,
  Repeat,
  Package,
  ChevronRight,
  Heart,
  Users,
  MapPin
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const SubscriptionBooking = ({ room, onClose }) => {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [selectedMeals, setSelectedMeals] = useState(['lunch', 'dinner']);
  const [dietType, setDietType] = useState('veg');
  const [startDate, setStartDate] = useState('');
  const [addOns, setAddOns] = useState([]);
  const [step, setStep] = useState(1);

  const subscriptionPlans = [
    {
      id: 'weekly',
      name: 'Weekly Plan',
      duration: '7 days',
      discount: 5,
      popular: false,
      description: 'Perfect for trying out'
    },
    {
      id: 'monthly',
      name: 'Monthly Plan',
      duration: '30 days',
      discount: 15,
      popular: true,
      description: 'Most popular choice'
    },
    {
      id: 'quarterly',
      name: 'Quarterly Plan',
      duration: '90 days',
      discount: 25,
      popular: false,
      description: 'Best value for money'
    }
  ];

  const mealOptions = [
    { id: 'breakfast', name: 'Breakfast', time: '8:00 AM - 10:00 AM', price: 80 },
    { id: 'lunch', name: 'Lunch', time: '12:00 PM - 2:00 PM', price: 120 },
    { id: 'dinner', name: 'Dinner', time: '7:00 PM - 9:00 PM', price: 100 }
  ];

  const addOnOptions = [
    { id: 'snacks', name: 'Evening Snacks', price: 50, icon: '🍪' },
    { id: 'juice', name: 'Fresh Juice', price: 40, icon: '🥤' },
    { id: 'dessert', name: 'Daily Dessert', price: 60, icon: '🍰' },
    { id: 'fruits', name: 'Seasonal Fruits', price: 70, icon: '🍎' }
  ];

  const calculatePrice = () => {
    const plan = subscriptionPlans.find(p => p.id === selectedPlan);
    const mealPrice = selectedMeals.reduce((total, mealId) => {
      const meal = mealOptions.find(m => m.id === mealId);
      return total + (meal ? meal.price : 0);
    }, 0);

    const addOnPrice = addOns.reduce((total, addOnId) => {
      const addOn = addOnOptions.find(a => a.id === addOnId);
      return total + (addOn ? addOn.price : 0);
    }, 0);

    const dailyPrice = mealPrice + addOnPrice;
    const planDays = plan.id === 'weekly' ? 7 : plan.id === 'monthly' ? 30 : 90;
    const totalPrice = dailyPrice * planDays;
    const discountAmount = (totalPrice * plan.discount) / 100;

    return {
      dailyPrice,
      totalPrice,
      discountAmount,
      finalPrice: totalPrice - discountAmount,
      planDays
    };
  };

  const pricing = calculatePrice();

  const PlanCard = ({ plan }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setSelectedPlan(plan.id)}
      className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPlan === plan.id
        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
        }`}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Most Popular
          </span>
        </div>
      )}

      <div className="text-center">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
          {plan.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {plan.description}
        </p>
        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
          {plan.discount}% OFF
        </div>
        <p className="text-xs text-gray-500">{plan.duration}</p>
      </div>
    </motion.div>
  );

  const MealCard = ({ meal }) => {
    const isSelected = selectedMeals.includes(meal.id);
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          if (isSelected) {
            setSelectedMeals(prev => prev.filter(m => m !== meal.id));
          } else {
            setSelectedMeals(prev => [...prev, meal.id]);
          }
        }}
        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected
          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
          : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
          }`}
      >
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-gray-900 dark:text-white">
            {meal.name}
          </h4>
          <div className="text-lg font-bold text-purple-600">
            ₹{meal.price}
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Clock className="w-4 h-4 mr-1" />
          {meal.time}
        </div>
        {isSelected && (
          <div className="mt-2 flex items-center text-green-600 dark:text-green-400">
            <Check className="w-4 h-4 mr-1" />
            <span className="text-sm">Selected</span>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Package className="w-6 h-6 text-purple-500" />
                  Subscription Booking
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Choose your perfect meal plan
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="p-6">
            {step === 1 && (
              <div className="space-y-6">
                {/* Room Info */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl" />
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        {room?.title || 'Premium Mess Room'}
                      </h3>
                      <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        {room?.location || 'Koramangala, Bangalore'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subscription Plans */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Choose Your Plan
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {subscriptionPlans.map((plan) => (
                      <PlanCard key={plan.id} plan={plan} />
                    ))}
                  </div>
                </div>

                {/* Meal Selection */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Select Meals
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {mealOptions.map((meal) => (
                      <MealCard key={meal.id} meal={meal} />
                    ))}
                  </div>
                </div>

                {/* Diet Type */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Diet Preference
                  </h3>
                  <div className="flex gap-4">
                    {[
                      { id: 'veg', name: 'Vegetarian', icon: '🥗' },
                      { id: 'non-veg', name: 'Non-Vegetarian', icon: '🍗' },
                      { id: 'vegan', name: 'Vegan', icon: '🌱' }
                    ].map((diet) => (
                      <button
                        key={diet.id}
                        onClick={() => setDietType(diet.id)}
                        className={`flex-1 p-3 rounded-xl border-2 transition-all ${dietType === diet.id
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                          : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                          }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-1">{diet.icon}</div>
                          <div className="font-medium text-gray-900 dark:text-white text-sm">
                            {diet.name}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add-ons */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Add-ons (Optional)
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {addOnOptions.map((addOn) => {
                      const isSelected = addOns.includes(addOn.id);
                      return (
                        <button
                          key={addOn.id}
                          onClick={() => {
                            if (isSelected) {
                              setAddOns(prev => prev.filter(a => a !== addOn.id));
                            } else {
                              setAddOns(prev => [...prev, addOn.id]);
                            }
                          }}
                          className={`p-3 rounded-xl border-2 transition-all ${isSelected
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                            : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                            }`}
                        >
                          <div className="text-center">
                            <div className="text-lg mb-1">{addOn.icon}</div>
                            <div className="font-medium text-gray-900 dark:text-white text-xs">
                              {addOn.name}
                            </div>
                            <div className="text-purple-600 text-xs font-bold">
                              ₹{addOn.price}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Price Summary */}
            <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Price Summary
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Daily Price:</span>
                  <span className="font-semibold">₹{pricing.dailyPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Total ({pricing.planDays} days):
                  </span>
                  <span className="font-semibold">₹{pricing.totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>Discount:</span>
                  <span className="font-semibold">-₹{pricing.discountAmount.toLocaleString()}</span>
                </div>
                <hr className="border-gray-300 dark:border-gray-600" />
                <div className="flex justify-between text-xl font-bold text-purple-600 dark:text-purple-400">
                  <span>Final Amount:</span>
                  <span>₹{pricing.finalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={onClose}
                className="btn-ghost flex-1"
              >
                Cancel
              </button>
              <button
                onClick={() => setStep(2)}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
                disabled={selectedMeals.length === 0}
              >
                Continue to Payment
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SubscriptionBooking;
