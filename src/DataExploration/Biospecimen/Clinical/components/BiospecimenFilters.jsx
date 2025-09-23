import React from 'react';
import PropTypes from 'prop-types';

/**
 * Biospecimen filter controls component
 * Features:
 * - Checkbox filters for sex, age groups, and randomized groups (multi-select)
 * - Persistent UI that remains stable during data loading
 */
const BiospecimenFilters = ({
  filters,
  filterOptions,
  onCheckboxChange,
}) => {
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
          <h6 className="mb-2">Sex</h6>
          {filterOptions.sexOptions.map((option) => (
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
          <h6 className="mb-2">Age Groups</h6>
          {filterOptions.ageGroupOptions.map((option) => (
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
          <h6 className="mb-2">Randomized Group</h6>
          {filterOptions.randomGroupOptions.map((option) => (
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
      </div>
    </div>
  );
};

BiospecimenFilters.propTypes = {
  filters: PropTypes.shape({
    sex: PropTypes.array.isRequired,
    dmaqc_age_groups: PropTypes.array.isRequired,
    random_group_code: PropTypes.array.isRequired, // Changed from string to array
  }).isRequired,
  filterOptions: PropTypes.shape({
    sexOptions: PropTypes.array.isRequired,
    ageGroupOptions: PropTypes.array.isRequired,
    randomGroupOptions: PropTypes.array.isRequired,
  }).isRequired,
  onCheckboxChange: PropTypes.func.isRequired,
};

export default BiospecimenFilters;
