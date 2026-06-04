import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import AnimatedLoadingIcon from '../lib/ui/loading';
import useCdnData from './useCdnData';
import { transformCDNData, STATUS_COLORS } from './transformStatusData';

const HUMAN_DATA_URL =
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
 * Renders the Human Sample Data Tracker view: paired shipped/status charts
 * grouped by Domain → Site → Tissue.
 */
export default function HumanDataStatus() {
  const { data, loading, error } = useCdnData(HUMAN_DATA_URL);

  const chartGroups = useMemo(
    () => (data ? transformCDNData(data) : []),
    [data],
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
      <StatusLegend />
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
  );
}
