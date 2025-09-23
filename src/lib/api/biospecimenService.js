import axios from 'axios';

/**
 * Create mock biospecimen service for development when environment variables are missing
 */
function createMockService() {
  console.log('Using mock biospecimen service - configure environment variables for real API');
  
  const mockData = [
    {
      visit_code: 'ADU_BAS',
      sample_group_code: 'ADI',
      timepoint: 'pre_exercise',
      vial_label: 'MOCK001',
      tranche: 'MOCK',
      random_group_code: 'ADUControl',
      sex: 'Male',
      dmaqc_age_groups: '18-39',
      raw_assays_with_results: 'METAB,PROT',
    },
    {
      visit_code: 'ADU_PAS',
      sample_group_code: 'BLO',
      timepoint: 'post_10_min',
      vial_label: 'MOCK002',
      tranche: 'MOCK',
      random_group_code: 'ADUEndur',
      sex: 'Female',
      dmaqc_age_groups: '40-59',
      raw_assays_with_results: 'METAB,RNA',
    },
    // Add more mock data for better testing
    {
      visit_code: 'ADU_BAS',
      sample_group_code: 'MUS',
      timepoint: 'pre_exercise',
      vial_label: 'MOCK003',
      tranche: 'MOCK',
      random_group_code: 'ADUResist',
      sex: 'Female',
      dmaqc_age_groups: '18-39',
      raw_assays_with_results: 'PROT,RNA',
    },
    {
      visit_code: 'PED_PAS',
      sample_group_code: 'BLO',
      timepoint: 'post_24_hr',
      vial_label: 'MOCK004',
      tranche: 'MOCK',
      random_group_code: 'PEDControl',
      sex: 'Male',
      dmaqc_age_groups: '14-17',
      raw_assays_with_results: 'METAB,EPIGEN',
    },
  ];

  return {
    async queryBiospecimens(filters = {}, options = {}) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Apply basic filtering to mock data for testing
      let filteredData = mockData;
      
      if (filters.sex) {
        const sexValues = filters.sex.split(',');
        filteredData = filteredData.filter(item => sexValues.includes(item.sex));
      }
      
      if (filters.random_group_code) {
        const groupValues = filters.random_group_code.split(',');
        filteredData = filteredData.filter(item => groupValues.includes(item.random_group_code));
      }
      
      console.log(`Mock service returning ${filteredData.length} filtered records`);
      
      return {
        data: filteredData,
        total: filteredData.length,
        count: filteredData.length,
        next: null,
        previous: null,
      };
    },

    async exportData(filters = {}, format = 'csv', options = {}) {
      const csvContent = 'visit_code,sample_group_code,timepoint\nADU_BAS,ADI,pre_exercise\n';
      return new Blob([csvContent], { type: 'text/csv' });
    },

    async healthCheck(options = {}) {
      return true;
    },

    // Mock ETag cache for consistency
    getETagCache: () => ({
      generateCacheKey: () => 'mock-cache-key',
      getETag: () => null,
      setETag: () => {},
      getCachedData: () => ({ data: null, timestamp: null }),
      setCachedData: () => {},
      clearCache: () => {},
    }),
  };
}

/**
 * Create biospecimen API service with configuration
 */
