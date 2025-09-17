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

// Cache key generator
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
  const memoizedOptions = useMemo(() => options, [JSON.stringify(options)]);

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

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      setLoading(true);
      setError(null);
      setProgress(10);

      try {
        // Check cache first
        const cacheKey = generateCacheKey(debouncedFilters);
        const cachedData = localStorage.getItem(cacheKey);
        const cachedTimestamp = localStorage.getItem(cacheKey + '-timestamp');
        const cacheExpiry = 5 * 60 * 1000; // 5 minutes cache for filtered results

        if (
          cachedData &&
          cachedTimestamp &&
          Date.now() - parseInt(cachedTimestamp, 10) < cacheExpiry
        ) {
          setData(JSON.parse(cachedData));
          setProgress(100);
          setLoading(false);
          return;
        }

        setProgress(30);

        // Make API request
        const response = await BiospecimenService.queryBiospecimens(
          debouncedFilters,
          { ...memoizedOptions, signal: abortControllerRef.current.signal },
        );

        setProgress(70);

        // Set data
        setData(response.data);

        // Cache the result
        try {
          localStorage.setItem(cacheKey, JSON.stringify(response.data));
          localStorage.setItem(cacheKey + '-timestamp', Date.now().toString());
        } catch (e) {
          console.warn('Failed to cache filtered data:', e);
        }

        setProgress(100);
        setLoading(false);
      } catch (err) {
        if (err.name === 'AbortError') {
          return; // Request was cancelled, don't update state
        }

        console.error('Error loading biospecimen data:', err);
        setError(err.message || 'Failed to load biospecimen data');
        setLoading(false);
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
    // Clear cache for current filters
    const cacheKey = generateCacheKey(debouncedFilters);
    localStorage.removeItem(cacheKey);
    localStorage.removeItem(cacheKey + '-timestamp');

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
  generateCacheKey,
  clearCache: (filters = null) => {
    if (filters) {
      const cacheKey = generateCacheKey(filters);
      localStorage.removeItem(cacheKey);
      localStorage.removeItem(cacheKey + '-timestamp');
    } else {
      // Clear all biospecimen cache
      const keys = Object.keys(localStorage).filter((key) =>
        key.startsWith('biospecimen-'),
      );
      keys.forEach((key) => localStorage.removeItem(key));
    }
  },
  getCacheInfo: (filters) => {
    const cacheKey = generateCacheKey(filters);
    const cachedData = localStorage.getItem(cacheKey);
    const cachedTimestamp = localStorage.getItem(cacheKey + '-timestamp');

    return {
      key: cacheKey,
      hasData: !!cachedData,
      timestamp: cachedTimestamp
        ? new Date(parseInt(cachedTimestamp, 10))
        : null,
      size: cachedData ? cachedData.length : 0,
    };
  },
};
