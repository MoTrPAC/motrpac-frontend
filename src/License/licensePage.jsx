import React from 'react';
import { Helmet } from 'react-helmet';
import PageTitle from '../lib/ui/pageTitle';
import ExternalLink from '../lib/ui/externalLink';

import '@styles/license.scss';

function License() {
  return (
    <div className="licensePage px-3 px-md-4 mb-3 container">
      <Helmet>
        <html lang="en" />
        <title>MoTrPAC Data License - MoTrPAC Data Hub</title>
      </Helmet>
      <PageTitle title="MoTrPAC Data License" />
      <div className="license-content-container row mb-4">
        <div className="col-12">
          <p className="lead">
            The data available through the MoTrPAC Data Hub portal is provided
            under the Creative Commons Attribution 4.0 International License
            (CC BY 4.0). This license allows users to use, share, adapt, distribute,
            and reproduce the data in any medium or format, provided appropriate
            credit is given to the original author(s) and the source, a link to the
            Creative Commons license is included, and any modifications are clearly
            indicated.
          </p>
          <p className="lead">
            To view the full terms of this license, please visit Creative Commons
            Attribution 4.0 International License (CC BY 4.0) at
            {' '}
            <ExternalLink
              to="https://creativecommons.org/licenses/by/4.0/"
              label="https://creativecommons.org/licenses/by/4.0/"
            />
          </p>
        </div>
      </div>
    </div>
  );
}

export default License;
