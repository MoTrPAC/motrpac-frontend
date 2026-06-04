import React, { useState, useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import AnimatedLoadingIcon from '../lib/ui/loading';
import useCdnData from './useCdnData';
import {
  transformRatData,
  RAT_STATUS_COLORS,
  STUDY_ORDER,
} from './transformRatStatusData';

const RAT_DATA_URL =
  'https://d1yw74buhe0ts0.cloudfront.net/static/motrpac-data-hub/sample-data-tracker/data/rat-sample-data-status.json';

function RatStatusLegend() {
  const items = [
    { color: RAT_STATUS_COLORS.shipped, label: 'Shipped to CAS', outline: true },
    { color: RAT_STATUS_COLORS.dataReceived, label: 'Data Received by BIC' },
    { color: RAT_STATUS_COLORS.quantId, label: 'quant-id completed' },
    { color: RAT_STATUS_COLORS.analysisCompleted, label: 'analysis completed' },
  ];

  return (
    <div className="status-legend mb-3">
      {items.map((item) => (
        <span key={item.label} className="status-legend-item">
          <span
            className={`status-legend-swatch${item.outline ? ' outline' : ''}`}
            style={
              item.outline
                ? { borderColor: item.color }
                : { backgroundColor: item.color }
            }
          />
          {item.label}
        </span>
      ))}
    </div>
  );
}

/**
 * Renders the Rat Sample Data Tracker view: a study tab bar, then site sections
 * with one horizontal bar chart per assay.
 */
export default function RatDataStatus() {
  const { data, loading, error } = useCdnData(RAT_DATA_URL);
  const [activeStudy, setActiveStudy] = useState(null);

  const studies = useMemo(
    () => (data ? transformRatData(data) : []),
    [data],
  );

  // Default to the first study that has data.
  const selectedStudy =
    activeStudy
    || studies.find((s) => s.sites.length > 0)?.study
    || STUDY_ORDER[0];

  const activeGroup = studies.find((s) => s.study === selectedStudy);

  if (loading) {
    return (
      <div role="status" aria-live="polite">
        <AnimatedLoadingIcon isFetching={loading} />
        <span className="sr-only">Loading rat sample data tracker…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Unable to load rat sample data tracker: {error}
      </div>
    );
  }

  return (
    <div className="data-status-charts">
      <RatStatusLegend />

      <div className="study-tab-bar" role="tablist">
        {studies.map((s) => (
          <button
            key={s.study}
            type="button"
            role="tab"
            aria-selected={s.study === selectedStudy}
            className={`study-tab-btn${s.study === selectedStudy ? ' active' : ''}`}
            onClick={() => setActiveStudy(s.study)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {activeGroup && activeGroup.sites.length === 0 && (
        <p className="text-muted my-4">No data available for this study.</p>
      )}

      {activeGroup
        && activeGroup.sites.map((siteGroup) => (
          <div key={siteGroup.site} className="site-section">
            <h5 className="site-header">{siteGroup.site}</h5>
            {siteGroup.assays.map((assayGroup) => (
              <div key={assayGroup.assay} className="assay-row">
                <h6 className="assay-header">{assayGroup.assay}</h6>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={assayGroup.chartOptions}
                  containerProps={{ style: { width: '100%' } }}
                />
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}
