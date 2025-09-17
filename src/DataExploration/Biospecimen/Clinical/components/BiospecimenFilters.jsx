import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { filterUtils } from '../constants/plotOptions';

/**
 * Biospecimen filter controls component
 * Features:
 * - Checkbox filters for sex and age groups (multi-select)
 * - Radio button filters for random_group_code (single-select)
 * - Reset functionality
 */
const BiospecimenFilters = ({
  filters,
  filterOptions,
  onCheckboxChange,
  onRadioChange,
  onResetFilters,
  loading = false,
}) => {
  // Check if filters differ from default state using utility function
  // Memoized to prevent unnecessary recalculations
  const isDefaultState = useMemo(
    () => filterUtils.isDefaultState(filters),
    [filters],
  );

  const hasActiveFilters = !isDefaultState;

  return (
    <div className="card h-100">
      <div className="card-header">
        <h5 className="mb-0">
          <i className="bi bi-funnel mr-2" />
          Filters
        </h5>
      </div>
      <div className="card-body">
        {loading ? (
          <div className="text-center py-3">
            <div
              className="spinner-border spinner-border-sm text-primary"
              role="status"
            >
              <span className="sr-only">Loading filters...</span>
            </div>
          </div>
        ) : (
          <>
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

            {/* Randomized Group Filters - Radio Buttons */}
            <div className="mb-4">
              <h6 className="mb-2">Randomized Group</h6>
              {filterOptions.randomGroupOptions.map((option) => (
                <div key={option} className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="randomGroup"
                    id={`group-${option}`}
                    checked={filters.random_group_code === option}
                    onChange={() => onRadioChange(option)}
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

            {/* Reset Button */}
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={onResetFilters}
              disabled={!hasActiveFilters}
            >
              <i className="bi bi-arrow-clockwise mr-2" />
              Reset to Defaults
            </button>
          </>
        )}
      </div>
    </div>
  );
};

BiospecimenFilters.propTypes = {
  filters: PropTypes.shape({
    sex: PropTypes.array.isRequired,
    dmaqc_age_groups: PropTypes.array.isRequired,
    random_group_code: PropTypes.string.isRequired,
  }).isRequired,
  filterOptions: PropTypes.shape({
    sexOptions: PropTypes.array.isRequired,
    ageGroupOptions: PropTypes.array.isRequired,
    randomGroupOptions: PropTypes.array.isRequired,
  }).isRequired,
  onCheckboxChange: PropTypes.func.isRequired,
  onRadioChange: PropTypes.func.isRequired,
  onResetFilters: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default BiospecimenFilters;
