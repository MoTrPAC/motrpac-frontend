import axios from 'axios';
import { tsvParse } from 'd3';

/**
 * Columns requested from the phenotype API's GET /api/biospecimens, by their
 * stored (lowercase) names. The API also accepts the data dictionary spelling
 * (e.g. tempSampProfile) but not the snake_case keys the components read
 * (e.g. temp_samp_profile). The full table has ~70 columns.
 */
export const BIOSPECIMEN_API_FIELDS = [
  'vial_label',
  'pid',
  'tranche',
  'tempsampprofile',
  'visit_code',
  'study',
  'sex',
  'dmaqc_age_groups',
  'bmi',
  'bmi_groups',
  'samplegroupcode',
  'randomgroupcode',
  'enrollrandomgroupcode',
  'timepoint',
  'receivedcas',
  'raw_assays_with_results',
  'latino_psca',
  'aablack_psca',
  'asian_psca',
  'hawaii_psca',
  'natamer_psca',
  'cauc_psca',
  'raceref_psca',
  'raceoth_psca',
];

/**
 * Query parameters for GET /api/biospecimens. Every row is requested (no
 * not_null filter); useBiospecimenData drops rows without
 * raw_assays_with_results client-side. List values are comma-joined because
 * axios would otherwise send `fields[]=...`. TSV is about a quarter the size
 * of the equivalent JSON to download and parse.
 */
const BIOSPECIMEN_API_PARAMS = {
  return_format: 'tsv',
  fields: BIOSPECIMEN_API_FIELDS.join(','),
};

/**
 * Record keys as the visualization components read them
 */
const BIOSPECIMEN_RECORD_KEYS = [
  'vial_label',
  'pid',
  'tranche',
  'temp_samp_profile',
  'visit_code',
  'study',
  'sex',
  'dmaqc_age_groups',
  'bmi',
  'bmi_groups',
  'sample_group_code',
  'random_group_code',
  'enroll_random_group_code',
  'timepoint',
  'received_cas',
  'raw_assays_with_results',
  'latino_psca',
  'aablack_psca',
  'asian_psca',
  'hawaii_psca',
  'natamer_psca',
  'cauc_psca',
  'raceref_psca',
  'raceoth_psca',
];

const canonicalKey = (key) => key.toLowerCase().replace(/_/g, '');

const RECORD_KEY_BY_CANONICAL = Object.fromEntries(
  BIOSPECIMEN_RECORD_KEYS.map((key) => [canonicalKey(key), key]),
);

/**
 * Rename a record's keys to the spelling the components read
 * The API returns the data dictionary's original spelling (e.g.,
 * sampleGroupCode, DMAQC_age_groups); matching ignores case and underscores so
 * camelCase, lowercase and snake_case responses all normalize the same way.
 * @param {Object} record - Biospecimen record from the API
 * @returns {Object} Record with normalized keys
 */
export const normalizeBiospecimenRecord = (record) => {
  const normalized = {};
  Object.entries(record).forEach(([key, value]) => {
    normalized[RECORD_KEY_BY_CANONICAL[canonicalKey(key)] || key] = value;
  });
  return normalized;
};

/**
 * Parse the API's TSV response into normalized records
 * The API writes nulls as empty cells and every requested column is text, so
 * empty cells become null (keeping `!= null` checks such as the one on
 * raw_assays_with_results meaningful) and other values stay strings, as they
 * are in the JSON response.
 * @param {string} text - TSV body with a header row
 * @returns {Object[]} Records with normalized keys
 */
export const parseBiospecimenTsv = (text) => {
  const rows = tsvParse(text, (row) => {
    const record = {};
    Object.entries(row).forEach(([key, value]) => {
      record[key] = value === '' ? null : value;
    });
    return normalizeBiospecimenRecord(record);
  });
  // A plain array, without the `columns` property d3 attaches
  return rows.slice();
};

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
  const apiURL = import.meta.env.VITE_API_SERVICE_ADDRESS;
  const endpoint = import.meta.env.VITE_BIOSPECIMEN_DATA_ENDPOINT;
  const apiKey = import.meta.env.VITE_API_SERVICE_KEY;

  console.log('Biospecimen Service Configuration:');
  console.log('API URL:', apiURL);
  console.log('Endpoint:', endpoint);
  console.log('API Key present:', !!apiKey);

  // For development, allow graceful degradation if environment variables are missing
  if (!apiURL) {
    console.warn('VITE_API_SERVICE_ADDRESS is not configured - using placeholder');
    return createMockService();
  }

  if (!apiKey) {
    console.warn('VITE_API_SERVICE_KEY is not configured - using placeholder');
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
        ...BIOSPECIMEN_API_PARAMS,
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
      const { data: cachedData } = etagCache.getCachedData(filters);

      // Create axios config with signal if provided. The TSV body is read as
      // text; axios would otherwise try to parse it as JSON.
      const axiosConfig = { params, responseType: 'text' };
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
        
        // '' rather than '/': a trailing slash on /api/biospecimens is redirected
        const response = await client.get('', axiosConfig);

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
        if (typeof response.data === 'string') {
          responseResults = parseBiospecimenTsv(response.data);
        } else if (Array.isArray(response.data)) {
          responseResults = response.data.map(normalizeBiospecimenRecord);
        } else if (response.data.results && Array.isArray(response.data.results)) {
          responseResults = response.data.results.map(normalizeBiospecimenRecord);
        } else {
          console.warn('Unexpected response format:', response.data);
          responseResults = [];
        }

        // Not cached in localStorage: the response (~26M characters) is far over
        // the ~5M-character quota, so the write always failed after serializing
        // it on the main thread. The browser's HTTP cache revalidates with the
        // API's ETag instead (304 -> cached body). Leftover entries, e.g. from
        // the previous backend, are cleared so they don't hold quota or serve
        // stale data on a network error.
        etagCache.clearCache(filters);

        const responseData = {
          results: responseResults,
          total: response.data.total || responseResults.length,
          count: response.data.count || responseResults.length,
          next: response.data.next || null,
          previous: response.data.previous || null,
        };

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
