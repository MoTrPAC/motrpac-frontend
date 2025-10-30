import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Biospecimen filter controls component
 * Features:
 * - Checkbox filters for sex, age groups, and randomized groups (multi-select)
 * - Persistent UI that remains stable during data loading
 * - Collapsible filter groups with animated expand/collapse icons
 */
const BiospecimenFilters = ({
  filters,
  filterOptions,
  onCheckboxChange,
}) => {
  // Track expanded/collapsed state for each filter group
  const [expandedGroups, setExpandedGroups] = useState({
    sex: false,
    dmaqc_age_groups: false,
    random_group_code: false,
    bmi_group: false,
    race: false,
    ethnicity: false,
    tissue: false,
    ome: false,
  });

  const toggleGroup = (groupKey) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  // Data-driven filter configuration
  // Each filter group is defined once with its key, label, and options
  const filterConfigs = [
    {
      key: 'sex',
      label: 'Sex',
      filterKey: 'sex',
      optionsKey: 'sexOptions',
    },
    {
      key: 'dmaqc_age_groups',
      label: 'Age Groups',
      filterKey: 'dmaqc_age_groups',
      optionsKey: 'ageGroupOptions',
    },
    {
      key: 'random_group_code',
      label: 'Randomized Group',
      filterKey: 'random_group_code',
      optionsKey: 'randomGroupOptions',
    },
    {
      key: 'bmi_group',
      label: 'BMI Group',
      filterKey: 'bmi_group',
      optionsKey: 'bmiGroupOptions',
    },
    {
      key: 'race',
      label: 'Race',
      filterKey: 'race',
      optionsKey: 'raceOptions',
    },
    {
      key: 'ethnicity',
      label: 'Ethnicity',
      filterKey: 'ethnicity',
      optionsKey: 'ethnicityOptions',
    },
    {
      key: 'tissue',
      label: 'Tissue',
      filterKey: 'tissue',
      optionsKey: 'tissueOptions',
    },
    {
      key: 'ome',
      label: 'Ome',
      filterKey: 'ome',
      optionsKey: 'omeOptions',
    },
  ];

  // Reusable filter group renderer
  const renderFilterGroup = ({ key, label, filterKey, optionsKey }) => {
    const options = filterOptions[optionsKey] || [];
    const selectedFilters = filters[filterKey] || [];

    return (
      <div key={key} className="mb-3">
        <h6 
          className="mb-1 d-flex justify-content-between align-items-center" 
          style={{ cursor: 'pointer', userSelect: 'none' }}
          onClick={() => toggleGroup(key)}
        >
          <span>{label}</span>
          <span 
            className="filter-toggle-icon"
            style={{
              transition: 'transform 0.2s ease-in-out',
              transform: expandedGroups[key] ? 'rotate(45deg)' : 'rotate(0deg)',
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}
          >
            +
          </span>
        </h6>
        {expandedGroups[key] && options.map((option) => (
          <div key={option} className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id={`${key}-${option}`}
              checked={selectedFilters.includes(option)}
              onChange={(e) =>
                onCheckboxChange(filterKey, option, e.target.checked)
              }
            />
            <label className="form-check-label" htmlFor={`${key}-${option}`}>
              {option}
            </label>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="card h-100">
      <div className="card-header">
        <h5 className="mb-0">
          <i className="bi bi-funnel mr-2" />
          Cohort Selector
        </h5>
      </div>
      <div className="card-body">
        {/* Render all filter groups using the data-driven configuration */}
        {filterConfigs.map(renderFilterGroup)}
      </div>
    </div>
  );
};

BiospecimenFilters.propTypes = {
  filters: PropTypes.shape({
    sex: PropTypes.array.isRequired,
    dmaqc_age_groups: PropTypes.array.isRequired,
    random_group_code: PropTypes.array.isRequired,
    bmi_group: PropTypes.array.isRequired,
    race: PropTypes.array.isRequired,
    ethnicity: PropTypes.array.isRequired,
    tissue: PropTypes.array.isRequired,
    ome: PropTypes.array.isRequired,
  }).isRequired,
  filterOptions: PropTypes.shape({
    sexOptions: PropTypes.array.isRequired,
    ageGroupOptions: PropTypes.array.isRequired,
    randomGroupOptions: PropTypes.array.isRequired,
    bmiGroupOptions: PropTypes.array.isRequired,
    raceOptions: PropTypes.array.isRequired,
    ethnicityOptions: PropTypes.array.isRequired,
    tissueOptions: PropTypes.array.isRequired,
    omeOptions: PropTypes.array.isRequired,
  }).isRequired,
  onCheckboxChange: PropTypes.func.isRequired,
};

export default BiospecimenFilters;