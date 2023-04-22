import React from 'react';
import { Link } from 'react-router-dom';
import ExternalLink from '../../lib/ui/externalLink';
import DataTypeInfo from './dataTypeInfo';

function AuthAccessBrowseDataSummary() {
  return (
    <div className="browse-data-summary-container row mb-4">
      <div className="lead col-12">
        Browse and download experimental data from endurance trained (1w, 2wks,
        4wks or 8wks) compared to untrained adult rats (6 months old). The files
        accessible and downloadable here consist of results and analyses
        defining the molecular changes that occur with training and exercise
        across tissues. Files can be filtered by tissue, omics and assay. To
        learn more about the studies, see the{' '}
        <ExternalLink
          to="https://www.biorxiv.org/content/10.1101/2022.09.21.508770v1"
          label="MoTrPAC Endurance Exercise Training Animal Study Landscape Preprint"
        />{' '}
        as well as the <Link to="/methods">documentation</Link> on animal study
        protocols. Also check out the{' '}
        <ExternalLink
          to="https://www.cell.com/cell/fulltext/S0092-8674(20)30691-7"
          label="first published MoTrPAC paper"
        />{' '}
        that provides more information on the entire study.
      </div>
      <DataTypeInfo grid="col-6 col-md-6" />
      <div className="browse-data-summary-content col-6 col-md-6">
        <div className="bd-callout bd-callout-info">
          <h4>Additional Information</h4>
          <p>
            The currently available young adult rats experimental data for acute
            exercise and endurance training include all tissues and assays from
            the very last consortium data release, as well as additional tissues
            and assays made available afterwards. The phenotypic data sets have
            also been updated since then.
          </p>
          <p>
            Please refer to this{' '}
            <a
              href="https://docs.google.com/document/d/1bdXcYQLZ65GpJKTjf9XwRxhrfHJSD9NIqCxhG6icL8U"
              className="inline-link-with-icon"
              target="_blank"
              rel="noopener noreferrer"
            >
              README
              <i className="material-icons readme-file-icon">description</i>
            </a>{' '}
            document for the data included in the very last consortium data
            release.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthAccessBrowseDataSummary;
