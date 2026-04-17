import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import AnimatedLoadingIcon from '../lib/ui/loading';
import { transformCDNData, STATUS_COLORS } from './transformStatusData';

import '@styles/dataStatusTracker.scss';

const DATA_URL =
  'https://d1yw74buhe0ts0.cloudfront.net/static/motrpac-data-hub/sample-data-tracker/data/human-sample-data-status.json';

function StatusLegend() {
  const items = [
    { color: STATUS_COLORS.shipped, label: 'Shipped to CAS' },
    { color: STATUS_COLORS.dataReceived, label: 'Data Received by BIC' },
    { color: STATUS_COLORS.quantId, label: 'quant-id completed (ready for analysis)' },
    { color: STATUS_COLORS.analysisCompleted, label: 'analysis completed' },
  ];

  return (
    <div className="status-legend mb-3">
      {items.map((item) => (
        <span key={item.label} className="status-legend-item">
          <span
            className="status-legend-swatch"
            style={{ backgroundColor: item.color }}
          />
          {item.label}
        </span>
      ))}
    </div>
  );
}

/**
 * Renders the Human Sample Data Tracker page.
 * Internal/consortium users only.
 */
export function DataStatusTracker({ profile }) {
  const userType = profile?.user_metadata?.userType;
  const [rawData, setRawData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetch(DATA_URL, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch data (${res.status})`);
        return res.json();
      })
      .then((json) => {
        setRawData(json);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setError(err.message);
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, []);

  const chartGroups = useMemo(
    () => (rawData ? transformCDNData(rawData) : []),
    [rawData],
  );

  if (!profile || userType === 'external') {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="dataStatusTrackerPage px-3 px-md-4 mb-3 w-100">
      <Helmet>
        <html lang="en" />
        <title>HHuman Sample Data Tracker - MoTrPAC Data Hub</title>
      </Helmet>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-2 page-header">
        <div className="page-title">
          <h1 className="mb-0">Human Sample Data Tracker</h1>
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

      <StatusLegend />

      <AnimatedLoadingIcon isFetching={loading} />

      {error && (
        <div className="alert alert-danger" role="alert">
          Unable to load sample data tracker: {error}
        </div>
      )}

      {!loading && !error && (
        <div className="data-status-charts">
          {chartGroups.map((siteGroup, idx) => {
            const prevDomain = idx > 0 ? chartGroups[idx - 1].domain : null;
            const showDomainHeader = siteGroup.domain !== prevDomain;

            return (
              <div key={siteGroup.site}>
                {showDomainHeader && (
                  <h4 className={`domain-header${idx > 0 ? ' with-rule' : ''}`}>{siteGroup.domain}</h4>
                )}
                <div className="site-section">
                  <h5 className="site-header">{siteGroup.site}</h5>
                  {siteGroup.tissues.map((tg) => (
                    <div key={tg.tissue} className="tissue-row">
                      <div className="tissue-shipped-chart">
                        <HighchartsReact
                          highcharts={Highcharts}
                          options={tg.shippedOptions}
                          containerProps={{ style: { width: '100%' } }}
                        />
                      </div>
                      <div className="tissue-status-chart">
                        {tg.statusOptions && (
                          <HighchartsReact
                            highcharts={Highcharts}
                            options={tg.statusOptions}
                            containerProps={{ style: { width: '100%' } }}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
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
