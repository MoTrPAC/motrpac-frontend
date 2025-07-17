import React from 'react';
import PropTypes from 'prop-types';

function Dropdown({ 
  id,
  label, 
  options, 
  selectedOption, 
  onChange, 
  placeholder = "Select an option",
  disabled = false,
  className = ""
}) {
  return (
    <div className={`form-group ${className}`}>
      <label htmlFor={id} className="font-weight-bold text-muted">{label}</label>
      <select
        id={id}
        className="form-control"
        value={selectedOption}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

Dropdown.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
  selectedOption: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default Dropdown;
