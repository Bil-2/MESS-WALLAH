/**
 * Regex Security Utilities
 * Provides safe regex queries for MongoDB search
 */

const createSafeSearchQuery = (input) => {
  if (!input) return {};

  // Escape regex special characters
  const escaped = input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return { $regex: escaped, $options: 'i' };
};

const createTextSearchQuery = (input, fields = []) => {
  if (!input || !fields || fields.length === 0) return {};

  // Escape regex special characters
  const escaped = input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Create $or query for multiple fields
  return {
    $or: fields.map(field => ({
      [field]: { $regex: escaped, $options: 'i' }
    }))
  };
};

module.exports = {
  createSafeSearchQuery,
  createTextSearchQuery
};
