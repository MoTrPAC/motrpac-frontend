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
  id = 'language-selector',
  currentLanguage = '',
  languages = [],
  onLanguageChange,
  ariaLabel = 'Select page language',
}) {
  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    onLanguageChange(newLanguage);
  };

  if (languages.length <= 1) {
    return null; // No languages to display
  }

  return (
    <div className="language-selector">
      <label htmlFor={id} className="language-selector-label">
        <i className="bi bi-globe" aria-hidden="true" />
        <span className="sr-only">{ariaLabel}</span>
      </label>
      <select
        id={id}
        className="language-selector-dropdown form-control form-control-sm"
        value={currentLanguage}
        onChange={handleLanguageChange}
        aria-label={ariaLabel}
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
  id: PropTypes.string.isRequired,
  currentLanguage: PropTypes.string.isRequired,
  languages: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string.isRequired,
      nativeName: PropTypes.string.isRequired,
    })
  ).isRequired,
  onLanguageChange: PropTypes.func.isRequired,
  ariaLabel: PropTypes.string.isRequired,
};

export default LanguageSelector;
