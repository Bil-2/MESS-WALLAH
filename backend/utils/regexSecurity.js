/**
 * Regex Security Utility
 * Provides secure search query functions to prevent ReDoS attacks
 */

/**
 * Escapes special regex characters to prevent regex injection
 * @param {string} string - The string to escape
 * @returns {string} - Escaped string safe for regex use
 */
const escapeRegex = (string) => {
  if (!string || typeof string !== 'string') return '';
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Creates a safe search query for MongoDB text search
 * Prevents ReDoS attacks by sanitizing user input
 * @param {string} searchTerm - The search term from user input
 * @param {Array<string>} fields - Array of field names to search in
 * @returns {Object} - MongoDB query object
 */
const createTextSearchQuery = (searchTerm, fields = []) => {
  if (!searchTerm || typeof searchTerm !== 'string') {
    return {};
  }

  // Sanitize and limit the search term length
  const sanitizedTerm = escapeRegex(searchTerm.trim().substring(0, 100));

  if (!sanitizedTerm) {
    return {};
  }

  // If no fields specified, return empty query
  if (!fields || fields.length === 0) {
    return {};
  }

  // Create case-insensitive regex pattern
  const regex = new RegExp(sanitizedTerm, 'i');

  // Create $or query for multiple fields
  if (fields.length === 1) {
    return { [fields[0]]: regex };
  }

  return {
    $or: fields.map(field => ({ [field]: regex }))
  };
};

/**
 * Creates a safe search query with exact match option
 * @param {string} searchTerm - The search term from user input
 * @param {Array<string>} fields - Array of field names to search in
 * @param {boolean} exactMatch - Whether to perform exact match
 * @returns {Object} - MongoDB query object
 */
const createSafeSearchQuery = (searchTerm, fields = [], exactMatch = false) => {
  if (!searchTerm || typeof searchTerm !== 'string') {
    return {};
  }

  // Sanitize and limit the search term length
  const sanitizedTerm = searchTerm.trim().substring(0, 100);

  if (!sanitizedTerm) {
    return {};
  }

  // If no fields specified, return empty query
  if (!fields || fields.length === 0) {
    return {};
  }

  if (exactMatch) {
    // For exact match, create equality query
    if (fields.length === 1) {
      return { [fields[0]]: sanitizedTerm };
    }
    return {
      $or: fields.map(field => ({ [field]: sanitizedTerm }))
    };
  }

  // For partial match, use regex with escaped special characters
  const escapedTerm = escapeRegex(sanitizedTerm);
  const regex = new RegExp(escapedTerm, 'i');

  if (fields.length === 1) {
    return { [fields[0]]: regex };
  }

  return {
    $or: fields.map(field => ({ [field]: regex }))
  };
};

module.exports = {
  escapeRegex,
  createTextSearchQuery,
  createSafeSearchQuery
};
