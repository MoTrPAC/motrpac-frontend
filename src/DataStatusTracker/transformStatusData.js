/**
 * Transforms flat CDN sample-data-status records into Highcharts-ready
 * chart option objects, grouped by Site → Tissue.
 */

export const STATUS_COLORS = {
  shipped: '#C8D8E8',
  dataReceived: '#E8837A',
  quantId: '#E8D48A',
  analysisCompleted: '#7DC49A',
};

const TISSUE_ABBREV = {
  BLOOD: 'BLO',
  MUSCLE: 'MUS',
  ADIPOSE: 'ADI',
};

const TISSUE_ORDER = ['BLOOD', 'MUSCLE', 'ADIPOSE'];

const DOMAIN_ORDER = [
  'GET',
  'Metabolomics targeted',
  'Metabolomics untargeted',
  'Proteomics targeted',
  'Proteomics untargeted',
];

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function stripSitePrefix(site) {
  return (site || '').replace('motrpac-portal-transfer-', '');
}

/**
 * Group records by Site → Tissue, sorted by domain then site name.
 * Returns: [{ site, domain, tissues: [{ tissue, assays, tranches, records }] }]
 */
function groupRecords(records) {
  const bySite = new Map();

  for (const r of records) {
    const site = stripSitePrefix(r.Site);
    const key = r.Domain + '|' + site;
    if (!bySite.has(key)) {
      bySite.set(key, { site, domain: r.Domain, tissues: new Map() });
    }
    const siteGroup = bySite.get(key);
    if (!siteGroup.tissues.has(r.Tissue)) {
      siteGroup.tissues.set(r.Tissue, []);
    }
    siteGroup.tissues.get(r.Tissue).push(r);
  }

  // Sort sites by domain order, then alphabetically within domain.
  // Unknown domains sort after all known domains.
  const fallback = DOMAIN_ORDER.length;
  const sites = [...bySite.values()].sort((a, b) => {
    const da = DOMAIN_ORDER.indexOf(a.domain);
    const db = DOMAIN_ORDER.indexOf(b.domain);
    if (da !== db) return (da === -1 ? fallback : da) - (db === -1 ? fallback : db);
    return a.site.localeCompare(b.site);
  });

  return sites.map((s) => ({
    site: s.site,
    domain: s.domain,
    tissues: TISSUE_ORDER
      .filter((t) => s.tissues.has(t))
      .map((t) => {
        const recs = s.tissues.get(t);
        const tranches = [...new Set(recs.map((r) => r.Tranche))].sort();
        const assays = [...new Set(recs.map((r) => r.Assay))].sort();
        return { tissue: t, abbrev: TISSUE_ABBREV[t] || t, tranches, assays, records: recs };
      }),
  }));
}

/**
 * Build Highcharts options for the left (shipped) chart.
 * One category (tissue abbrev), one series per tranche stacked horizontally.
 */
function buildShippedOptions(tissueGroup, site, axisMax) {
  const { abbrev, tranches, records } = tissueGroup;

  const series = tranches.map((tr) => {
    // Max shipped across assays for this tranche
    const trRecords = records.filter((r) => r.Tranche === tr);
    const shippedValues = trRecords.map((r) => Number(r.Shipped)).filter(Number.isFinite);
    const maxShipped = shippedValues.length > 0 ? Math.max(...shippedValues) : 0;
    return {
      name: tr,
      data: [maxShipped],
      color: STATUS_COLORS.shipped,
      borderWidth: maxShipped > 0 ? 1 : 0,
      borderColor: '#000',
      dataLabels: {
        enabled: maxShipped > 0,
        format: tr,
        style: { fontSize: '9px', fontWeight: 'normal', textOutline: 'none' },
      },
    };
  });

  return {
    chart: {
      type: 'bar',
      height: 100,
      marginLeft: 60,
      marginRight: 40,
      marginTop: 5,
      marginBottom: 30,
      spacing: [0, 0, 0, 0],
    },
    title: { text: null },
    xAxis: {
      categories: [abbrev],
      labels: { style: { fontSize: '12px', fontWeight: 'bold' } },
    },
    yAxis: {
      min: 0,
      max: axisMax,
      reversedStacks: false,
      title: { text: 'Number of Samples', style: { fontSize: '10px' } },
      labels: { style: { fontSize: '10px' } },
      gridLineWidth: 1,
      gridLineColor: '#eee',
    },
    plotOptions: {
      bar: {
        stacking: 'normal',
        pointPadding: 0.1,
        groupPadding: 0,
      },
    },
    tooltip: {
      outside: true,
      formatter() {
        return `<b>${abbrev}</b> — ${site}<br/>${this.series.name}: ${this.y.toLocaleString()}`;
      },
    },
    legend: { enabled: false },
    credits: { enabled: false },
    exporting: { enabled: false },
    series,
  };
}

/**
 * Build Highcharts options for the right (processing status) chart.
 * Categories = assay names. Stacked series: for each tranche, three segments
 * (analysis completed, quant-id delta, data-received delta).
 */
function buildStatusOptions(tissueGroup, site, axisMax) {
  const { abbrev, tranches, assays, records } = tissueGroup;

  // Build lookup: records keyed by assay+tranche
  const lookup = new Map();
  for (const r of records) {
    lookup.set(`${r.Assay}|${r.Tranche}`, r);
  }

  // Filter out assays with no data across all tranches
  const activeAssays = assays.filter((assay) =>
    tranches.some((tr) => {
      const r = lookup.get(`${assay}|${tr}`);
      return r && (r['Data Received'] > 0 || r['quant-id completed'] > 0 || r['analysis completed'] > 0);
    }),
  );

  const series = [];

  for (const tr of tranches) {
    const analysisData = [];
    const quantIdDelta = [];
    const receivedDelta = [];

    for (const assay of activeAssays) {
      const r = lookup.get(`${assay}|${tr}`);
      const ac = r ? r['analysis completed'] : 0;
      const qid = r ? r['quant-id completed'] : 0;
      const dr = r ? r['Data Received'] : 0;

      analysisData.push({ y: ac, custom: { assay, tissue: abbrev, tranche: tr, ac, qid, dr } });
      quantIdDelta.push({ y: Math.max(0, qid - ac), custom: { assay, tissue: abbrev, tranche: tr, ac, qid, dr } });
      receivedDelta.push({ y: Math.max(0, dr - qid), custom: { assay, tissue: abbrev, tranche: tr, ac, qid, dr } });
    }

    series.push(
      {
        name: `${tr} analysis completed`,
        data: analysisData,
        color: STATUS_COLORS.analysisCompleted,
        borderWidth: 0.5,
        borderColor: '#000',
        tranche: tr,
        statusType: 'analysis completed',
      },
      {
        name: `${tr} quant-id completed`,
        data: quantIdDelta,
        color: STATUS_COLORS.quantId,
        borderWidth: 0.5,
        borderColor: '#000',
        tranche: tr,
        statusType: 'quant-id completed',
      },
      {
        name: `${tr} Data Received`,
        data: receivedDelta,
        color: STATUS_COLORS.dataReceived,
        borderWidth: 0.5,
        borderColor: '#000',
        tranche: tr,
        statusType: 'Data Received',
        dataLabels: {
          enabled: true,
          format: tr,
          align: 'right',
          style: { fontSize: '9px', fontWeight: 'normal', textOutline: 'none' },
        },
      },
    );
  }

  if (activeAssays.length === 0) return null;

  const barHeight = 22;
  const chartPadding = 50;
  const height = Math.max(100, activeAssays.length * barHeight + chartPadding);

  return {
    chart: {
      type: 'bar',
      height,
      marginLeft: 120,
      marginRight: 40,
      marginTop: 5,
      marginBottom: 30,
      spacing: [0, 0, 0, 0],
    },
    title: { text: null },
    xAxis: {
      categories: activeAssays,
      labels: { style: { fontSize: '11px' } },
    },
    yAxis: {
      min: 0,
      max: axisMax,
      reversedStacks: false,
      title: { text: 'Number of Samples', style: { fontSize: '10px' } },
      labels: { style: { fontSize: '10px' } },
      gridLineWidth: 1,
      gridLineColor: '#eee',
    },
    plotOptions: {
      bar: {
        stacking: 'normal',
        pointPadding: 0.05,
        groupPadding: 0,
      },
    },
    tooltip: {
      outside: true,
      useHTML: true,
      formatter() {
        const c = this.point.custom;
        const pct = (val, total) => (total > 0 ? ` (${((val / total) * 100).toFixed(1)}%)` : '');
        return (
          `<b>${escapeHTML(c.assay)}</b> · ${escapeHTML(c.tissue)} · ${escapeHTML(c.tranche)}<br/>`
          + `Data Received: ${c.dr.toLocaleString()}<br/>`
          + `quant-id completed: ${c.qid.toLocaleString()}${pct(c.qid, c.dr)}<br/>`
          + `analysis completed: ${c.ac.toLocaleString()}${pct(c.ac, c.dr)}`
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
 * Main entry point. Takes the raw CDN JSON array and returns an array of
 * site groups, each with tissues containing Highcharts option objects.
 */
export function transformCDNData(records) {
  const grouped = groupRecords(records);

  // Compute global axis max for each column so scales are consistent
  let shippedMax = 0;
  let statusMax = 0;

  for (const siteGroup of grouped) {
    for (const tg of siteGroup.tissues) {
      // Build lookups once per tissue group
      const byTranche = new Map();
      const byAssayTranche = new Map();
      for (const r of tg.records) {
        if (!byTranche.has(r.Tranche)) byTranche.set(r.Tranche, []);
        byTranche.get(r.Tranche).push(r);
        byAssayTranche.set(`${r.Assay}|${r.Tranche}`, r);
      }

      // Left: sum of max-shipped-per-tranche across all tranches
      let shippedSum = 0;
      for (const trRecs of byTranche.values()) {
        const vals = trRecs.map((r) => Number(r.Shipped)).filter(Number.isFinite);
        shippedSum += vals.length > 0 ? Math.max(...vals) : 0;
      }
      shippedMax = Math.max(shippedMax, shippedSum);

      // Right: sum of Data Received across all tranches per assay
      const tranches = [...byTranche.keys()];
      const assays = [...new Set(tg.records.map((r) => r.Assay))];
      for (const assay of assays) {
        let assaySum = 0;
        for (const tr of tranches) {
          const r = byAssayTranche.get(`${assay}|${tr}`);
          if (r) assaySum += r['Data Received'];
        }
        statusMax = Math.max(statusMax, assaySum);
      }
    }
  }

  return grouped.map((siteGroup) => ({
    site: siteGroup.site,
    domain: siteGroup.domain,
    tissues: siteGroup.tissues
      .filter((tg) => tg.records.some((r) =>
        r.Shipped > 0 || r['Data Received'] > 0 || r['quant-id completed'] > 0 || r['analysis completed'] > 0,
      ))
      .map((tg) => ({
        tissue: tg.tissue,
        abbrev: tg.abbrev,
        shippedOptions: buildShippedOptions(tg, siteGroup.site, shippedMax),
        statusOptions: buildStatusOptions(tg, siteGroup.site, statusMax),
      })),
  }));
}
