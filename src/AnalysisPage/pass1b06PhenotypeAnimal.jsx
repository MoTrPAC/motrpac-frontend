import React from 'react';
import { Helmet } from 'react-helmet';
import PageTitle from '../lib/ui/pageTitle';
import PhenotypePass1b06Rats from './Phenotype/pass1b06Rats';
import PhenotypePass1a06Rats from './Phenotype/pass1a06Rats';

/**
 * Functional component to render animal pass1b-06 phenotype data visualization
 *
 * @return {Object} JSX representation of the animal phenotype data visualization
 */
function Pass1b06PhenotypeAnimal() {
  return (
    <div className="analysisPhenotypePage px-3 px-md-4 mb-3 w-100" data-testid="animal-data-analysis">
      <Helmet>
        <html lang="en" />
        <title>Phenotypic Data Analysis - MoTrPAC Data Hub</title>
      </Helmet>
      <PageTitle title="Phenotypic Data Analysis" />
      <div className="phenotype-data-analysis-container">
        {/* nav tabs */}
        <ul className="nav nav-pills phenotype-data-nav mt-3 border-bottom" id="pills-tab" role="tablist">
          <li className="nav-item font-weight-bold" role="presentation">
            <button
              type="button"
              className="nav-link active d-flex align-items-center"
              id="pass1b06_tab"
              data-toggle="pill"
              data-target="#pass1b06"
              role="tab"
              aria-controls="pass1b06"
              aria-selected="true"
            >
              <span className="material-icons mr-1">pest_control_rodent</span>
              <span className="nav-label">Endurance Trained Young Adult Rats</span>
            </button>
          </li>
          <li className="nav-item font-weight-bold" role="presentation">
            <button
              type="button"
              className="nav-link d-flex align-items-center"
              id="pass1a06_tab"
              data-toggle="pill"
              data-target="#pass1a06"
              role="tab"
              aria-controls="pass1a06"
              aria-selected="false"
            >
              <span className="material-icons mr-1">pest_control_rodent</span>
              <span className="nav-label">Acute Exercise Young Adult Rats</span>
            </button>
          </li>
        </ul>
        {/* tab panes */}
        <div className="tab-content phenotype-data-tab-content mt-3">
          <div
            className="tab-pane fade show active"
            id="pass1b06"
            role="tabpanel"
            aria-labelledby="pass1b06_tab"
          >
            <PhenotypePass1b06Rats />
          </div>
          <div
            className="tab-pane fade"
            id="pass1a06"
            role="tabpanel"
            aria-labelledby="pass1a06_tab"
          >
            <PhenotypePass1a06Rats />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pass1b06PhenotypeAnimal;
