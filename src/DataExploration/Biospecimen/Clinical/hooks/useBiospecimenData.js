import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { BiospecimenService } from '../../../../lib/api/biospecimenService';

/**
 * Simplified biospecimen data hook that loads all data once and filters client-side
 * Much more efficient than making API calls for every filter combination
 */
export const useBiospecimenData = () => {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  // Load all data once on mount
  useEffect(() => {
    const loadAllBiospecimenData = async () => {
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
        
        const response = await BiospecimenService.queryBiospecimens(
          {}, // Empty filters to get all data
          { signal: abortControllerRef.current.signal }
        );

        console.log(`Loaded ${response.data.length} total biospecimen records`);
        setAllData(response.data);
        setLoading(false);
      } catch (err) {
        // Handle cancellation
        if (
          err.name === 'AbortError' || 
          err.code === 'ERR_CANCELED' || 
          err.name === 'CanceledError' ||
          err.message?.includes('canceled') ||
          err.message?.includes('AbortError')
        ) {
          console.log('Data loading was cancelled');
          return;
        }

        console.error('Error loading biospecimen data:', err);
        setError(err.message || 'Failed to load biospecimen data');
        setLoading(false);
        setAllData([]);
      }
    };

    loadAllBiospecimenData();

    return () => {
      // Cleanup: abort any pending requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []); // Empty dependency array - only load once

  // Manual refresh function
  const refresh = useCallback(async () => {
    // Simply reload all data
    setAllData([]);
    
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
      const response = await BiospecimenService.queryBiospecimens(
        {},
        { signal: abortControllerRef.current.signal }
      );

      setAllData(response.data);
      setLoading(false);
    } catch (err) {
      if (
        err.name === 'AbortError' || 
        err.code === 'ERR_CANCELED' || 
        err.name === 'CanceledError' ||
        err.message?.includes('canceled')
      ) {
        return;
      }

      console.error('Error refreshing biospecimen data:', err);
      setError(err.message || 'Failed to refresh biospecimen data');
      setLoading(false);
    }
  }, []);

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
 */
export const useFilteredBiospecimenData = (allData, filters) => {
  return useMemo(() => {
    if (!allData || allData.length === 0) {
      return [];
    }

    // If no filters are applied, return all data
    if (!filters || Object.keys(filters).length === 0) {
      return allData;
    }

    return allData.filter(item => {
      // Filter by sex
      if (filters.sex && filters.sex.length > 0) {
        if (!filters.sex.includes(item.sex)) {
          return false;
        }
      }

      // Filter by age groups
      if (filters.dmaqc_age_groups && filters.dmaqc_age_groups.length > 0) {
        if (!filters.dmaqc_age_groups.includes(item.dmaqc_age_groups)) {
          return false;
        }
      }

      // Filter by randomized group
      if (filters.random_group_code && filters.random_group_code.length > 0) {
        // Map the filter values to actual API values for comparison
        const mappedValues = filters.random_group_code.flatMap(option => {
          switch (option) {
            case 'Control': return ['ADUControl', 'PEDControl'];
            case 'Endurance': return ['ADUEndur', 'ATHEndur', 'PEDEndur'];
            case 'Resistance': return ['ADUResist', 'ATHResist'];
            default: return [];
          }
        });

        if (!mappedValues.includes(item.random_group_code)) {
          return false;
        }
      }

      // Filter by BMI group
      if (filters.bmi_group && filters.bmi_group.length > 0) {
        // Helper function to categorize BMI value into group (same logic as chart)
        const getBMIGroup = (bmi) => {
          const bmiValue = parseFloat(bmi);
          if (isNaN(bmiValue)) return null;
          if (bmiValue < 25) return '0-25';
          if (bmiValue < 30) return '25-30';
          return '30+';
        };

        const itemBMIGroup = getBMIGroup(item.bmi);
        if (!itemBMIGroup || !filters.bmi_group.includes(itemBMIGroup)) {
          return false;
        }
      }

      return true;
    });
  }, [allData, filters]);
};
