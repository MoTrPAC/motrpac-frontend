# Exercise Benefits Multi-Language Support

This document describes the implementation of multi-language support for the Exercise Benefits page.

## Overview

The Exercise Benefits page now supports three languages:
- **English (en)** - Default language
- **Spanish (es)**
- **French (fr)**

## Features

### Language Selection
- A language selector dropdown appears in the top-right corner of the page
- Users can switch between English, Spanish, and French
- The selected language is persisted in the URL as a query parameter (`?lang=en|es|fr`)
- Shareable/bookmarkable URLs with language preferences

### URL Parameters
- `?lang=en` - Display page in English
- `?lang=es` - Display page in Spanish
- `?lang=fr` - Display page in French
- No parameter or invalid language code - Defaults to English

### Translated Content
All page content is translated including:
- Page title and meta tags
- Lead text introduction
- Word cloud of benefits
- Table headers (Health Benefit, Evidence)
- All benefit descriptions and evidence text
- References section header
- Conclusion text

## Architecture

### Files Structure

```
src/MainStudy/
├── exerciseBenefits.jsx              # Main page component
├── exerciseBenefitsTranslations.js   # Translation data and utilities
├── exerciseBenefitsData.js           # Original English data (kept for backward compatibility)
├── exerciseBenefitsReferenceData.js  # Reference citations (language-independent)
├── components/
│   ├── LanguageSelector.jsx          # Language selector component
│   └── languageSelector.scss         # Language selector styles
└── __test__/
    ├── exerciseBenefits.test.jsx             # Page component tests
    ├── exerciseBenefitsTranslations.test.js  # Translation utilities tests
    └── LanguageSelector.test.jsx             # Language selector tests
```

### Translation System

The translation system uses a **Factory Pattern** for retrieving translations:

```javascript
import { getTranslations } from './exerciseBenefitsTranslations';

const translations = getTranslations('es'); // Get Spanish translations
```

**Key Functions:**
- `getTranslations(lang)` - Returns translation object for specified language
- `isLanguageSupported(lang)` - Checks if a language code is supported
- `getLanguageFromURL(searchParams)` - Extracts and validates language from URL parameters

### Performance Optimizations

1. **Memoization**: React hooks (`useMemo`) are used to cache translations and word cloud data
2. **Efficient re-renders**: Only re-render when language changes
3. **DRY principle**: Single source of truth for all translations
4. **URL state management**: Uses browser history API for language persistence

### Component Structure

```jsx
ExerciseBenefits Component
├── Language state management (useState, useEffect)
├── URL parameter synchronization (useSearchParams)
├── Translation retrieval (getTranslations)
├── Memoized word cloud data
└── Renders:
    ├── LanguageSelector
    ├── PageTitle
    ├── WordCloud
    ├── Benefits Table
    └── References
```

## Adding New Languages

To add a new language (e.g., German):

1. **Add language configuration** in `exerciseBenefitsTranslations.js`:
```javascript
export const SUPPORTED_LANGUAGES = {
  en: { code: 'en', name: 'English', nativeName: 'English' },
  es: { code: 'es', name: 'Spanish', nativeName: 'Español' },
  fr: { code: 'fr', name: 'French', nativeName: 'Français' },
  de: { code: 'de', name: 'German', nativeName: 'Deutsch' }, // New language
};
```

2. **Add translation data**:
```javascript
const translations = {
  en: { /* existing */ },
  es: { /* existing */ },
  fr: { /* existing */ },
  de: { // New translations
    pageTitle: 'Vorteile von Bewegung',
    metaTitle: 'Vorteile von Bewegung - MoTrPAC Data Hub',
    // ... all other translations
  },
};
```

3. **Add tests** for the new language in the test files

## Testing

Comprehensive test coverage includes:
- Translation retrieval and fallback logic
- Language selector UI interaction
- URL parameter handling
- Component rendering for all languages
- Cross-language consistency validation

Run tests:
```bash
yarn test src/MainStudy/__test__
```

## Browser Support

The implementation uses standard Web APIs:
- URLSearchParams (supported in all modern browsers)
- React Router v6 hooks
- React 18 features (useMemo, useState, useEffect)

## Accessibility

- Language selector has proper ARIA labels
- HTML lang attribute is updated for each language
- Semantic HTML structure maintained across all languages
- Screen reader friendly

## SEO Considerations

- Document title updated for each language
- HTML lang attribute set correctly
- Clean URLs with optional language parameter
- Each language version is shareable/bookmarkable

## Future Enhancements

Potential improvements:
- Browser language detection for initial load
- Persistent language preference (localStorage)
- Analytics tracking for language selection
- Additional languages based on user demand
- Translation management system for easier updates
