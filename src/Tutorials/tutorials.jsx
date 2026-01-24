import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import PageTitle from '../lib/ui/pageTitle';
import ExternalLink from '../lib/ui/externalLink';

import '@styles/license.scss';

const LANG_EN = 'en';
const LANG_ES = 'es';

function Tutorials() {
  const [searchParams, setSearchParams] = useSearchParams();
  const language = searchParams.get('lang') === LANG_ES ? LANG_ES : LANG_EN;
  const toggleLanguage = (lang) => {
    setSearchParams(prev => {
      if (lang === LANG_EN) {
        prev.delete('lang');
      } else {
        prev.set('lang', lang);
      }
      return prev;
    });
  };

  return (
    <div className="tutorialsPage px-3 px-md-4 mb-3 container">
      <Helmet>
        <html lang={language} />
        <title>Tutorials - MoTrPAC Data Hub</title>
      </Helmet>
      <PageTitle title="Tutorials" />
      <div className="tutorials-content-container">
        <div className="tutorials-summary-container row mb-4">
          <div className="col-12">
            <div className="section-title-container d-flex align-items-center justify-content-between mt-3 mb-2">
              <h3 className="mb-0">{language === LANG_EN ? 'MoTrPAC Data Hub Overview' : 'Descripción General del Centro de Datos de MoTrPAC'}</h3>
              {/* Language Toggle */}
              <div className="btn-group" role="group" aria-label="Language selection">
                <button
                  type="button"
                  className={`btn btn-sm ${language === LANG_EN ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => toggleLanguage(LANG_EN)}
                  aria-pressed={language === LANG_EN}
                >
                  English
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${language === LANG_ES ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => toggleLanguage(LANG_ES)}
                  aria-pressed={language === LANG_ES}
                >
                  Español
                </button>
              </div>
            </div>
            {language === LANG_EN ? (
              <div className="video-tutorial-container">
                <p className="lead">
                  The following tutorial video (also available in Spanish) is designed
                  to help you get started with the MoTrPAC study and the exploration
                  of the Data Hub. Please check out our{' '}
                  <ExternalLink
                    to="https://www.youtube.com/@MoTrPAC-Data-Hub"
                    label="collection of videos on YouTube"
                  />
                  {' '}
                  and reach out to us with any
                  {' '}
                  <Link to="/contact">questions or comments</Link>
                  .
                </p>
                <div
                  className="embedContainer embed-responsive"
                  id="tutorial-video-iframe-container"
                >
                  <LiteYouTubeEmbed
                    id="3zHnzUMo_vw"
                    params="autoplay=0&cc_load_policy=1"
                    poster="maxresdefault"
                    title="Data Hub Tutorial Video"
                    iframeClass="embed-responsive-item border border-dark"
                  />
                </div>
              </div>
            ) : (
              <div className="video-tutorial-container">
                <p className="lead">
                  El siguiente video tutorial (también disponible en inglés) está diseñado
                  para ayudarte a comenzar con el estudio MoTrPAC y la exploración del
                  Centro de Datos. Por favor, consulta nuestra{' '}
                  <ExternalLink
                    to="https://www.youtube.com/@MoTrPAC-Data-Hub"
                    label="colección de videos en YouTube"
                  />
                  {' '}
                  y contáctanos si tienes alguna
                  {' '}
                  <Link to="/contact">pregunta o comentario</Link>
                  .
                </p>
                <div
                  className="embedContainer embed-responsive"
                  id="tutorial-video-iframe-container"
                >
                  <LiteYouTubeEmbed
                    id="G5zZ8r1lfvo"
                    params="autoplay=0&cc_load_policy=1"
                    poster="maxresdefault"
                    title="Data Hub Tutorial Video (Spanish)"
                    iframeClass="embed-responsive-item border border-dark"
                  />
                </div>
              </div>
            )}
          </div>
          <div className="col-12 mt-4">
            <h3 className="mt-4">MoTrPAC R packages</h3>
            <p className="lead">
              <ExternalLink
                to="https://motrpac.github.io/MotrpacWorkshops/docs/articles/rat-endurance-6m.html"
                label="MoTrPAC R Packages from the Endurance Training in Young Rats Study"
              />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tutorials;
