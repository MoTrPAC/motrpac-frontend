import React from 'react';
import { Helmet } from 'react-helmet';
import PageTitle from '../lib/ui/pageTitle';
import ExternalLink from '../lib/ui/externalLink';

import '@styles/license.scss';

function Citation() {
  return (
    <div className="citationPage px-3 px-md-4 mb-3 container">
      <Helmet>
        <html lang="en" />
        <title>Citing MoTrPAC - MoTrPAC Data Hub</title>
      </Helmet>
      <PageTitle title="Citing MoTrPAC" />
      <div className="citation-content-container row mb-4">
        <div className="col-12">
          <p className="lead">
            When referencing MoTrPAC, please cite it as follows:
          </p>
          <ul className="lead">
            <li>Please cite the indicated paper for any dataset you used.</li>
            <li>Cite any R package used for data access.</li>
            <li>
              If data were downloaded directly from{' '}
              <ExternalLink
                to="https://motrpac-data.org"
                label="motrpac-data.org"
              />
              , please include the following acknowledgement: "Data used in the
              preparation of this article were obtained from the Molecular
              Transducers of Physical Activity Consortium (MoTrPAC) database,
              which is available for public access at motrpac-data.org."
            </li>
          </ul>
          <h5 className="mt-5">MoTrPAC Marker Paper</h5>
          <p className="citation-item">
            MoTrPAC Study Group., Lead Analysts. & MoTrPAC Study Group. Molecular
            Transducers of Physical Activity Consortium (MoTrPAC): Mapping the
            Dynamic Responses to Exercise.
            Cell <i>Volume 181, Issue 7</i>, P1464-1474, June 25, 2020.{' '}
            <ExternalLink
              to="https://doi.org/10.1016/j.cell.2020.06.004"
              label="https://doi.org/10.1016/j.cell.2020.06.004"
            />
          </p>
          <h5 className="mt-4">Rat - 6 month old endurance training</h5>
          <p className="citation-item">
            MoTrPAC Study Group., Lead Analysts. & MoTrPAC Study Group. Temporal
            dynamics of the multi-omic response to endurance exercise training.
            Nature <b>629</b>, 174–183 (2024).{' '}
            <ExternalLink
              to="https://doi.org/10.1038/s41586-023-06877-w"
              label="https://doi.org/10.1038/s41586-023-06877-w"
            />
          </p>
        </div>
      </div>
    </div>
  );
}

export default Citation;
