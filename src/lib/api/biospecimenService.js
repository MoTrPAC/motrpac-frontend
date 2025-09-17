import axios from 'axios';

/**
 * Create biospecimen API service with configuration
 */
function CreateBiospecimenService() {
  const apiURL = import.meta.env.VITE_API_SERVICE_ADDRESS_DEV;
  const endpoint = import.meta.env.VITE_BIOSPECIMEN_DATA_ENDPOINT;
  const apiKey = import.meta.env.VITE_API_SERVICE_KEY_DEV;

  if (!apiURL) {
    throw new Error('VITE_API_SERVICE_ADDRESS_DEV is not configured');
  }

  if (!apiKey) {
    throw new Error('VITE_API_SERVICE_KEY_DEV is not configured');
  }

  // Create axios instance with default config
  const client = axios.create({
    baseURL: apiURL + endpoint,
    timeout: 30000, // 30 seconds timeout
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add request interceptor to include API key
  client.interceptors.request.use((config) => {
    config.params = config.params || {};
    config.params.key = apiKey;
    return config;
  });

  // Add response interceptor for error handling
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error('Biospecimen API Error:', error);

      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please try again.');
      }

      if (error.response) {
        const { status, data } = error.response;
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
              data?.message || `HTTP ${status}: ${error.message}`,
            );
        }
      }

      if (error.request) {
        throw new Error('Network error. Please check your connection.');
      }

      throw new Error('An unexpected error occurred.');
    },
  );

  /**
   * Format filter parameters for the API
   * Converts filter object to API-compatible parameters
   */
  const formatFilters = (filters) => {
    const params = {};

    // Map component filter names to API parameter names
    const filterMapping = {
      tranche: 'tranche',
      randomizedGroup: 'random_group_code',
      collectionVisit: 'visit_code',
      timepoint: 'timepoint',
      tissue: 'sample_group_code',
      sex: 'sex',
      tempSampProfile: 'temp_samp_profile',
      bmiGroups: 'bmi_groups',
      ageGroups: 'dmaqc_age_groups',
      enrollRandomGroup: 'enroll_random_group_code',
    };

    // Convert filters to API parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '' && filterMapping[key]) {
        const apiParam = filterMapping[key];

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
     * Query biospecimen data with filters
     * @param {Object} filters - Filter parameters
     * @param {Object} options - Additional options (limit, offset, signal, etc.)
     * @returns {Promise<Object>} API response with biospecimen data
     */
    async queryBiospecimens(filters = {}, options = {}) {
      try {
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

        // Create axios config with signal if provided
        const axiosConfig = { params };
        if (signal) {
          axiosConfig.signal = signal;
        }

        const response = await client.get('/', axiosConfig);

        // Validate response structure
        if (
          !response.data ||
          !Array.isArray(response.data.results || response.data)
        ) {
          throw new Error('Invalid response format from API');
        }

        return {
          data: response.data.results || response.data,
          total: response.data.total || response.data.length,
          count: response.data.count || response.data.length,
          next: response.data.next || null,
          previous: response.data.previous || null,
        };
      } catch (error) {
        console.error('Error querying biospecimens:', error);
        throw error;
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
  };
};

// Create and export singleton instance
export const BiospecimenService = CreateBiospecimenService();

// Export factory function for testing
export { CreateBiospecimenService };

export default BiospecimenService;
