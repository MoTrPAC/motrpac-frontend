/**
 * Maps backend error messages to user-friendly messages
 * and provides context-aware suggestions for resolving search issues.
 */

// Known backend error patterns and their friendly messages
const errorPatterns = [
  {
    // No valid indices for the given filter combination
    pattern: /could not determine which indices to search/i,
    friendlyMessage: 'No data is available for this combination of selected filters.',
    suggestion: 'Try adjusting your filter selections or removing some filters to broaden your search.',
    type: 'filter_mismatch',
  },
  {
    // No results found for the search
    pattern: /no results found/i,
    friendlyMessage: 'No matching results were found for your search.',
    suggestion: null, // Handled separately in UI
    type: 'no_results',
  },
  {
    // Invalid search term
    pattern: /invalid (search term|query|keyword)/i,
    friendlyMessage: 'The search term you entered is not valid.',
    suggestion: 'Please check the spelling or try a different search term.',
    type: 'invalid_term',
  },
  {
    // Connection/timeout errors
    pattern: /(timeout|connection|network)/i,
    friendlyMessage: 'There was a problem connecting to the search service.',
    suggestion: 'Please check your internet connection and try again.',
    type: 'connection_error',
  },
  {
    // Rate limiting
    pattern: /(rate limit|too many requests)/i,
    friendlyMessage: 'Too many requests. Please wait a moment.',
    suggestion: 'The system is receiving many requests. Please try again in a few seconds.',
    type: 'rate_limit',
  },
  {
    // Server error
    pattern: /(server error|internal error|500)/i,
    friendlyMessage: 'The search service encountered an error.',
    suggestion: 'Please try again later. If the problem persists, contact support.',
    type: 'server_error',
  },
];

/**
 * Get a user-friendly error message and suggestion for a backend error
 * @param {string} backendError - The error message from the backend
 * @param {string} scope - The search scope ('all' or 'filters')
 * @returns {Object} - Object with friendlyMessage, suggestion, and type
 */
export function getFriendlyErrorMessage(backendError, scope = 'all') {
  if (!backendError || typeof backendError !== 'string') {
    return {
      friendlyMessage: 'An unexpected error occurred.',
      suggestion: 'Please try again or modify your search parameters.',
      type: 'unknown',
    };
  }

  // Find matching error pattern
  const matchedPattern = errorPatterns.find((pattern) =>
    pattern.pattern.test(backendError)
  );

  if (matchedPattern) {
    return {
      friendlyMessage: matchedPattern.friendlyMessage,
      suggestion: matchedPattern.suggestion,
      type: matchedPattern.type,
    };
  }

  // Default handling for unrecognized errors
  // Show the original error but with a generic suggestion
  return {
    friendlyMessage: backendError,
    suggestion: scope === 'filters'
      ? 'Try adjusting your filter selections.'
      : 'Please modify your search parameters and try again.',
    type: 'unknown',
  };
}

/**
 * Check if an error is a "filter mismatch" type error
 * (no valid data for the selected filter combination)
 * @param {string} errorMessage - The error message
 * @returns {boolean}
 */
export function isFilterMismatchError(errorMessage) {
  if (!errorMessage || typeof errorMessage !== 'string') return false;
  return /could not determine which indices to search/i.test(errorMessage);
}

/**
 * Check if an error is a "no results" type error
 * @param {string} errorMessage - The error message
 * @returns {boolean}
 */
export function isNoResultsError(errorMessage) {
  if (!errorMessage || typeof errorMessage !== 'string') return false;
  return /no results found/i.test(errorMessage);
}

export default {
  getFriendlyErrorMessage,
  isFilterMismatchError,
  isNoResultsError,
};
