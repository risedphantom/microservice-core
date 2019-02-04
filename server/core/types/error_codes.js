module.exports = {
  NO_AUTH: 'NO_AUTH', // No auth cookies
  NOT_FOUND: 'NOT_FOUND', // Method not found
  WRONG_AUTH: 'WRONG_AUTH', // Invalid auth cookies
  BROKEN_DATA: 'BROKEN_DATA', // Storage data is broken
  REDIS_ERROR: 'REDIS_ERROR', // Redis client error
  INVALID_PARAM: 'INVALID_PARAM', // Parameter format is invalid
  PARAM_REQUIRED: 'PARAM_REQUIRED', // Parameter is required, but was not specified
  NOT_IMPLEMENTED: 'NOT_IMPLEMENTED', // Virtual method is not implemented
  PARAM_NOT_ALLOWED: 'PARAM_NOT_ALLOWED', // Parameter is not allowed
  ATTEMPTS_EXCEEDED: 'ATTEMPTS_EXCEEDED', // Exceeded maximum number of request attempts
  INVALID_PERMISSIONS: 'INVALID_PERMISSIONS', // Invalid permissions
  UNMET_CONDITIONS_ERROR: 'UNMET_CONDITIONS_ERROR', // Operation is forbidden due to unmet conditions (like validator, but more complex)
};

