/**
 * Sanitizes an environment variable key to ensure it only contains valid characters
 * Rules:
 * 1. Only letters, digits, and underscores allowed
 * 2. Cannot start with a digit
 * 3. Convert to uppercase (common convention for env vars)
 * @param {string} key - The key to sanitize
 * @returns {string} - The sanitized key
 */
export const sanitizeEnvKey = (key) => {
  if (!key) return '';
  
  // Remove any characters that aren't letters, digits, or underscores
  let sanitized = key.replace(/[^a-zA-Z0-9_]/g, '');
  
  // If it starts with a digit, prepend an underscore
  if (/^\d/.test(sanitized)) {
    sanitized = `_${sanitized}`;
  }
  
  // Convert to uppercase (common convention for env vars)
  return sanitized.toUpperCase();
};

/**
 * Validates if a string is a valid environment variable key
 * @param {string} key - The key to validate
 * @returns {boolean} - Whether the key is valid
 */
export const isValidEnvKey = (key) => {
  if (!key) return false;
  
  // Must only contain letters, digits, and underscores
  // Must not start with a digit
  return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key);
};
