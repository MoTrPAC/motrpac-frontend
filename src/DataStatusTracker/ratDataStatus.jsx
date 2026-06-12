import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
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

const RAT_LEGEND_ITEMS = [
  { token: 'shipped', color: RAT_STATUS_COLORS.shipped, label: 'Shipped to CAS', outline: true },
  { token: 'received', color: RAT_STATUS_COLORS.dataReceived, label: 'Data Received by BIC' },
  { token: 'quant', color: RAT_STATUS_COLORS.quantId, label: 'quant-id completed' },
  { token: 'analysis', color: RAT_STATUS_COLORS.analysisCompleted, label: 'analysis completed' },
];

function RatStatusLegend({ selected, onToggle }) {
  return (
    <div className="status-legend mb-3">
      {RAT_LEGEND_ITEMS.map((item) => {
        const active = selected.has(item.token);
        return (
          <button
            key={item.token}
            type="button"
            className={`status-legend-item status-legend-toggle${active ? '' : ' is-off'}`}
            aria-pressed={active}
            onClick={() => onToggle(item.token)}
          >
            <span
              className={`status-legend-swatch${item.outline ? ' outline' : ''}`}
              style={
                item.outline
                  ? { borderColor: item.color }
                  : { backgroundColor: item.color }
              }
            />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

RatStatusLegend.propTypes = {
  selected: PropTypes.instanceOf(Set).isRequired,
  onToggle: PropTypes.func.isRequired,
};

/**
 * Renders the Rat Sample Data Tracker view: a study tab bar, then site sections
 * with one horizontal bar chart per assay.
 */
const ALL_RAT_TOKENS = RAT_LEGEND_ITEMS.map((i) => i.token);

export default function RatDataStatus() {
  const { data, loading, error } = useCdnData(RAT_DATA_URL);
  const [activeStudy, setActiveStudy] = useState(null);
  const [selected, setSelected] = useState(() => new Set(ALL_RAT_TOKENS));

  const toggleStatus = (token) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(token)) next.delete(token);
      else next.add(token);
      return next;
    });

  const studies = useMemo(
    () => (data ? transformRatData(data, [...selected]) : []),
    [data, selected],
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
      <div className="rat-sticky-header">
        <RatStatusLegend selected={selected} onToggle={toggleStatus} />

        <div className="study-tab-bar">
          {studies.map((s) => (
            <button
              key={s.study}
              type="button"
              aria-pressed={s.study === selectedStudy}
              className={`study-tab-btn${s.study === selectedStudy ? ' active' : ''}`}
              onClick={() => setActiveStudy(s.study)}
            >
              {s.label}
            </button>
          ))}
        </div>
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
