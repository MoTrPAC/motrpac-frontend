import React from 'react';
import { Helmet } from 'react-helmet';
import PageTitle from '../lib/ui/pageTitle';
import IconSet from '../lib/iconSet';

import '@styles/codeRepo.scss';

const repositories = {
  pipelines: [
    {
      name: 'MoTrPAC/motrpac-proteomics-pipeline',
      url: 'https://github.com/MoTrPAC/motrpac-proteomics-pipeline',
    },
    {
      name: 'MoTrPAC/motrpac-rna-seq-pipeline',
      url: 'https://github.com/MoTrPAC/motrpac-rna-seq-pipeline',
    },
    {
      name: 'MoTrPAC/motrpac-atac-seq-pipeline',
      url: 'https://github.com/MoTrPAC/motrpac-atac-seq-pipeline',
    },
    {
      name: 'MoTrPAC/motrpac-rrbs-pipeline',
      url: 'https://github.com/MoTrPAC/motrpac-rrbs-pipeline',
    },
  ],
  qc: [
    {
      name: 'MoTrPAC/MotrpacRatTraining6moQCRep',
      url: 'https://github.com/MoTrPAC/MotrpacRatTraining6moQCRep',
    },
    {
      name: 'MoTrPAC/MotrpacBicQC',
      url: 'https://github.com/MoTrPAC/MotrpacBicQC',
    },
  ],
  analysis: [
    {
      name: 'MoTrPAC/MotrpacRatTraining6moQCRep',
      url: 'https://github.com/MoTrPAC/MotrpacRatTraining6moQCRep',
    },
    {
      name: 'MoTrPAC/MotrpacRatTraining6mo',
      url: 'https://github.com/MoTrPAC/MotrpacRatTraining6mo',
    },
    {
      name: 'MoTrPAC/MotrpacRatTraining6moData',
      url: 'https://github.com/MoTrPAC/MotrpacRatTraining6moData',
    },
  ],
};

/**
 * Renders the Code Repositories page.
 *
 * @returns {object} JSX representation of the Code Repositories component
 */
export function CodeRepositories() {
  // function to render repo component
  function renderRepoComponent(componentName, repos) {
    return (
      <div className="code-repo-container mb-4">
        <div className="component shadow-sm">
          <h4 className="material-icons component-icon">laptop</h4>
          <h3 className="component-title">{componentName}</h3>
        </div>
        <div className="component-repos-connector mt-2">
          <span className="vertical-line" />
        </div>
        <ul className="component-repos">
          {repos.map((repo) => (
            <li key={repo.name}>
              <i className="bi-github repo-icon" />
              <a
                className="ml-1"
                href={repo.url}
                target="_blank"
                rel="noreferrer"
              >
                {repo.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // function to render edge component
  function renderEdgeComponent() {
    return (
      <div className="edge component-connector">
        <img src={IconSet.ArrowRightAnimated} alt="arrow" />
      </div>
    );
  }

  return (
    <div className="codeRepoPage px-3 px-md-4 mb-3 container">
      <Helmet>
        <html lang="en" />
        <title>Code Repositories - MoTrPAC Data Hub</title>
      </Helmet>
      <PageTitle title="Code Repositories" />
      <div className="code-repo-content-container">
        <div className="code-repo-summary-container row">
          <div className="lead col-12">
            Explore the source codes integral to the workflow of the MoTrPAC
            data, from ingestion to analysis.
          </div>
        </div>
        <div className="code-repo-content-container d-flex align-items-start justify-content-between">
          {renderRepoComponent('Pipelines', repositories.pipelines)}
          {renderEdgeComponent()}
          {renderRepoComponent('QC', repositories.qc)}
          {renderEdgeComponent()}
          {renderRepoComponent('Analysis', repositories.analysis)}
        </div>
      </div>
    </div>
  );
}

export default CodeRepositories;
