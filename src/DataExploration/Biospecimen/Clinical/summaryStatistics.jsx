import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Dropdown from './components/form/dropdown';
import BiospecimenResultsTable from './components/BiospecimenResultsTable';
import { useBiospecimenData, useFilteredBiospecimenData } from './hooks/useBiospecimenData';

// Loading component
const DataLoadingIndicator = ({ progress }) => (
  <div className="d-flex justify-content-center align-items-center p-4">
    <div className="text-center">
      <div className="spinner-border text-primary mb-3" role="status">
        <span className="sr-only">Loading...</span>
      </div>
      <div className="progress" style={{ width: '300px' }}>
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${progress}%` }}
          aria-valuenow={progress}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          {progress}%
        </div>
      </div>
      <p className="mt-2 text-muted">Loading biospecimen data...</p>
    </div>
  </div>
);

// Define dropdown options
const dropdownOptions = {
  tranche: [
    { value: 'TR00', label: 'Tranche 0' },
    { value: 'TR01', label: 'Tranche 1' },
    { value: 'TR02', label: 'Tranche 2' },
    { value: 'TR03', label: 'Tranche 3' },
    { value: 'TR04', label: 'Tranche 4' },
  ],
  randomizedGroup: [
    { value: 'ADUControl', label: 'Control Intervention' },
    { value: 'ADUEndur', label: 'Endurance Intervention' },
    { value: 'ADUResist', label: 'Resistance Intervention' },
    { value: 'ATHEndur', label: 'Highly Active Endurance' },
    { value: 'ATHResist', label: 'Highly Active Resistance' },
  ],
  collectionVisit: [
    { value: 'ADU_BAS', label: 'Adult Baseline Biospecimen Assessment Sequence' },
    { value: 'ADU_PAS', label: 'Adult Post Intervention Biospecimen Assessment Sequence' },
    { value: 'PED_BAS', label: 'Pediatric Baseline Biospecimen Assessment Sequence' },
    { value: 'PED_PAS', label: 'Pediatric Post Intervention Biospecimen Assessment Sequence' },
  ],
  timepoint: [
    { value: 'pre_exercise', label: 'Pre-exercise or Rest 1' },
    { value: 'during_20_min', label: '20 minutes during exercise' },
    { value: 'during_40_min', label: '40 minutes during exercise' },
    { value: 'post_10_min', label: '10 minutes post-exercise' },
    { value: 'post_15_30_45_min', label: '15, 30, or 45 minutes post-exercise' },
    { value: 'post_3.5_4_hr', label: '3.5 or 4 hours post-exercise' },
    { value: 'post_24_hr', label: '24 hours post-exercise' },
  ],
  tissue: [
    { value: 'ADI', label: 'Adipose' },
    { value: 'BLO', label: 'Blood' },
    { value: 'MUS', label: 'Muscle' },
  ],
  sex: [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
  ],
};

function ClinicalBiospecimenSummaryStatistics({ profile = {} }) {
  // get states from redux store
    const userProfile = useSelector((state) => state.auth.profile);
    const userType = userProfile.user_metadata && userProfile.user_metadata.userType;
    if (userType !== 'internal') {
      return <Navigate to="/dashboard" />;
    }

  // Local state for biospecimen filters
  const [biospecimenFilters, setBiospecimenFilters] = useState({
    tranche: '',
    randomizedGroup: '',
    collectionVisit: '',
    timepoint: '',
    tissue: '',
    sex: '',
  });

  // Load biospecimen data with optimized hook
  const { data: biospecimenData, loading, error, progress } = useBiospecimenData();
  
  // Get filtered data with memoization
  const filteredData = useFilteredBiospecimenData(biospecimenData, biospecimenFilters);

  // Check if any filter has a value
  const hasActiveFilters = Object.values(biospecimenFilters).some(value => value && value !== '');

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setBiospecimenFilters(prev => ({
      ...prev,
      [filterType]: value,
    }));
  };

  // Reset all filters
  const handleResetFilters = () => {
    setBiospecimenFilters({
      tranche: '',
      randomizedGroup: '',
      collectionVisit: '',
      timepoint: '',
      tissue: '',
      sex: '',
    });
  };

  // render JSX
  return (
    <div className="biospecimenSummary w-100 px-3 px-md-4 mb-3">
      <Helmet>
        <html lang="en" />
        <title>Biospecimen Summary - MoTrPAC Data Hub</title>
      </Helmet>
      <h1 className="mb-4 display-4">
        <i className="bi bi-search mr-3" />
        <span>Biospecimen Lookup</span>
      </h1>
      <div className="lead mb-4">
        Use this tool to look up biospecimen data curated from pre-COVID human sedentary adults and the highly active adults in the human main study.
      </div>
      <div className="biospecimen-lookup-container border shadow-sm px-4 pt-3 pb-2 mb-4">
        {/* Show loading indicator while data is being loaded */}
        {loading && <DataLoadingIndicator progress={progress} />}

        {/* Show error if data loading failed */}
        {error && (
          <div className="alert alert-danger" role="alert">
            <h5 className="alert-heading">Data Loading Error</h5>
            <p>{error}</p>
            <button className="btn btn-outline-danger" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        )}

        {/* Show filters and table only when data is loaded */}
        {!loading && !error && biospecimenData.length > 0 && (
          <>
            <div className="lookup-form-container">
              <div className="form-row">
                <div className="col-md-2">
                  <Dropdown
                    id="tranche-select"
                    label="Tranche"
                    options={dropdownOptions.tranche}
                    selectedOption={biospecimenFilters.tranche || ''}
                    onChange={(value) => handleFilterChange('tranche', value)}
                    placeholder="Select tranche"
                  />
                </div>
                <div className="col-md-2">
                  <Dropdown
                    id="randomized-group-select"
                    label="Randomized Group"
                    options={dropdownOptions.randomizedGroup}
                    selectedOption={biospecimenFilters.randomizedGroup || ''}
                    onChange={(value) => handleFilterChange('randomizedGroup', value)}
                    placeholder="Select group"
                  />
                </div>
                <div className="col-md-2">
                  <Dropdown
                    id="collection-visit-select"
                    label="Collection Visit"
                    options={dropdownOptions.collectionVisit}
                    selectedOption={biospecimenFilters.collectionVisit || ''}
                    onChange={(value) => handleFilterChange('collectionVisit', value)}
                    placeholder="Select visit"
                  />
                </div>
                <div className="col-md-2">
                  <Dropdown
                    id="timepoint-select"
                    label="Timepoint"
                    options={dropdownOptions.timepoint}
                    selectedOption={biospecimenFilters.timepoint || ''}
                    onChange={(value) => handleFilterChange('timepoint', value)}
                    placeholder="Select timepoint"
                  />
                </div>
                <div className="col-md-2">
                  <Dropdown
                    id="tissue-select"
                    label="Tissue"
                    options={dropdownOptions.tissue}
                    selectedOption={biospecimenFilters.tissue || ''}
                    onChange={(value) => handleFilterChange('tissue', value)}
                    placeholder="Select tissue"
                  />
                </div>
                <div className="col-md-2">
                  <Dropdown
                    id="sex-select"
                    label="Sex"
                    options={dropdownOptions.sex}
                    selectedOption={biospecimenFilters.sex || ''}
                    onChange={(value) => handleFilterChange('sex', value)}
                    placeholder="Select sex"
                  />
                </div>
              </div>
              <div className="d-flex justify-content-end mt-3">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={handleResetFilters}
                  disabled={!hasActiveFilters}
                >
                  <i className="bi bi-arrow-clockwise mr-2" />
                  Reset
                </button>
              </div>
            </div>
        
            {/* Results section */}
            {hasActiveFilters && (
              <div className="mt-4">
                <BiospecimenResultsTable data={filteredData} />
              </div>
            )}

            {/* Data info */}
            <div className="mt-3 text-muted small">
              <i className="bi bi-info-circle mr-1" />
              Total {biospecimenData.length.toLocaleString()} biospecimen records
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ClinicalBiospecimenSummaryStatistics;
