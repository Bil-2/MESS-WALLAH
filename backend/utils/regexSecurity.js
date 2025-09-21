/**
 * Regex Security Utilities
 * Provides safe regex operations to prevent ReDoS attacks
 */

/**
 * Create a safe search query that prevents regex injection
 * @param {string} searchTerm - The search term to sanitize
 * @returns {object} - Safe MongoDB regex query
 */
const createSafeSearchQuery = (searchTerm) => {
  if (!searchTerm || typeof searchTerm !== 'string') {
    return {};
  }

  // Remove special regex characters to prevent injection
  const sanitizedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Limit length to prevent ReDoS attacks
  const maxLength = 100;
  const safeTerm = sanitizedTerm.slice(0, maxLength);
  
  return {
    $regex: safeTerm,
    $options: 'i' // case insensitive
  };
};

/**
 * Sanitize input to prevent regex injection
 * @param {string} input - Input to sanitize
 * @returns {string} - Sanitized input
 */
const sanitizeRegexInput = (input) => {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  // Escape special regex characters
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Create safe text search for MongoDB
 * @param {string} searchTerm - Search term
 * @param {array} fields - Fields to search in
 * @returns {object} - MongoDB query object
 */
const createTextSearchQuery = (searchTerm, fields = []) => {
  if (!searchTerm || typeof searchTerm !== 'string') {
    return {};
  }

  const safeQuery = createSafeSearchQuery(searchTerm);
  
  if (fields.length === 0) {
    return safeQuery;
  }

  const orConditions = fields.map(field => ({
    [field]: safeQuery
  }));

  return { $or: orConditions };
};

module.exports = {
  createSafeSearchQuery,
  sanitizeRegexInput,
  createTextSearchQuery
};
