import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { BiospecimenService } from '../../../../lib/api/biospecimenService';
import {
  getRaceCategory,
  getEthnicityCategory,
  getBMIGroup,
  mapRandomizedGroupFiltersToAPIValues,
} from '../utils/demographicUtils';
import { getTissueName } from '../utils/tissueUtils';
import { matchesOmeCategories } from '../utils/omeUtils';
import { getStudyName } from '../utils/studyUtils';

/**
 * Simplified biospecimen data hook that loads all data once and filters client-side
 * Much more efficient than making API calls for every filter combination
 */
export const useBiospecimenData = () => {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  // Centralized function to check if error is a cancellation
  const isCancellationError = useCallback((err) => {
    return err.name === 'AbortError' || 
           err.code === 'ERR_CANCELED' || 
           err.name === 'CanceledError' ||
           err.message?.includes('canceled') ||
           err.message?.includes('AbortError');
  }, []);

  // Centralized function to load data (used by both initial load and refresh)
  const loadData = useCallback(async () => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      console.log('Loading all biospecimen data (one-time load)');
      const startTime = performance.now();
      
      const response = await BiospecimenService.queryBiospecimens(
        {}, // Empty filters to get all data
        { signal: abortControllerRef.current.signal }
      );

      const endTime = performance.now();
      console.log(
        `Loaded ${response.data.length} total biospecimen records in ${(endTime - startTime).toFixed(2)}ms`
      );
      
      setAllData(response.data);
      setLoading(false);
    } catch (err) {
      // Handle cancellation - don't update state if request was cancelled
      if (isCancellationError(err)) {
        console.log('Data loading was cancelled');
        return;
      }

      // Handle actual errors
      console.error('Error loading biospecimen data:', err);
      setError(err.message || 'Failed to load biospecimen data');
      setLoading(false);
      setAllData([]);
    }
  }, [isCancellationError]);

  // Load all data once on mount
  useEffect(() => {
    loadData();

    // Cleanup: abort any pending requests on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadData]); // loadData is memoized with useCallback

  // Manual refresh function - reuses the centralized loadData logic
  const refresh = useCallback(async () => {
    console.log('Refreshing biospecimen data...');
    // Clear existing data
    setAllData([]);
    // Reload data using centralized function
    await loadData();
  }, [loadData]);

  return {
    allData,
    loading,
    error,
    refresh,
  };
};

/**
 * Client-side filtering hook - filters the loaded data in memory
 * This is much faster than making API calls for each filter combination
 * 
 * Performance optimizations:
 * - Pre-computes mapped filter values outside the filter loop
 * - Uses early returns for better performance
 * - Extracts all helper functions to external utilities
 * - Minimizes function calls inside the filter callback
 */
export const useFilteredBiospecimenData = (allData, filters) => {
  // Pre-compute filter conditions outside the filter loop for better performance
  const hasFilters = useMemo(() => {
    return filters && Object.keys(filters).some(key => {
      const value = filters[key];
      return Array.isArray(value) ? value.length > 0 : !!value;
    });
  }, [filters]);

  // Pre-compute mapped randomized group values (expensive operation done once)
  const mappedRandomGroupValues = useMemo(() => {
    if (!filters?.random_group_code || filters.random_group_code.length === 0) {
      return null;
    }
    return mapRandomizedGroupFiltersToAPIValues(filters.random_group_code);
  }, [filters?.random_group_code]);

  return useMemo(() => {
    // Early returns for edge cases
    if (!allData || allData.length === 0) {
      return [];
    }

    // If no filters are applied, return all data without processing
    if (!hasFilters) {
      return allData;
    }

    // Filter data with optimized logic
    return allData.filter(item => {
      // Filter by sex - only filter out if record HAS a sex value that doesn't match
      // Records with null/undefined sex values are kept (don't filter based on missing data)
      if (filters.sex?.length > 0) {
        if (item.sex && !filters.sex.includes(item.sex)) {
          return false;
        }
      }

      // Filter by age groups - only filter out if record HAS an age group that doesn't match
      // Records with null/undefined age groups are kept (don't filter based on missing data)
      if (filters.dmaqc_age_groups?.length > 0) {
        if (item.dmaqc_age_groups && !filters.dmaqc_age_groups.includes(item.dmaqc_age_groups)) {
          return false;
        }
      }

      // Filter by randomized group - only filter out if record HAS a group code that doesn't match
      // Records with null/undefined randomized groups are kept (don't filter based on missing data)
      if (mappedRandomGroupValues) {
        if (item.random_group_code && !mappedRandomGroupValues.includes(item.random_group_code)) {
          return false;
        }
      }

      // Filter by BMI group - using centralized utility
      // Only filter out if record HAS a BMI value that doesn't match selected filters
      // Records with null/unmapped BMI values are kept (don't filter based on missing data)
      if (filters.bmi_group?.length > 0) {
        const itemBMIGroup = getBMIGroup(item.bmi);
        if (itemBMIGroup && !filters.bmi_group.includes(itemBMIGroup)) {
          return false;
        }
      }

      // Filter by race - using centralized utility
      // Only filter out if record HAS a race value that doesn't match selected filters
      // Records with null/unmapped race values are kept (don't filter based on missing data)
      if (filters.race?.length > 0) {
        const itemRaceCategory = getRaceCategory(item);
        if (itemRaceCategory && !filters.race.includes(itemRaceCategory)) {
          return false;
        }
      }

      // Filter by ethnicity - using centralized utility
      // Only filter out if record HAS an ethnicity value that doesn't match selected filters
      // Records with null/unmapped ethnicity values are kept (don't filter based on missing data)
      if (filters.ethnicity?.length > 0) {
        const itemEthnicityCategory = getEthnicityCategory(item);
        if (itemEthnicityCategory && !filters.ethnicity.includes(itemEthnicityCategory)) {
          return false;
        }
      }

      // Filter by tissue - using centralized utility
      if (filters.tissue?.length > 0) {
        const tissueName = getTissueName(item.sample_group_code);
        // If record has a tissue value, it must match one of the selected filters
        // If record has no tissue value, keep it (don't filter based on missing data)
        if (tissueName && !filters.tissue.includes(tissueName)) {
          return false;
        }
      }

      // Filter by ome - using centralized utility
      if (filters.ome?.length > 0) {
        if (!matchesOmeCategories(item.raw_assays_with_results, filters.ome)) {
          return false;
        }
      }

      // Filter by study - using centralized utility
      // Only filter out if record HAS a study code that doesn't match selected filters
      // Records with null/unmapped study codes are kept (don't filter based on missing data)
      if (filters.study?.length > 0) {
        const studyName = getStudyName(item.study);
        if (studyName && !filters.study.includes(studyName)) {
          return false;
        }
      }

      return true;
    });
  }, [allData, filters, hasFilters, mappedRandomGroupValues]);
};
