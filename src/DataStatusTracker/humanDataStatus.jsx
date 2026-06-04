import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import AnimatedLoadingIcon from '../lib/ui/loading';
import useCdnData from './useCdnData';
import { transformCDNData, STATUS_COLORS } from './transformStatusData';

const HUMAN_DATA_URL =
  'https://d1yw74buhe0ts0.cloudfront.net/static/motrpac-data-hub/sample-data-tracker/data/human-sample-data-status.json';

const HUMAN_LEGEND_ITEMS = [
  { token: 'shipped', color: STATUS_COLORS.shipped, label: 'Shipped to CAS' },
  { token: 'received', color: STATUS_COLORS.dataReceived, label: 'Data Received by BIC' },
  { token: 'quant', color: STATUS_COLORS.quantId, label: 'quant-id completed (ready for analysis)' },
  { token: 'analysis', color: STATUS_COLORS.analysisCompleted, label: 'analysis completed' },
];

const ALL_HUMAN_TOKENS = HUMAN_LEGEND_ITEMS.map((i) => i.token);

function StatusLegend({ selected, onToggle }) {
  return (
    <div className="status-legend mb-3">
      {HUMAN_LEGEND_ITEMS.map((item) => {
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
              className="status-legend-swatch"
              style={{ backgroundColor: item.color }}
            />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

StatusLegend.propTypes = {
  selected: PropTypes.instanceOf(Set).isRequired,
  onToggle: PropTypes.func.isRequired,
};

/**
 * Renders the Human Sample Data Tracker view: paired shipped/status charts
 * grouped by Domain → Site → Tissue.
 */
export default function HumanDataStatus() {
  const { data, loading, error } = useCdnData(HUMAN_DATA_URL);
  const [selected, setSelected] = useState(() => new Set(ALL_HUMAN_TOKENS));

  const toggleStatus = (token) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(token)) next.delete(token);
      else next.add(token);
      return next;
    });

  const showShipped = selected.has('shipped');

  const chartGroups = useMemo(
    () =>
      (data
        // The status chart only knows the three processing statuses; 'shipped'
        // is handled here in the layout (show/hide the left chart).
        ? transformCDNData(data, [...selected].filter((t) => t !== 'shipped'))
        : []),
    [data, selected],
  );

  if (loading) {
    return (
      <div role="status" aria-live="polite">
        <AnimatedLoadingIcon isFetching={loading} />
        <span className="sr-only">Loading sample data tracker…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Unable to load sample data tracker: {error}
      </div>
    );
  }

  return (
    <div className="data-status-charts">
      <StatusLegend selected={selected} onToggle={toggleStatus} />
      {chartGroups.map((siteGroup, idx) => {
        const prevDomain = idx > 0 ? chartGroups[idx - 1].domain : null;
        const showDomainHeader = siteGroup.domain !== prevDomain;

        return (
          <div key={`${siteGroup.domain}__${siteGroup.site}`}>
            {showDomainHeader && (
              <h4 className={`domain-header${idx > 0 ? ' with-rule' : ''}`}>{siteGroup.domain}</h4>
            )}
            <div className="site-section">
              <h5 className="site-header">{siteGroup.site}</h5>
              {siteGroup.tissues.map((tg) => (
                <div
                  key={tg.tissue}
                  className={`tissue-row${showShipped ? '' : ' status-only'}`}
                >
                  {showShipped && (
                    <div className="tissue-shipped-chart">
                      <HighchartsReact
                        highcharts={Highcharts}
                        options={tg.shippedOptions}
                        containerProps={{ style: { width: '100%' } }}
                      />
                    </div>
                  )}
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
  );
}
