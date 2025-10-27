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

  return (
    <div className="card h-100">
      <div className="card-header">
        <h5 className="mb-0">
          <i className="bi bi-funnel mr-2" />
          Filters
        </h5>
      </div>
      <div className="card-body">
        {/* Sex Filters - Checkboxes */}
        <div className="mb-4">
          <h6 
            className="mb-2 d-flex justify-content-between align-items-center" 
            style={{ cursor: 'pointer', userSelect: 'none' }}
            onClick={() => toggleGroup('sex')}
          >
            <span>Sex</span>
            <span 
              className="filter-toggle-icon"
              style={{
                transition: 'transform 0.2s ease-in-out',
                transform: expandedGroups.sex ? 'rotate(45deg)' : 'rotate(0deg)',
                fontSize: '1.2rem',
                fontWeight: 'bold'
              }}
            >
              +
            </span>
          </h6>
          {expandedGroups.sex && filterOptions.sexOptions.map((option) => (
            <div key={option} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id={`sex-${option}`}
                checked={filters.sex.includes(option)}
                onChange={(e) =>
                  onCheckboxChange('sex', option, e.target.checked)
                }
              />
              <label className="form-check-label" htmlFor={`sex-${option}`}>
                {option}
              </label>
            </div>
          ))}
        </div>

        {/* Age Group Filters - Checkboxes */}
        <div className="mb-4">
          <h6 
            className="mb-2 d-flex justify-content-between align-items-center" 
            style={{ cursor: 'pointer', userSelect: 'none' }}
            onClick={() => toggleGroup('dmaqc_age_groups')}
          >
            <span>Age Groups</span>
            <span 
              className="filter-toggle-icon"
              style={{
                transition: 'transform 0.2s ease-in-out',
                transform: expandedGroups.dmaqc_age_groups ? 'rotate(45deg)' : 'rotate(0deg)',
                fontSize: '1.2rem',
                fontWeight: 'bold'
              }}
            >
              +
            </span>
          </h6>
          {expandedGroups.dmaqc_age_groups && filterOptions.ageGroupOptions.map((option) => (
            <div key={option} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id={`age-${option}`}
                checked={filters.dmaqc_age_groups.includes(option)}
                onChange={(e) =>
                  onCheckboxChange(
                    'dmaqc_age_groups',
                    option,
                    e.target.checked,
                  )
                }
              />
              <label className="form-check-label" htmlFor={`age-${option}`}>
                {option}
              </label>
            </div>
          ))}
        </div>

        {/* Randomized Group Filters - Checkboxes (changed from radio buttons) */}
        <div className="mb-4">
          <h6 
            className="mb-2 d-flex justify-content-between align-items-center" 
            style={{ cursor: 'pointer', userSelect: 'none' }}
            onClick={() => toggleGroup('random_group_code')}
          >
            <span>Randomized Group</span>
            <span 
              className="filter-toggle-icon"
              style={{
                transition: 'transform 0.2s ease-in-out',
                transform: expandedGroups.random_group_code ? 'rotate(45deg)' : 'rotate(0deg)',
                fontSize: '1.2rem',
                fontWeight: 'bold'
              }}
            >
              +
            </span>
          </h6>
          {expandedGroups.random_group_code && filterOptions.randomGroupOptions.map((option) => (
            <div key={option} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id={`group-${option}`}
                checked={filters.random_group_code.includes(option)}
                onChange={(e) =>
                  onCheckboxChange(
                    'random_group_code',
                    option,
                    e.target.checked,
                  )
                }
              />
              <label
                className="form-check-label"
                htmlFor={`group-${option}`}
              >
                {option}
              </label>
            </div>
          ))}
        </div>

        {/* BMI Group Filters - Checkboxes */}
        <div className="mb-4">
          <h6 
            className="mb-2 d-flex justify-content-between align-items-center" 
            style={{ cursor: 'pointer', userSelect: 'none' }}
            onClick={() => toggleGroup('bmi_group')}
          >
            <span>BMI Group</span>
            <span 
              className="filter-toggle-icon"
              style={{
                transition: 'transform 0.2s ease-in-out',
                transform: expandedGroups.bmi_group ? 'rotate(45deg)' : 'rotate(0deg)',
                fontSize: '1.2rem',
                fontWeight: 'bold'
              }}
            >
              +
            </span>
          </h6>
          {expandedGroups.bmi_group && filterOptions.bmiGroupOptions.map((option) => (
            <div key={option} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id={`bmi-${option}`}
                checked={filters.bmi_group.includes(option)}
                onChange={(e) =>
                  onCheckboxChange('bmi_group', option, e.target.checked)
                }
              />
              <label className="form-check-label" htmlFor={`bmi-${option}`}>
                {option}
              </label>
            </div>
          ))}
        </div>

        {/* Race Filters - Checkboxes */}
        <div className="mb-4">
          <h6 
            className="mb-2 d-flex justify-content-between align-items-center" 
            style={{ cursor: 'pointer', userSelect: 'none' }}
            onClick={() => toggleGroup('race')}
          >
            <span>Race</span>
            <span 
              className="filter-toggle-icon"
              style={{
                transition: 'transform 0.2s ease-in-out',
                transform: expandedGroups.race ? 'rotate(45deg)' : 'rotate(0deg)',
                fontSize: '1.2rem',
                fontWeight: 'bold'
              }}
            >
              +
            </span>
          </h6>
          {expandedGroups.race && filterOptions.raceOptions.map((option) => (
            <div key={option} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id={`race-${option}`}
                checked={filters.race.includes(option)}
                onChange={(e) =>
                  onCheckboxChange('race', option, e.target.checked)
                }
              />
              <label className="form-check-label" htmlFor={`race-${option}`}>
                {option}
              </label>
            </div>
          ))}
        </div>

        {/* Ethnicity Filters - Checkboxes */}
        <div className="mb-4">
          <h6 
            className="mb-2 d-flex justify-content-between align-items-center" 
            style={{ cursor: 'pointer', userSelect: 'none' }}
            onClick={() => toggleGroup('ethnicity')}
          >
            <span>Ethnicity</span>
            <span 
              className="filter-toggle-icon"
              style={{
                transition: 'transform 0.2s ease-in-out',
                transform: expandedGroups.ethnicity ? 'rotate(45deg)' : 'rotate(0deg)',
                fontSize: '1.2rem',
                fontWeight: 'bold'
              }}
            >
              +
            </span>
          </h6>
          {expandedGroups.ethnicity && filterOptions.ethnicityOptions.map((option) => (
            <div key={option} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id={`ethnicity-${option}`}
                checked={filters.ethnicity.includes(option)}
                onChange={(e) =>
                  onCheckboxChange('ethnicity', option, e.target.checked)
                }
              />
              <label className="form-check-label" htmlFor={`ethnicity-${option}`}>
                {option}
              </label>
            </div>
          ))}
        </div>

        {/* Tissue Filters - Checkboxes */}
        <div className="mb-4">
          <h6 
            className="mb-2 d-flex justify-content-between align-items-center" 
            style={{ cursor: 'pointer', userSelect: 'none' }}
            onClick={() => toggleGroup('tissue')}
          >
            <span>Tissue</span>
            <span 
              className="filter-toggle-icon"
              style={{
                transition: 'transform 0.2s ease-in-out',
                transform: expandedGroups.tissue ? 'rotate(45deg)' : 'rotate(0deg)',
                fontSize: '1.2rem',
                fontWeight: 'bold'
              }}
            >
              +
            </span>
          </h6>
          {expandedGroups.tissue && filterOptions.tissueOptions.map((option) => (
            <div key={option} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id={`tissue-${option}`}
                checked={filters.tissue.includes(option)}
                onChange={(e) =>
                  onCheckboxChange('tissue', option, e.target.checked)
                }
              />
              <label className="form-check-label" htmlFor={`tissue-${option}`}>
                {option}
              </label>
            </div>
          ))}
        </div>

        {/* Ome Filters - Checkboxes */}
        <div className="mb-4">
          <h6 
            className="mb-2 d-flex justify-content-between align-items-center" 
            style={{ cursor: 'pointer', userSelect: 'none' }}
            onClick={() => toggleGroup('ome')}
          >
            <span>Ome</span>
            <span 
              className="filter-toggle-icon"
              style={{
                transition: 'transform 0.2s ease-in-out',
                transform: expandedGroups.ome ? 'rotate(45deg)' : 'rotate(0deg)',
                fontSize: '1.2rem',
                fontWeight: 'bold'
              }}
            >
              +
            </span>
          </h6>
          {expandedGroups.ome && filterOptions.omeOptions.map((option) => (
            <div key={option} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id={`ome-${option}`}
                checked={filters.ome.includes(option)}
                onChange={(e) =>
                  onCheckboxChange('ome', option, e.target.checked)
                }
              />
              <label className="form-check-label" htmlFor={`ome-${option}`}>
                {option}
              </label>
            </div>
          ))}
        </div>
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