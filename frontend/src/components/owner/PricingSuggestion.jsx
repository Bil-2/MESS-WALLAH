import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, TrendingDown, Minus, DollarSign, BarChart3 } from 'lucide-react';

const PricingSuggestion = ({ roomId, currentPrice, onClose }) => {
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (roomId) {
      fetchSuggestion();
    }
  }, [roomId]);

  const fetchSuggestion = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://mess-wallah.onrender.com/api/owner/pricing-suggestions/${roomId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setSuggestion(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pricing:', error);
      setError('Failed to load pricing suggestions');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mt-4">
        <div className="animate-pulse">
          <div className="h-4 bg-blue-200 dark:bg-blue-700 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-blue-200 dark:bg-blue-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error || !suggestion) {
    return null;
  }

  const isPriceIncrease = suggestion.recommendation === 'increase';
  const isPriceDecrease = suggestion.recommendation === 'decrease';
  const isOptimal = suggestion.recommendation === 'maintain';

  return (
    <div className={`rounded-xl p-4 mt-4 border ${isPriceIncrease
      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
      : isPriceDecrease
        ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
        : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
      }`}>
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Smart Pricing Insights
        </h4>
        {isPriceIncrease && <TrendingUp className="w-5 h-5 text-green-600" />}
        {isPriceDecrease && <TrendingDown className="w-5 h-5 text-orange-600" />}
        {isOptimal && <Minus className="w-5 h-5 text-blue-600" />}
      </div>

      <div className="space-y-3 text-sm">
        {/* Current vs Recommended */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Current Price</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              ₹{suggestion.currentPrice.toLocaleString()}
            </p>
          </div>
          <div className={`rounded-lg p-3 ${isPriceIncrease
            ? 'bg-green-100 dark:bg-green-900/30'
            : isPriceDecrease
              ? 'bg-orange-100 dark:bg-orange-900/30'
              : 'bg-blue-100 dark:bg-blue-900/30'
            }`}>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Recommended</p>
            <p className={`text-xl font-bold ${isPriceIncrease ? 'text-green-700 dark:text-green-400'
              : isPriceDecrease ? 'text-orange-700 dark:text-orange-400'
                : 'text-blue-700 dark:text-blue-400'
              }`}>
              ₹{suggestion.suggestedPrice.toLocaleString()}
              {suggestion.priceDiff !== 0 && (
                <span className="text-sm ml-2">
                  ({suggestion.priceDiff > 0 ? '+' : ''}₹{Math.abs(suggestion.priceDiff).toLocaleString()})
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Reason */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
          <p className="text-gray-700 dark:text-gray-300 font-medium">
            {suggestion.reason}
          </p>
          {suggestion.seasonReason && suggestion.seasonalFactor !== 1 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {suggestion.seasonReason}
            </p>
          )}
        </div>

        {/* Market Analysis */}
        {suggestion.marketRange && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
              Market Analysis ({suggestion.similarRoomsCount} similar rooms)
            </p>
            <div className="flex items-center gap-3 text-xs">
              <div>
                <span className="text-gray-500">Min:</span>
                <span className="font-semibold ml-1">₹{suggestion.marketRange.min.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-500">Median:</span>
                <span className="font-semibold ml-1">₹{suggestion.marketRange.median.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-500">Max:</span>
                <span className="font-semibold ml-1">₹{suggestion.marketRange.max.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Revenue Impact */}
        {suggestion.potentialRevenue && isPriceIncrease && (
          <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3">
            <p className="text-xs text-green-700 dark:text-green-400 font-medium">
              Potential additional revenue: {suggestion.potentialRevenue}
            </p>
          </div>
        )}

        {/* Action Button */}
        {isPriceIncrease && (
          <button
            className="w-full mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
            onClick={() => {
              // TODO: Implement price update
              alert(`Update price to ₹${suggestion.suggestedPrice}? (Coming soon!)`);
            }}
          >
            Apply Suggested Price
          </button>
        )}
      </div>
    </div>
  );
};

export default PricingSuggestion;
