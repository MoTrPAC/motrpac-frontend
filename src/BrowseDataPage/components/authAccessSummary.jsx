import React from 'react';

function AuthAccessBrowseDataSummary() {
  return (
    <div className="browse-data-summary-container row mb-4">
      <div className="lead col-12">
        Browse and download the experimental data of 6-month old rats by tissue,
        assay, or omics. The files accessible and downloadable here consist of a
        variety of data types for the animal's acute exercise (PASS1A) and
        endurance training (PASS1B) phases focusing on defining molecular
        changes that occur in rats.
      </div>
      <div className="browse-data-summary-content col-4 col-md-4">
        <div className="bd-callout bd-callout-info">
          <h4>Data Types</h4>
          <ul className="mt-1 mb-2">
            <li>Assay-specific differential analysis and normalized data</li>
            <li>
              Assay-specific quantitative results, experiment metadata, and
              QA/QC reports
            </li>
            <li>
              Cross-platform merged metabolomics data tables for named
              metabolites
            </li>
            <li>Phenotypic data</li>
          </ul>
          <p>
            <span className="font-weight-bold">Note:</span> Raw files are not
            currently available for direct download through the Data Hub portal.
            Please submit your requests to{' '}
            <a href="mailto:motrpac-data-requests@lists.stanford.edu">
              MoTrPAC Data Requests
            </a>{' '}
            and specify the relevant tissues/assays if you would like to get
            access to the raw files.
          </p>
        </div>
      </div>
      <div className="browse-data-summary-content col-4 col-md-4">
        <div className="bd-callout bd-callout-info">
          <h4>Additional Information</h4>
          <p>
            The currently available 6-month old rat data for acute exercise and
            endurance training also include:
          </p>
          <ul className="mt-1 mb-2">
            <li>
              All PASS1A and PASS1B 6-month experimental/sample metadata from
              the very last consortium release
            </li>
            <li>
              Updated PASS1A and PASS1B 6-month phenotypic data since the very
              last consortium release
            </li>
            <li>
              Experimental data of additional tissues and assays not available
              in the very last consortium release
            </li>
          </ul>
          <p>
            A{' '}
            <a
              href="https://docs.google.com/document/d/1bdXcYQLZ65GpJKTjf9XwRxhrfHJSD9NIqCxhG6icL8U"
              className="inline-link-with-icon"
              target="_blank"
              rel="noopener noreferrer"
            >
              README
              <i className="material-icons readme-file-icon">description</i>
            </a>{' '}
            document is available for reference on the data included in the very
            last consortium release.
          </p>
        </div>
      </div>
      <div className="browse-data-summary-content col-4 col-md-4">
        <div className="bd-callout bd-callout-warning">
          <div className="motrpac-collab-linkout h-100 d-flex align-items-start">
            <div className="feature-icon mr-3">
              <span className="material-icons">hub</span>
            </div>
            <div className="feature-summary">
              <h4>
                <a
                  href="https://collab.motrpac-data.org/hub/oauth_login?next=%2Fhub%2Fhome"
                  target="_blank"
                  rel="noreferrer"
                >
                  MoTrPAC Collab
                </a>
              </h4>
              <p className="card-text">
                A multi-user Jupyter notebook workspace containing a
                collection of notebooks and visualizations for in-depth data
                exploration. Read the{' '}
                <a
                  href="/static-assets/MoTrPAC_Collab_User_Guide.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  user guide
                </a>{' '}
                to learn more.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthAccessBrowseDataSummary;
