/**
 * Transforms flat CDN rat sample-data-status records into Highcharts-ready
 * chart option objects, grouped by Study → Site → Assay.
 *
 * Ported from the Python report generator
 * (rat_tracking/scripts/generate_rat_data_status_report.py). Each (Site, Assay)
 * pair becomes one horizontal bar chart whose categories are tissues. Four
 * series are overlaid (not stacked): a hollow "Shipped to CAS" outline as the
 * ceiling, with Data Received (red), quant-id (yellow) and analysis (green)
 * nested inside it.
 */

export const RAT_STATUS_COLORS = {
  shipped: '#8AAECC', // outline only
  dataReceived: '#E8837A',
  quantId: '#E8D48A',
  analysisCompleted: '#7DC49A',
};

export const STUDY_ORDER = ['PASS1AC-06', 'PASS1B-06', 'PASS1AC-18', 'PASS1B-18'];

export const STUDY_TAB_LABELS = {
  'PASS1AC-06': 'PASS1AC-06 · 6-mo Acute',
  'PASS1B-06': 'PASS1B-06 · 6-mo Training',
  'PASS1AC-18': 'PASS1AC-18 · 18-mo Acute',
  'PASS1B-18': 'PASS1B-18 · 18-mo Training',
};

export const RAT_BLURB =
  'This report is automatically generated using automated parsing of processed '
  + 'data files stored in BIC Google Cloud Storage buckets. The outlined bar shows '
  + 'vials shipped to CAS (tissue-level count). Red indicates data received by the '
  + 'BIC. Yellow indicates quantification (quant-id) completed. Green indicates full '
  + 'analysis completed and available to the consortium.';

const SITE_OVERRIDES = {
  'motrpac-portal-transfer-broad': 'broad-carr',
};

const PX_PER_ROW = 26;
const CHART_PADDING = 50;

