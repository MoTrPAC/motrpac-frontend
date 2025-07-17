import { useState, useEffect, useMemo } from 'react';

// Web Worker for parsing TSV data
const createTSVWorker = () => {
  const workerCode = `
    self.onmessage = function(e) {
      const { tsvText } = e.data;
      
      try {
        const lines = tsvText.trim().split('\\n');
        const headers = lines[0].split('\\t');
        const data = [];
        
        // Parse rows in chunks to avoid blocking
        const parseChunk = (startIndex, endIndex) => {
          for (let i = startIndex; i < endIndex && i < lines.length; i++) {
            const values = lines[i].split('\\t');
            const row = {};
            
            headers.forEach((header, index) => {
              row[header] = values[index] || '';
            });
            
            data.push(row);
          }
        };
        
        // Process in chunks of 1000 rows
        const chunkSize = 1000;
        for (let i = 1; i < lines.length; i += chunkSize) {
          parseChunk(i, i + chunkSize);
          
          // Send progress updates
          self.postMessage({
            type: 'progress',
            processed: Math.min(i + chunkSize - 1, lines.length - 1),
            total: lines.length - 1
          });
        }
        
        self.postMessage({
          type: 'complete',
          data: data
        });
      } catch (error) {
        self.postMessage({
          type: 'error',
          error: error.message
        });
      }
    };
  `;
  
  return new Worker(URL.createObjectURL(new Blob([workerCode], { type: 'application/javascript' })));
};

export const useBiospecimenData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      setProgress(0);

      try {
        // Check if data is cached in localStorage
        const cachedData = localStorage.getItem('biospecimen-data');
        const cachedTimestamp = localStorage.getItem('biospecimen-data-timestamp');
        const cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours

        if (cachedData && cachedTimestamp && 
            Date.now() - parseInt(cachedTimestamp) < cacheExpiry) {
          setData(JSON.parse(cachedData));
          setLoading(false);
          return;
        }

        // Dynamically import the TSV file
        const { default: tsvPath } = await import('../../../../data/human_clinical_biospecimen_curated.tsv?url');
        
        // Fetch the TSV file
        const response = await fetch(tsvPath);
        if (!response.ok) {
          throw new Error(`Failed to load data: ${response.statusText}`);
        }
        
        const tsvText = await response.text();
        
        // Use Web Worker to parse the data
        const worker = createTSVWorker();
        
        worker.onmessage = (e) => {
          const { type, data: workerData, error: workerError, processed, total } = e.data;
          
          switch (type) {
            case 'progress':
              setProgress(Math.round((processed / total) * 100));
              break;
              
            case 'complete':
              setData(workerData);
              setLoading(false);
              
              // Cache the parsed data
              try {
                localStorage.setItem('biospecimen-data', JSON.stringify(workerData));
                localStorage.setItem('biospecimen-data-timestamp', Date.now().toString());
              } catch (e) {
                console.warn('Failed to cache data:', e);
              }
              
              worker.terminate();
              break;
              
            case 'error':
              setError(workerError);
              setLoading(false);
              worker.terminate();
              break;
          }
        };
        
        worker.onerror = (error) => {
          setError(error.message);
          setLoading(false);
          worker.terminate();
        };
        
        worker.postMessage({ tsvText });
        
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, loading, error, progress };
};

// Hook for filtered data with optimized search
export const useFilteredBiospecimenData = (data, filters) => {
  return useMemo(() => {
    if (!data || data.length === 0) return [];

    const { tranche, randomizedGroup, collectionVisit, timepoint, tissue, sex } = filters;
    
    // Early return if no filters
    if (!tranche && !randomizedGroup && !collectionVisit && !timepoint && !tissue && !sex) {
      return [];
    }

    // Use efficient filtering
    return data.filter((item) => {
      return (!tranche || item.tranche === tranche) &&
        (!randomizedGroup || item.randomGroupCode === randomizedGroup) &&
        (!collectionVisit || item.visitcode === collectionVisit) &&
        (!timepoint || item.timepoint === timepoint) &&
        (!tissue || item.sampleGroupCode === tissue) &&
        (!sex || item.sex === sex);
    });
  }, [data, filters]);
};