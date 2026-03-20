import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import createPlotlyComponent from 'react-plotly.js/factory';
import Plotly from 'plotly.js-basic-dist-min';
import { plotData, plotLayout, plotConfig, generatedDate } from './humanAssayStatusData';

import '@styles/dataStatusTracker.scss';

const Plot = createPlotlyComponent(Plotly);

/**
 * Renders the Human Assay Data Status Tracker page.
 * Internal/consortium users only.
 */
export function DataStatusTracker({ profile }) {
  const userType = profile.user_metadata && profile.user_metadata.userType;

  if (userType === 'external') {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="dataStatusTrackerPage px-3 px-md-4 mb-3 w-100">
      <Helmet>
        <html lang="en" />
        <title>Human Assay Data Status - MoTrPAC Data Hub</title>
      </Helmet>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-2 page-header">
        <div className="page-title">
          <h1 className="mb-0">Human Sample Data Tracker</h1>
          <p className="text-muted mb-0 small">Last Updated: {generatedDate}</p>
        </div>
      </div>
      <p>
        This report is automatically generated using sample shipping
        information and automated parsing of processed data files stored in BIC
        Google Cloud Storage buckets. Red indicates data received by the BIC
        that has not yet been processed or made available to the consortium.
        Yellow and green indicate data available to the consortium (either early
        access, consortium release, or public release — not distinguished here).
      </p>
      <div className="data-status-chart-container">
        <Plot
          data={plotData}
          layout={{
            ...plotLayout,
            autosize: true,
          }}
          config={plotConfig}
          useResizeHandler
          style={{ width: '100%', height: `${plotLayout.height || 3126}px` }}
        />
      </div>
    </div>
  );
}

DataStatusTracker.propTypes = {
  profile: PropTypes.shape({
    user_metadata: PropTypes.object,
  }),
};

const mapStateToProps = (state) => ({
  profile: state.auth.profile,
});

export default connect(mapStateToProps)(DataStatusTracker);
