import { describe, it, expect } from 'vitest';
import {
  getTranslations,
  isLanguageSupported,
  getLanguageFromURL,
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
} from '../exerciseBenefitsTranslations';

describe('exerciseBenefitsTranslations', () => {
  describe('getTranslations', () => {
    it('should return English translations for "en"', () => {
      const translations = getTranslations('en');
      expect(translations.pageTitle).toBe('Benefits of Exercise');
      expect(translations.leadText).toContain('Regular physical activity');
      expect(translations.benefits).toBeInstanceOf(Array);
      expect(translations.benefitsData).toBeInstanceOf(Array);
    });

    it('should return Spanish translations for "es"', () => {
      const translations = getTranslations('es');
      expect(translations.pageTitle).toBe('Beneficios del Ejercicio');
      expect(translations.leadText).toContain('actividad física regular');
      expect(translations.benefits).toBeInstanceOf(Array);
      expect(translations.benefitsData).toBeInstanceOf(Array);
    });

    it('should return French translations for "fr"', () => {
      const translations = getTranslations('fr');
      expect(translations.pageTitle).toBe('Bienfaits de l\'Exercice');
      expect(translations.leadText).toContain('activité physique régulière');
      expect(translations.benefits).toBeInstanceOf(Array);
      expect(translations.benefitsData).toBeInstanceOf(Array);
    });

    it('should default to English for unsupported language', () => {
      const translations = getTranslations('de'); // German not supported
      expect(translations.pageTitle).toBe('Benefits of Exercise');
    });

    it('should default to English for null/undefined language', () => {
      const translations1 = getTranslations(null);
      const translations2 = getTranslations(undefined);
      expect(translations1.pageTitle).toBe('Benefits of Exercise');
      expect(translations2.pageTitle).toBe('Benefits of Exercise');
    });

    it('should be case-insensitive', () => {
      const translations = getTranslations('ES');
      expect(translations.pageTitle).toBe('Beneficios del Ejercicio');
    });

    it('should have consistent structure across all languages', () => {
      const languages = ['en', 'es', 'fr'];
      
      languages.forEach((lang) => {
        const translations = getTranslations(lang);
        
        // Check required properties exist
        expect(translations).toHaveProperty('pageTitle');
        expect(translations).toHaveProperty('metaTitle');
        expect(translations).toHaveProperty('leadText');
        expect(translations).toHaveProperty('tableHeaders');
        expect(translations).toHaveProperty('referencesTitle');
        expect(translations).toHaveProperty('conclusionText');
        expect(translations).toHaveProperty('benefits');
        expect(translations).toHaveProperty('benefitsData');
        
        // Check table headers structure
        expect(translations.tableHeaders).toHaveProperty('healthBenefit');
        expect(translations.tableHeaders).toHaveProperty('evidence');
        
        // Check benefits is an array with items
        expect(Array.isArray(translations.benefits)).toBe(true);
        expect(translations.benefits.length).toBeGreaterThan(0);
        
        // Check benefitsData structure
        expect(Array.isArray(translations.benefitsData)).toBe(true);
        expect(translations.benefitsData.length).toBeGreaterThan(0);
        
        translations.benefitsData.forEach((benefit) => {
          expect(benefit).toHaveProperty('title');
          expect(benefit).toHaveProperty('evidence');
          expect(benefit).toHaveProperty('citationNo');
          expect(typeof benefit.citationNo).toBe('number');
        });
      });
    });
  });

  describe('isLanguageSupported', () => {
    it('should return true for supported languages', () => {
      expect(isLanguageSupported('en')).toBe(true);
      expect(isLanguageSupported('es')).toBe(true);
      expect(isLanguageSupported('fr')).toBe(true);
    });

    it('should return true for uppercase language codes', () => {
      expect(isLanguageSupported('EN')).toBe(true);
      expect(isLanguageSupported('ES')).toBe(true);
      expect(isLanguageSupported('FR')).toBe(true);
    });

    it('should return false for unsupported languages', () => {
      expect(isLanguageSupported('de')).toBe(false);
      expect(isLanguageSupported('zh')).toBe(false);
      expect(isLanguageSupported('ja')).toBe(false);
    });

    it('should return false for null/undefined', () => {
      expect(isLanguageSupported(null)).toBe(false);
      expect(isLanguageSupported(undefined)).toBe(false);
    });
  });

  describe('getLanguageFromURL', () => {
    it('should return language from URL parameters', () => {
      const searchParams = new URLSearchParams('?lang=es');
      expect(getLanguageFromURL(searchParams)).toBe('es');
    });

    it('should return default language when no parameter', () => {
      const searchParams = new URLSearchParams('');
      expect(getLanguageFromURL(searchParams)).toBe(DEFAULT_LANGUAGE);
    });

    it('should return default language for unsupported language', () => {
      const searchParams = new URLSearchParams('?lang=de');
      expect(getLanguageFromURL(searchParams)).toBe(DEFAULT_LANGUAGE);
    });

    it('should be case-insensitive', () => {
      const searchParams = new URLSearchParams('?lang=FR');
      expect(getLanguageFromURL(searchParams)).toBe('fr');
    });

    it('should handle multiple query parameters', () => {
      const searchParams = new URLSearchParams('?foo=bar&lang=es&baz=qux');
      expect(getLanguageFromURL(searchParams)).toBe('es');
    });
  });

  describe('SUPPORTED_LANGUAGES', () => {
    it('should have correct structure', () => {
      expect(SUPPORTED_LANGUAGES).toHaveProperty('en');
      expect(SUPPORTED_LANGUAGES).toHaveProperty('es');
      expect(SUPPORTED_LANGUAGES).toHaveProperty('fr');
      
      Object.values(SUPPORTED_LANGUAGES).forEach((lang) => {
        expect(lang).toHaveProperty('code');
        expect(lang).toHaveProperty('name');
        expect(lang).toHaveProperty('nativeName');
      });
    });
  });

  describe('Translation content consistency', () => {
    it('should have same number of benefits in all languages', () => {
      const enBenefits = getTranslations('en').benefits;
      const esBenefits = getTranslations('es').benefits;
      const frBenefits = getTranslations('fr').benefits;
      
      expect(enBenefits.length).toBe(esBenefits.length);
      expect(enBenefits.length).toBe(frBenefits.length);
    });

    it('should have same number of benefitsData in all languages', () => {
      const enData = getTranslations('en').benefitsData;
      const esData = getTranslations('es').benefitsData;
      const frData = getTranslations('fr').benefitsData;
      
      expect(enData.length).toBe(esData.length);
      expect(enData.length).toBe(frData.length);
    });

    it('should have matching citation numbers across languages', () => {
      const enData = getTranslations('en').benefitsData;
      const esData = getTranslations('es').benefitsData;
      const frData = getTranslations('fr').benefitsData;
      
      for (let i = 0; i < enData.length; i++) {
        expect(enData[i].citationNo).toBe(esData[i].citationNo);
        expect(enData[i].citationNo).toBe(frData[i].citationNo);
      }
    });
  });
});