export function shortSite(site) {
  if (SITE_OVERRIDES[site]) return SITE_OVERRIDES[site];
  return (site || '').replace('motrpac-portal-transfer-', '');
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function num(val) {
  const n = Number(val);
  return Number.isFinite(n) ? n : 0;
}

function hasData(r) {
  return (
    num(r.Shipped) > 0
    || num(r['Data Received']) > 0
    || num(r['quant-id completed']) > 0
    || num(r['analysis completed']) > 0
  );
}

/**
 * Build Highcharts options for a single (site, assay) horizontal bar chart.
 * `shippedByTissue` maps tissue → shipped count (tissue-level, shared across
 * assays within a site).
 */
function buildAssayChart(site, assay, records, shippedByTissue) {
  const tissues = [...new Set(records.map((r) => r.Tissue))].sort();

  const byTissue = new Map();
  for (const r of records) {
    byTissue.set(r.Tissue, r);
  }

  const shipped = [];
  const received = [];
  const quant = [];
  const analysis = [];
  let maxValue = 0;

  for (const tissue of tissues) {
    const r = byTissue.get(tissue);
    const sh = num(shippedByTissue.get(tissue));
    const dr = r ? num(r['Data Received']) : 0;
    const qid = r ? num(r['quant-id completed']) : 0;
    const ac = r ? num(r['analysis completed']) : 0;

    const custom = {
      tissue,
      assay,
      site: shortSite(site),
      shipped: sh,
      received: dr,
      quant: qid,
      analysis: ac,
    };

    shipped.push({ y: sh, custom });
    received.push({ y: dr, custom });
    quant.push({ y: qid, custom });
    analysis.push({ y: ac, custom });

    maxValue = Math.max(maxValue, sh, dr, qid, ac);
  }

  const height = Math.max(80, tissues.length * PX_PER_ROW + CHART_PADDING);

  // Series order matters: with grouping disabled the later series render on top.
  // Shipped (outline) sits at the back; analysis (smallest, green) on top.
  const series = [
    {
      name: 'Shipped to CAS',
      data: shipped,
      color: 'rgba(0,0,0,0)',
      borderColor: RAT_STATUS_COLORS.shipped,
      borderWidth: 2,
      statusType: 'shipped',
    },
    {
      name: 'Data Received by BIC',
      data: received,
      color: RAT_STATUS_COLORS.dataReceived,
      borderWidth: 0,
      statusType: 'received',
    },
    {
      name: 'quant-id completed',
      data: quant,
      color: RAT_STATUS_COLORS.quantId,
      borderWidth: 0,
      statusType: 'quant',
    },
    {
      name: 'analysis completed',
      data: analysis,
      color: RAT_STATUS_COLORS.analysisCompleted,
      borderWidth: 0,
      statusType: 'analysis',
    },
  ];

  return {
    chart: {
      type: 'bar',
      height,
      marginLeft: 120,
      marginRight: 30,
      marginTop: 5,
      marginBottom: 30,
      spacing: [0, 0, 0, 0],
    },
    title: { text: null },
    xAxis: {
      categories: tissues,
      // Highcharts bars render category 0 at the bottom; reverse so the first
      // tissue is on top (matches the Python autorange="reversed").
      reversed: true,
      labels: { style: { fontSize: '11px' } },
    },
    yAxis: {
      min: 0,
      max: maxValue * 1.05,
      title: { text: 'Number of Samples', style: { fontSize: '10px' } },
      labels: { style: { fontSize: '10px' } },
      gridLineWidth: 1,
      gridLineColor: '#eee',
    },
    plotOptions: {
      bar: {
        grouping: false,
        pointPadding: 0.1,
        groupPadding: 0,
      },
    },
    tooltip: {
      outside: true,
      useHTML: true,
      formatter() {
        const c = this.point.custom;
        return (
          `<b>${escapeHTML(c.tissue)}</b> · ${escapeHTML(c.assay)} · ${escapeHTML(c.site)}<br/>`
          + `Shipped to CAS: ${c.shipped.toLocaleString()}<br/>`
          + `Data Received: ${c.received.toLocaleString()}<br/>`
          + `quant-id completed: ${c.quant.toLocaleString()}<br/>`
          + `analysis completed: ${c.analysis.toLocaleString()}`
        );
      },
    },
    legend: { enabled: false },
    credits: { enabled: false },
    exporting: { enabled: false },
    series,
  };
}

/**
 * Main entry point. Takes the raw CDN JSON array and returns an array of study
 * groups in STUDY_ORDER, each with sites → assays containing Highcharts options.
 *
 * Returns: [{ study, label, sites: [{ site, assays: [{ assay, chartOptions }] }] }]
 * A study present in STUDY_ORDER but with no data yields `sites: []`.
 */
export function transformRatData(records) {
  const withData = (records || []).filter(hasData);

  // Bucket records by study → site → assay, and capture tissue-level shipped.
  const byStudy = new Map();
  for (const r of withData) {
    if (!byStudy.has(r.Study)) {
      byStudy.set(r.Study, { sites: new Map(), shippedByTissue: new Map() });
    }
    const studyEntry = byStudy.get(r.Study);

    if (!studyEntry.sites.has(r.Site)) {
      studyEntry.sites.set(r.Site, new Map());
    }
    const assays = studyEntry.sites.get(r.Site);
    if (!assays.has(r.Assay)) {
      assays.set(r.Assay, []);
    }
    assays.get(r.Assay).push(r);

    // Shipped is tissue-level (shared across assays within a site): keep the
    // first value seen per (site, tissue).
    const shipKey = `${r.Site}|${r.Tissue}`;
    if (!studyEntry.shippedByTissue.has(shipKey)) {
      studyEntry.shippedByTissue.set(shipKey, num(r.Shipped));
    }
  }

  return STUDY_ORDER.map((study) => {
    const label = STUDY_TAB_LABELS[study] || study;
    const studyEntry = byStudy.get(study);
    if (!studyEntry) {
      return { study, label, sites: [] };
    }

    const sites = [...studyEntry.sites.keys()].sort().map((site) => {
      const assayMap = studyEntry.sites.get(site);
      const shippedByTissue = new Map();
      for (const [shipKey, val] of studyEntry.shippedByTissue) {
        const [s, tissue] = shipKey.split('|');
        if (s === site) shippedByTissue.set(tissue, val);
      }

      const assays = [...assayMap.keys()].sort().map((assay) => ({
        assay,
        chartOptions: buildAssayChart(site, assay, assayMap.get(assay), shippedByTissue),
      }));

      return { site: shortSite(site), assays };
    });

    return { study, label, sites };
  });
}