function CreateBiospecimenService() {
  const apiURL = import.meta.env.VITE_API_SERVICE_ADDRESS_DEV;
  const endpoint = import.meta.env.VITE_BIOSPECIMEN_DATA_ENDPOINT;
  const apiKey = import.meta.env.VITE_API_SERVICE_KEY_DEV;

  console.log('Biospecimen Service Configuration:');
  console.log('API URL:', apiURL);
  console.log('Endpoint:', endpoint);
  console.log('API Key present:', !!apiKey);

  // For development, allow graceful degradation if environment variables are missing
  if (!apiURL) {
    console.warn('VITE_API_SERVICE_ADDRESS_DEV is not configured - using placeholder');
    return createMockService();
  }

  if (!apiKey) {
    console.warn('VITE_API_SERVICE_KEY_DEV is not configured - using placeholder');
    return createMockService();
  }

  const baseURL = apiURL + (endpoint || '');
  console.log('Full base URL:', baseURL);

  // Create axios instance with default config
  const client = axios.create({
    baseURL,
    timeout: 30000, // 30 seconds timeout
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add request interceptor to include API key and ETag headers
  client.interceptors.request.use((config) => {
    config.params = config.params || {};
    config.params.key = apiKey;
    
    // Add ETag conditional request headers if available
    if (config.etag) {
      config.headers['If-None-Match'] = config.etag;
      // Remove etag from config to avoid sending it as a parameter
      delete config.etag;
    }
    
    return config;
  });

  // Add response interceptor for error handling and ETag caching
  client.interceptors.response.use(
    (response) => {
      // Store ETag from response headers (normalize case)
      const etag = response.headers.etag || response.headers.ETag || response.headers['e-tag'];
      if (etag) {
        response.etag = etag;
      }
      return response;
    },
    (error) => {
      // Check for cancellation errors first - don't log these as they're normal
      if (error.name === 'AbortError' || error.code === 'ERR_CANCELED' || error.name === 'CanceledError' || error.message?.includes('canceled')) {
        throw error;
      }

      console.error('Biospecimen API Error:', error);

      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please try again.');
      }

      if (error.response) {
        const { status, data } = error.response;
        console.error('Response status:', status);
        console.error('Response data:', data);
        
        // Handle 304 Not Modified responses - this is not an error
        if (status === 304) {
          // Create a special response object to indicate cache hit
          const etag = error.response.headers.etag || error.response.headers.ETag || error.response.headers['e-tag'];
          const notModifiedResponse = {
            status: 304,
            statusText: 'Not Modified',
            data: null,
            headers: error.response.headers,
            config: error.config,
            etag,
            fromCache: true,
          };
          return notModifiedResponse;
        }
        
        switch (status) {
          case 401:
            throw new Error('Unauthorized: Invalid API key');
          case 403:
            throw new Error('Forbidden: Access denied');
          case 404:
            throw new Error('Endpoint not found');
          case 429:
            throw new Error('Rate limit exceeded. Please try again later.');
          case 500:
            throw new Error('Server error. Please try again later.');
          default:
            throw new Error(
              data?.message || data?.error || `HTTP ${status}: ${error.message}`,
            );
        }
      }

      if (error.request) {
        console.error('Request made but no response received:', error.request);
        throw new Error('Network error. Please check your connection.');
      }

      console.error('Error setting up request:', error.message);
      throw new Error(`Request setup error: ${error.message}`);
    },
  );

  /**
   * ETag cache utilities for efficient HTTP caching
   */
  const etagCache = {
    /**
     * Generate cache key for ETag storage
     * Improved to handle empty filters and normalize keys for better cache hits
     */
    generateCacheKey: (filters, endpoint = 'biospecimen') => {
      // Normalize empty filters to a consistent representation
      const normalizedFilters = filters && Object.keys(filters).length > 0 ? filters : { __all__: true };
      
      const sortedFilters = Object.keys(normalizedFilters)
        .sort()
        .reduce((sorted, key) => {
          const value = normalizedFilters[key];
          if (value !== null && value !== undefined && value !== '') {
            // Normalize array values for consistent cache keys
            if (Array.isArray(value)) {
              sorted[key] = value.sort().join(',');
            } else {
              sorted[key] = value;
            }
          }
          return sorted;
        }, {});

      return `${endpoint}-etag-${JSON.stringify(sortedFilters)}`;
    },

    /**
     * Get stored ETag for given filters
     */
    getETag: (filters, endpoint = 'biospecimen') => {
      try {
        const cacheKey = etagCache.generateCacheKey(filters, endpoint);
        return localStorage.getItem(cacheKey);
      } catch (error) {
        console.warn('Failed to retrieve ETag from cache:', error);
        return null;
      }
    },

    /**
     * Store ETag for given filters
     */
    setETag: (filters, etag, endpoint = 'biospecimen') => {
      try {
        const cacheKey = etagCache.generateCacheKey(filters, endpoint);
        localStorage.setItem(cacheKey, etag);
      } catch (error) {
        console.warn('Failed to store ETag in cache:', error);
      }
    },

    /**
     * Get cached data for given filters (optimized single operation)
     */
    getCachedData: (filters, endpoint = 'biospecimen') => {
      try {
        const cacheKey = etagCache.generateCacheKey(filters, endpoint).replace('-etag-', '-data-');
        const cachedEntry = localStorage.getItem(cacheKey);
        
        if (cachedEntry) {
          const parsed = JSON.parse(cachedEntry);
          return {
            data: parsed.data,
            timestamp: parsed.timestamp,
          };
        }
        
        return { data: null, timestamp: null };
      } catch (error) {
        console.warn('Failed to retrieve cached data:', error);
        return { data: null, timestamp: null };
      }
    },

    /**
     * Store data in cache with timestamp (optimized single operation)
     */
    setCachedData: (filters, data, endpoint = 'biospecimen') => {
      try {
        const cacheKey = etagCache.generateCacheKey(filters, endpoint).replace('-etag-', '-data-');
        const cacheEntry = {
          data,
          timestamp: Date.now(),
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));
      } catch (error) {
        console.warn('Failed to store data in cache:', error);
      }
    },

    /**
     * Clear cache entries for given filters (optimized)
     */
    clearCache: (filters = null, endpoint = 'biospecimen') => {
      try {
        if (filters) {
          // Clear specific cache entries
          const etagKey = etagCache.generateCacheKey(filters, endpoint);
          const dataKey = etagKey.replace('-etag-', '-data-');
          localStorage.removeItem(etagKey);
          localStorage.removeItem(dataKey);
        } else {
          // Batch clear all cache entries for this endpoint
          const keysToRemove = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.startsWith(`${endpoint}-etag-`) || key.startsWith(`${endpoint}-data-`))) {
              keysToRemove.push(key);
            }
          }
          keysToRemove.forEach((key) => localStorage.removeItem(key));
        }
      } catch (error) {
        console.warn('Failed to clear cache:', error);
      }
    },
  };

  /**
   * Format filter parameters for the API
   * Converts filter object to API-compatible parameters
   */
  const formatFilters = (filters) => {
    const params = {};

    // Map component filter names to API parameter names
    const filterMapping = {
      // Direct mappings - these keys match what components send
      sex: 'sex',
      dmaqc_age_groups: 'dmaqc_age_groups',
      random_group_code: 'random_group_code',
      visit_code: 'visit_code',
      sample_group_code: 'sample_group_code',
      
      // Legacy mappings for backward compatibility
      tranche: 'tranche',
      randomizedGroup: 'random_group_code',
      collectionVisit: 'visit_code',
      timepoint: 'timepoint',
      tissue: 'sample_group_code',
      tempSampProfile: 'temp_samp_profile',
      bmiGroups: 'bmi_groups',
      ageGroups: 'dmaqc_age_groups',
      enrollRandomGroup: 'enroll_random_group_code',
    };

    // Convert filters to API parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        // Use direct key if no mapping exists, otherwise use mapped key
        const apiParam = filterMapping[key] || key;

        // Handle array values (convert comma-separated strings to arrays if needed)
        if (Array.isArray(value)) {
          params[apiParam] = value.join(',');
        } else if (typeof value === 'string' && value.includes(',')) {
          params[apiParam] = value;
        } else {
          params[apiParam] = value;
        }
      }
    });

    return params;
  };

  return {
    /**
     * Query biospecimen data with filters and ETag caching
     * @param {Object} filters - Filter parameters
     * @param {Object} options - Additional options (limit, offset, signal, etc.)
     * @returns {Promise<Object>} API response with biospecimen data
     */
    async queryBiospecimens(filters = {}, options = {}) {
      // Extract signal from options - it should go to axios config, not query params
      const { signal, ...requestOptions } = options;
      
      const params = {
        ...formatFilters(filters),
        ...requestOptions, // This now excludes signal
      };

      // Add pagination if specified
      if (requestOptions.limit) {
        params.limit = requestOptions.limit;
      }
      if (requestOptions.offset) {
        params.offset = requestOptions.offset;
      }

      // Check for cached ETag to enable conditional requests
      const cachedETag = etagCache.getETag(filters);
      const { data: cachedData, timestamp: cachedTimestamp } = etagCache.getCachedData(filters);

      // Create axios config with signal if provided
      const axiosConfig = { params };
      if (signal) {
        axiosConfig.signal = signal;
      }

      // Add ETag for conditional request if available
      if (cachedETag) {
        axiosConfig.etag = cachedETag;
      }

      try {
        // Add request validation and logging for debugging
        console.log('Making biospecimen API request with filters:', filters);
        console.log('Formatted params:', params);
        
        const response = await client.get('/', axiosConfig);

        // Handle 304 Not Modified response (from cache)
        if (response.status === 304 && cachedData) {
          console.log('ETag cache hit - using cached data');
          return {
            data: cachedData.results || cachedData,
            total: cachedData.total || cachedData.length,
            count: cachedData.count || cachedData.length,
            next: cachedData.next || null,
            previous: cachedData.previous || null,
            fromCache: true,
            etag: cachedETag,
          };
        }

        // Validate response structure for new data
        if (!response.data) {
          throw new Error('Empty response from API');
        }

        // Handle different response formats
        let responseResults;
        if (Array.isArray(response.data)) {
          responseResults = response.data;
        } else if (response.data.results && Array.isArray(response.data.results)) {
          responseResults = response.data.results;
        } else {
          console.warn('Unexpected response format:', response.data);
          responseResults = [];
        }

        // Store new ETag if present
        if (response.etag) {
          etagCache.setETag(filters, response.etag);
        }

        // Cache the new data with improved structure
        const responseData = {
          results: responseResults,
          total: response.data.total || responseResults.length,
          count: response.data.count || responseResults.length,
          next: response.data.next || null,
          previous: response.data.previous || null,
        };
        etagCache.setCachedData(filters, responseData);

        console.log(`Successfully loaded ${responseResults.length} biospecimen records`);

        return {
          data: responseResults,
          total: responseData.total,
          count: responseData.count,
          next: responseData.next,
          previous: responseData.previous,
          fromCache: false,
          etag: response.etag,
        };
      } catch (error) {
        // Check for cancellation errors first - don't log these as they're normal
        if (error.name === 'AbortError' || error.code === 'ERR_CANCELED' || error.name === 'CanceledError' || error.message?.includes('canceled')) {
          console.log('Biospecimen request cancelled (normal behavior)');
          throw error;
        }
        
        // Enhanced error logging for debugging
        console.error('Error querying biospecimens:', {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          filters: filters,
          params: params,
          url: error.config?.url,
        });
        
        // Handle specific error cases with better messages
        if (error.code === 'ECONNREFUSED') {
          console.error('Connection refused - API server may be down');
        } else if (error.code === 'ENOTFOUND') {
          console.error('DNS resolution failed - check API URL configuration');
        } else if (error.code === 'ECONNABORTED') {
          console.error('Request timed out');
        }
        
        // Fallback to cached data if available during network errors
        if (cachedData && (
          error.message?.includes('Network') || 
          error.message?.includes('timeout') ||
          error.code === 'ECONNREFUSED' ||
          error.code === 'ENOTFOUND' ||
          !error.response // Network error without response
        )) {
          console.warn('Network error - falling back to cached data');
          return {
            data: cachedData.results || cachedData,
            total: cachedData.total || cachedData.length,
            count: cachedData.count || cachedData.length,
            next: cachedData.next || null,
            previous: cachedData.previous || null,
            fromCache: true,
            etag: cachedETag,
            networkError: true,
          };
        }
        
        // If no cached data available, provide a more informative error
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error || 
                           error.message || 
                           'Failed to load biospecimen data';
        
        throw new Error(errorMessage);
      }
    },

    /**
     * Export filtered data in various formats
     * @param {Object} filters - Filter parameters
     * @param {string} format - Export format (csv, tsv, json)
     * @param {Object} options - Additional options including signal
     * @returns {Promise<Blob>} File blob for download
     */
    async exportData(filters = {}, format = 'csv', options = {}) {
      try {
        // Extract signal from options
        const { signal, ...requestOptions } = options;
        
        const params = {
          ...formatFilters(filters),
          ...requestOptions,
          format,
        };

        // Create axios config with signal if provided
        const axiosConfig = {
          params,
          responseType: 'blob',
        };
        if (signal) {
          axiosConfig.signal = signal;
        }

        const response = await client.get('/export', axiosConfig);

        return new Blob([response.data], {
          type: format === 'json' ? 'application/json' : 'text/csv',
        });
      } catch (error) {
        console.error('Error exporting data:', error);
        throw error;
      }
    },

    /**
     * Health check for the API
     * @param {Object} options - Additional options including signal
     * @returns {Promise<boolean>} API health status
     */
    async healthCheck(options = {}) {
      try {
        const { signal } = options;
        const axiosConfig = {};
        if (signal) {
          axiosConfig.signal = signal;
        }
        
        const response = await client.get('/health', axiosConfig);
        return response.status === 200;
      } catch (error) {
        console.warn('API health check failed:', error);
        return false;
      }
    },

    /**
     * Get ETag cache utilities for advanced cache management
     * @returns {Object} ETag cache utilities
     */
    getETagCache: () => etagCache,
  };
};

// Create and export singleton instance
export const BiospecimenService = CreateBiospecimenService();

// Export factory function for testing
export { CreateBiospecimenService };

export default BiospecimenService;
