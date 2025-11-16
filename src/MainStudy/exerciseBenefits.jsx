import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import ReactWordcloud from 'react-wordcloud';
import PageTitle from '../lib/ui/pageTitle';
import ExternalLink from '../lib/ui/externalLink';
import exerciseBenefitsReferenceData from './exerciseBenefitsReferenceData';
import {
  getTranslations,
  getLanguageFromURL,
  DEFAULT_LANGUAGE,
} from './exerciseBenefitsTranslations';
import LanguageSelector from './components/LanguageSelector';

import '@styles/mainStudyPage.scss';

/**
 * ExerciseBenefits Component
 * 
 * Displays the benefits of exercise with multi-language support (English, Spanish, French).
 * Language can be selected via dropdown or URL parameter (?lang=en|es|fr).
 */
function ExerciseBenefits() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get initial language from URL or default to English
  const [currentLanguage, setCurrentLanguage] = useState(() => 
    getLanguageFromURL(searchParams)
  );

  // Get translations for current language (memoized for performance)
  const translations = useMemo(() => 
    getTranslations(currentLanguage),
    [currentLanguage]
  );

  // Update language when URL changes
  useEffect(() => {
    const urlLang = getLanguageFromURL(searchParams);
    if (urlLang !== currentLanguage) {
      setCurrentLanguage(urlLang);
    }
  }, [searchParams, currentLanguage]);

  /**
   * Handle language change from selector
   */
  const handleLanguageChange = (newLanguage) => {
    setCurrentLanguage(newLanguage);
    
    // Update URL with new language parameter
    const newSearchParams = new URLSearchParams(searchParams);
    if (newLanguage === DEFAULT_LANGUAGE) {
      // Remove lang parameter for default language (cleaner URLs)
      newSearchParams.delete('lang');
    } else {
      newSearchParams.set('lang', newLanguage);
    }
    setSearchParams(newSearchParams, { replace: true });
  };
  // Word cloud configuration
  const wordCloudOptions = {
    rotations: 0,
    rotationAngles: [0],
    fontFamily: 'sans-serif',
    fontSizes: [20, 60],
    fontWeight: 'bold',
    padding: 1,
    deterministic: false,
    enableTooltip: false,
    scale: 'sqrt',
    spiral: 'archimedean',
    transitionDuration: 1000,
  };

  // Generate random value for word cloud (memoized to avoid unnecessary recalculations)
  const getRandomInt = (min, max) => 
    Math.floor(Math.random() * (max - min + 1)) + min;

  // Prepare words for word cloud (memoized for performance)
  const words = useMemo(() => 
    translations.benefits.map((benefit) => ({
      text: benefit,
      value: getRandomInt(100, 800),
    })),
    [translations.benefits]
  );

  return (
    <div className="exerciseBenefitsPage px-3 px-md-4 mb-3 container">
      <Helmet>
        <html lang={currentLanguage} />
        <title>{translations.metaTitle}</title>
      </Helmet>
      
      <div className="d-flex justify-content-between align-items-start mb-3">
        <PageTitle title={translations.pageTitle} />
        <LanguageSelector 
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
        />
      </div>
      
      <div className="exercise-benefits-page-container">
        <div className="exercise-benefits-page-content-container row mb-4">
          <div className="col-12">
            <p className="lead">
              {translations.leadText}
            </p>
          </div>
          <div className="exercise-benefits-cloud col-12">
            <ReactWordcloud words={words} options={wordCloudOptions} />
          </div>
        </div>
        
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th scope="col">{translations.tableHeaders.healthBenefit}</th>
                <th scope="col">{translations.tableHeaders.evidence}</th>
              </tr>
            </thead>
            <tbody>
              {translations.benefitsData.map((benefit) => (
                <tr key={`${benefit.title}`}>
                  <th scope="row">{benefit.title}</th>
                  <td>
                    {benefit.evidence}
                    <sup>
                      [
                      <a href={`#cite-${benefit.citationNo}`}>
                        {benefit.citationNo}
                      </a>
                      ]
                    </sup>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>
            {translations.conclusionText}
          </p>
        </div>
        
        <div className="exercise-benefits-page-content-container row mt-3 mb-4">
          <div className="col-12">
            <h5 className="border-bottom mb-3 pb-2">
              {translations.referencesTitle}
            </h5>
            <ol className="cexercise-benefits-itation-list">
              {exerciseBenefitsReferenceData.map((reference) => (
                <li key={`${reference.doi}`} id={`cite-${reference.citationNo}`}>
                  <p>
                    <span className="font-weight-bold">{reference.title}</span>
                    <br />
                    {`${reference.author}.`}
                    <br />
                    {`${reference.journal}.`}
                    {' '}
                    <em>{`${reference.publicationIssue}.`}</em>
                    <br />
                    doi:
                    {' '}
                    <ExternalLink
                      to={`https://doi.org/${reference.doi}`}
                      label={reference.doi}
                    />
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExerciseBenefits;
