/**
 * Regex Security Utilities - STUB VERSION
 * Original file was deleted but still needed
 */

const createSafeSearchQuery = (input) => {
  if (!input) return {};

  // Escape regex special characters
  const escaped = input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return { $regex: escaped, $options: 'i' };
};

const createTextSearchQuery = (input) => {
  if (!input) return {};

  // Simple text search
  const escaped = input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return { $regex: escaped, $options: 'i' };
};

module.exports = {
  createSafeSearchQuery,
  createTextSearchQuery
};
