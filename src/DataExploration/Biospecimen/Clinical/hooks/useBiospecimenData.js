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

      // Filter by race
      if (filters.race && filters.race.length > 0) {
        // Helper function to derive race category from boolean indicator fields
        const getRaceCategory = (record) => {
          if (record.aablack_psca === '1' || record.aablack_psca === 1 || record.aablack_psca === true) {
            return 'African American/Black';
          }
          if (record.asian_psca === '1' || record.asian_psca === 1 || record.asian_psca === true) {
            return 'Asian';
          }
          if (record.hawaii_psca === '1' || record.hawaii_psca === 1 || record.hawaii_psca === true) {
            return 'Hawaiian/Pacific Islander';
          }
          if (record.natamer_psca === '1' || record.natamer_psca === 1 || record.natamer_psca === true) {
            return 'Native American';
          }
          if (record.cauc_psca === '1' || record.cauc_psca === 1 || record.cauc_psca === true) {
            return 'Caucasian';
          }
          if (record.raceoth_psca === '1' || record.raceoth_psca === 1 || record.raceoth_psca === true) {
            return 'Other';
          }
          if (record.raceref_psca === '1' || record.raceref_psca === 1 || record.raceref_psca === true) {
            return 'Unknown';
          }
          return null;
        };

        const itemRaceCategory = getRaceCategory(item);
        if (!itemRaceCategory || !filters.race.includes(itemRaceCategory)) {
          return false;
        }
      }

      // Filter by ethnicity
      if (filters.ethnicity && filters.ethnicity.length > 0) {
        // Helper function to derive ethnicity category from latino_psca field
        // MUST match the exact strings used in BiospecimenChart.jsx
        const getEthnicityCategory = (record) => {
          const latinoValue = record.latino_psca;
          // Check for value 1 (Latino/Hispanic/Spanish)
          if (latinoValue === '1' || latinoValue === 1) {
            return 'Latino, Hispanic, or Spanish origin/ethnicity';
          }
          // Check for value 0 (Not Latino/Hispanic/Spanish)
          if (latinoValue === '0' || latinoValue === 0) {
            return 'Not Latino, Hispanic, or Spanish origin/ethnicity';
          }
          // Check for value -7 (Refused/Unknown)
          if (latinoValue === '-7' || latinoValue === -7) {
            return 'Refused/Unknown';
          }
          return null;
        };

        const itemEthnicityCategory = getEthnicityCategory(item);
        if (!itemEthnicityCategory || !filters.ethnicity.includes(itemEthnicityCategory)) {
          return false;
        }
      }

      return true;
    });
  }, [allData, filters]);
};
