import React from 'react';
import PropTypes from 'prop-types';

import '@styles/languageSelector.scss';

/**
 * LanguageSelector Component
 *
 * A reusable language selection dropdown that allows users to switch
 * between supported languages. Can be configured with any set of languages.
 *
 * @example
 * // Simple usage with 2 languages
 * const languages = [
 *   { code: 'en', nativeName: 'English' },
 *   { code: 'es', nativeName: 'Español' },
 * ];
 * <LanguageSelector
 *   currentLanguage="en"
 *   languages={languages}
 *   onLanguageChange={(lang) => setLanguage(lang)}
 * />
 *
 * @example
 * // With 3+ languages
 * const languages = [
 *   { code: 'en', nativeName: 'English' },
 *   { code: 'es', nativeName: 'Español' },
 *   { code: 'fr', nativeName: 'Français' },
 * ];
 * <LanguageSelector
 *   currentLanguage={currentLang}
 *   languages={languages}
 *   onLanguageChange={handleLanguageChange}
 * />
 *
 * @param {string} currentLanguage - Currently selected language code
 * @param {Array} languages - Array of language objects with code and nativeName
 * @param {function} onLanguageChange - Callback function when language is changed
 * @param {string} [ariaLabel] - Optional custom aria-label for accessibility
 */
function LanguageSelector({
  currentLanguage,
  languages,
  onLanguageChange,
  ariaLabel,
}) {
  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    onLanguageChange(newLanguage);
  };

  return (
    <div className="language-selector">
      <label htmlFor="language-select" className="language-selector-label">
        <i className="bi bi-globe" aria-hidden="true" />
        <span className="sr-only">Select Language</span>
      </label>
      <select
        id="language-select"
        className="language-selector-dropdown form-control form-control-sm"
        value={currentLanguage}
        onChange={handleLanguageChange}
        aria-label={ariaLabel || 'Select page language'}
      >
        {languages.map((lang) => (
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
  languages: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string.isRequired,
      nativeName: PropTypes.string.isRequired,
    })
  ).isRequired,
  onLanguageChange: PropTypes.func.isRequired,
  ariaLabel: PropTypes.string,
};

LanguageSelector.defaultProps = {
  ariaLabel: 'Select page language',
};

export default LanguageSelector;
