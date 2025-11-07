import React from 'react';
import PropTypes from 'prop-types';
import { SUPPORTED_LANGUAGES } from '../exerciseBenefitsTranslations';
import './languageSelector.scss';

/**
 * LanguageSelector Component
 * 
 * Displays a language selection dropdown that allows users to switch
 * between supported languages (English, Spanish, French).
 * 
 * @param {string} currentLanguage - Currently selected language code
 * @param {function} onLanguageChange - Callback function when language is changed
 */
function LanguageSelector({ currentLanguage, onLanguageChange }) {
  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    onLanguageChange(newLanguage);
  };

  return (
    <div className="language-selector">
      <label htmlFor="language-select" className="language-selector-label">
        <span className="language-icon" aria-hidden="true">🌐</span>
        <span className="sr-only">Select Language</span>
      </label>
      <select
        id="language-select"
        className="language-selector-dropdown form-control form-control-sm"
        value={currentLanguage}
        onChange={handleLanguageChange}
        aria-label="Select page language"
      >
        {Object.values(SUPPORTED_LANGUAGES).map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.nativeName}
          </option>
        ))}
      </select>
    </div>
  );
}

LanguageSelector.propTypes = {
  currentLanguage: PropTypes.string.isRequired,
  onLanguageChange: PropTypes.func.isRequired,
};

export default LanguageSelector;
