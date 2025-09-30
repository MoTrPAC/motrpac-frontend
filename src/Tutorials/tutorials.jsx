import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import PageTitle from '../lib/ui/pageTitle';
import ExternalLink from '../lib/ui/externalLink';

import '@styles/license.scss';

function Tutorials() {
  const [language, setLanguage] = useState('English');

  // Function to handle language toggle
  const toggleLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === 'English' ? 'Spanish' : 'English'));
  };

  return (
    <div className="tutorialsPage px-3 px-md-4 mb-3 container">
      <Helmet>
        <html lang="en" />
        <title>Tutorials - MoTrPAC Data Hub</title>
      </Helmet>
      <PageTitle title="Tutorials" />
      <div className="tutorials-content-container">
        <div className="tutorials-summary-container row mb-4">
          <div className="col-12">
            <div className="section-title-container d-flex align-items-center justify-content-between mt-3 mb-2">
              <h3 className="mb-0">{language === 'English' ? 'MoTrPAC Data Hub Overview' : 'Descripción general de MoTrPAC Data Hub'}</h3>
              <button type="button" className="btn btn-link" onClick={toggleLanguage}>
                <i className="bi bi-translate"></i>
                <span className="ml-1">{language === 'English' ? 'Spanish' : 'English'}</span>
              </button>
            </div>
            {language === 'English' ? (
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
