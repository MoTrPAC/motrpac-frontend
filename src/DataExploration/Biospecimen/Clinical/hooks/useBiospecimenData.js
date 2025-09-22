import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { BiospecimenService } from '../../../../lib/api/biospecimenService';

// Debounce utility
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Cache key generator (legacy - now uses ETag caching)
const generateCacheKey = (filters) => {
  const sortedFilters = Object.keys(filters)
    .sort()
    .reduce((sorted, key) => {
      if (filters[key] && filters[key] !== '') {
        sorted[key] = filters[key];
      }
      return sorted;
    }, {});

  return 'biospecimen-' + JSON.stringify(sortedFilters);
};

export const useBiospecimenData = (filters = {}, options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const abortControllerRef = useRef(null);

  // Debounce filters to avoid excessive API calls
  const debouncedFilters = useDebounce(filters, 300);

  // Memoize options to prevent unnecessary re-renders
  // Exclude 'signal' from user options as we manage it internally
  const memoizedOptions = useMemo(() => {
    const { signal, ...optionsWithoutSignal } = options;
    return optionsWithoutSignal;
  }, [JSON.stringify(options)]); // Use JSON.stringify for deep comparison to avoid reference changes

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return Object.values(debouncedFilters).some(
      (value) => value && value !== '',
    );
  }, [debouncedFilters]);

  useEffect(() => {
    const loadBiospecimenData = async () => {
      // Don't load if no active filters
      if (!Object.values(debouncedFilters).some((value) => value && value !== '')) {
        setData([]);
        setLoading(false);
        setError(null);
        return;
      }

      // Cancel previous request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null; // Clear the reference
      }

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();

      setLoading(true);
      setError(null);
      setProgress(10);

      try {
        // Make API request with ETag caching - the service handles all caching logic
        const requestOptions = {
          ...memoizedOptions,
          signal: abortControllerRef.current.signal,
        };
        
        const response = await BiospecimenService.queryBiospecimens(
          debouncedFilters,
          requestOptions,
        );

        setProgress(70);

        // Set data from response (service handles ETag caching internally)
        setData(response.data);

        setProgress(100);
        setLoading(false);
      } catch (err) {
        // Improved abort error detection to handle different cancellation scenarios
        if (
          err.name === 'AbortError' || 
          err.code === 'ERR_CANCELED' || 
          err.message?.includes('canceled') ||
          err.message?.includes('AbortError')
        ) {
          console.log('Request was cancelled (this is normal when filters change quickly)');
          // Don't update loading state here - let the new request handle it
          return; // Request was cancelled, don't update state
        }

        // Only log actual errors, not cancellations
        console.error('Error loading biospecimen data:', err);
        setError(err.message || 'Failed to load biospecimen data');
        setLoading(false);
        setProgress(0);
        setData([]);
      }
    };

    loadBiospecimenData();

    return () => {
      // Cleanup: abort any pending requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedFilters, memoizedOptions, refreshTrigger]);

  // Manual refresh function
  const refresh = useCallback(() => {
    // Clear ETag cache for current filters
    try {
      const etagCache = BiospecimenService.getETagCache();
      etagCache.clearCache(debouncedFilters);
    } catch (error) {
      console.warn('Failed to clear cache during refresh:', error);
    }

    // Trigger refresh by incrementing the trigger
    setRefreshTrigger(prev => prev + 1);
  }, [debouncedFilters]);

  return {
    data,
    loading,
    error,
    progress,
    hasActiveFilters,
    refresh,
  };
};

// Legacy hook for backward compatibility - now just returns the data since filtering is server-side
export const useFilteredBiospecimenData = (data, filters) => {
  // Since filtering is now done server-side via the API, we just return the data
  // This hook is kept for backward compatibility but could be removed in the future
  return useMemo(() => {
    return data || [];
  }, [data]);
};

// Export cache utilities for testing/debugging
export const biospecimenDataUtils = {
  // ETag cache operations (primary)
  clearCache: (filters = null) => {
    try {
      const etagCache = BiospecimenService.getETagCache();
      etagCache.clearCache(filters);
    } catch (error) {
      console.warn('Failed to clear ETag cache:', error);
    }
  },

  getCacheInfo: (filters) => {
    try {
      const etagCache = BiospecimenService.getETagCache();
      const etag = etagCache.getETag(filters);
      const { data, timestamp } = etagCache.getCachedData(filters);
      
      return {
        etag,
        hasData: !!data,
        hasETag: !!etag,
        timestamp: timestamp ? new Date(timestamp) : null,
        dataSize: data ? JSON.stringify(data).length : 0,
      };
    } catch (error) {
      console.warn('Failed to get ETag cache info:', error);
      return {
        etag: null,
        hasData: false,
        hasETag: false,
        timestamp: null,
        dataSize: 0,
      };
    }
  },

  // Legacy support (for backward compatibility only)
  generateCacheKey,
};
