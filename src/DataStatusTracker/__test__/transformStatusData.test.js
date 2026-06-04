import { describe, test, expect } from 'vitest';
import { transformCDNData, STATUS_COLORS } from '../transformStatusData';

/**
 * Helper to build a minimal CDN record with sensible defaults.
 */
function makeRecord(overrides = {}) {
  return {
    Site: 'motrpac-portal-transfer-site-a',
    Domain: 'GET',
    Tissue: 'BLOOD',
    Tranche: 'T1',
    Assay: 'assay-1',
    Shipped: 100,
    'Data Received': 80,
    'quant-id completed': 60,
    'analysis completed': 40,
    ...overrides,
  };
}

describe('transformCDNData', () => {
  test('returns empty array for empty input', () => {
    expect(transformCDNData([])).toEqual([]);
  });

  test('strips site prefix from site names', () => {
    const records = [makeRecord({ Site: 'motrpac-portal-transfer-broad' })];
    const result = transformCDNData(records);
    expect(result[0].site).toEqual('broad');
  });

  // --- Domain ordering ---

  test('sorts sites by DOMAIN_ORDER then alphabetically within domain', () => {
    const records = [
      makeRecord({ Site: 'motrpac-portal-transfer-z-site', Domain: 'Proteomics untargeted' }),
      makeRecord({ Site: 'motrpac-portal-transfer-a-site', Domain: 'GET' }),
      makeRecord({ Site: 'motrpac-portal-transfer-b-site', Domain: 'GET' }),
    ];
    const result = transformCDNData(records);
    expect(result.map((s) => s.site)).toEqual(['a-site', 'b-site', 'z-site']);
  });

  test('unknown domains sort after all known domains', () => {
    const records = [
      makeRecord({ Site: 'motrpac-portal-transfer-unknown-site', Domain: 'Future Domain' }),
      makeRecord({ Site: 'motrpac-portal-transfer-get-site', Domain: 'GET' }),
    ];
    const result = transformCDNData(records);
    expect(result[0].site).toEqual('get-site');
    expect(result[1].site).toEqual('unknown-site');
  });

  // --- Tissue grouping ---

  test('groups tissues in TISSUE_ORDER (BLOOD, MUSCLE, ADIPOSE)', () => {
    const records = [
      makeRecord({ Tissue: 'ADIPOSE' }),
      makeRecord({ Tissue: 'BLOOD' }),
      makeRecord({ Tissue: 'MUSCLE' }),
    ];
    const result = transformCDNData(records);
    const tissueNames = result[0].tissues.map((t) => t.tissue);
    expect(tissueNames).toEqual(['BLOOD', 'MUSCLE', 'ADIPOSE']);
  });

  test('uses abbreviations for known tissues', () => {
    const records = [makeRecord({ Tissue: 'BLOOD' })];
    const result = transformCDNData(records);
    expect(result[0].tissues[0].abbrev).toEqual('BLO');
  });

  test('falls back to tissue name as abbreviation for unknown tissue', () => {
    const records = [makeRecord({ Tissue: 'LIVER' })];
    // LIVER is not in TISSUE_ORDER so it won't appear (filtered by TISSUE_ORDER)
    const result = transformCDNData(records);
    expect(result[0].tissues).toEqual([]);
  });

  // --- Filtering empty tissues ---

  test('filters out tissues where all records have zero counts', () => {
    const records = [
      makeRecord({
        Tissue: 'BLOOD',
        Shipped: 0,
        'Data Received': 0,
        'quant-id completed': 0,
        'analysis completed': 0,
      }),
      makeRecord({ Tissue: 'MUSCLE', Shipped: 10 }),
    ];
    const result = transformCDNData(records);
    const tissueNames = result[0].tissues.map((t) => t.tissue);
    expect(tissueNames).toEqual(['MUSCLE']);
  });

  // --- Empty assay filtering in status chart ---

  test('status chart excludes assays with no data across all tranches', () => {
    const records = [
      makeRecord({ Assay: 'active-assay', 'Data Received': 50, Tranche: 'T1' }),
      makeRecord({
        Assay: 'empty-assay',
        'Data Received': 0,
        'quant-id completed': 0,
        'analysis completed': 0,
        Tranche: 'T1',
      }),
    ];
    const result = transformCDNData(records);
    const statusOpts = result[0].tissues[0].statusOptions;
    expect(statusOpts.xAxis.categories).toEqual(['active-assay']);
  });

  // --- Per-row axis max ---

  test('shipped axis max reflects stacked tranche totals', () => {
    const records = [
      makeRecord({ Tranche: 'T1', Shipped: 100 }),
      makeRecord({ Tranche: 'T2', Shipped: 200 }),
    ];
    const result = transformCDNData(records);
    // Both tranches have one assay each so max per tranche is 100 and 200 → stacked = 300
    const shippedMax = result[0].tissues[0].shippedOptions.yAxis.max;
    expect(shippedMax).toEqual(300);
  });

  test('the two charts in a row share one axis max (max of shipped vs status)', () => {
    const records = [
      makeRecord({ Assay: 'assay-1', Tranche: 'T1', Shipped: 100, 'Data Received': 50 }),
      makeRecord({ Assay: 'assay-1', Tranche: 'T2', Shipped: 100, 'Data Received': 70 }),
    ];
    const { shippedOptions, statusOptions } = transformCDNData(records)[0].tissues[0];
    // Shipped total = 100 + 100 = 200; status stack = 60 + 70 = 130 → row max = 200
    expect(shippedOptions.yAxis.max).toEqual(200);
    expect(statusOptions.yAxis.max).toEqual(200);
  });

  test('row axis follows the status stack when it exceeds shipped', () => {
    const records = [
      makeRecord({ Assay: 'assay-1', Tranche: 'T1', Shipped: 0, 'Data Received': 50 }),
      makeRecord({ Assay: 'assay-1', Tranche: 'T2', Shipped: 0, 'Data Received': 70 }),
    ];
    const { shippedOptions, statusOptions } = transformCDNData(records)[0].tissues[0];
    // Shipped = 0; status stack = 60 + 70 = 130 → row max = 130, shared by both
    expect(statusOptions.yAxis.max).toEqual(130);
    expect(shippedOptions.yAxis.max).toEqual(130);
  });

  test('each row is scaled independently (a large row does not inflate another)', () => {
    const records = [
      makeRecord({ Site: 'motrpac-portal-transfer-big', Tissue: 'BLOOD', Shipped: 13000 }),
      makeRecord({ Site: 'motrpac-portal-transfer-small', Tissue: 'BLOOD', Shipped: 120 }),
    ];
    const result = transformCDNData(records);
    const big = result.find((s) => s.site === 'big').tissues[0];
    const small = result.find((s) => s.site === 'small').tissues[0];
    expect(big.shippedOptions.yAxis.max).toEqual(13000);
    expect(small.shippedOptions.yAxis.max).toEqual(120);
  });

  // --- Chart structure ---

  test('shipped chart produces one series per tranche', () => {
    const records = [
      makeRecord({ Tranche: 'T1' }),
      makeRecord({ Tranche: 'T2' }),
    ];
    const result = transformCDNData(records);
    const shippedSeries = result[0].tissues[0].shippedOptions.series;
    expect(shippedSeries).toHaveLength(2);
    expect(shippedSeries.map((s) => s.name)).toEqual(['T1', 'T2']);
  });

  test('status chart produces three series per tranche (analysis, quant-id, data received)', () => {
    const records = [makeRecord({ Tranche: 'T1' })];
    const result = transformCDNData(records);
    const statusSeries = result[0].tissues[0].statusOptions.series;
    expect(statusSeries).toHaveLength(3);
    expect(statusSeries[0].statusType).toEqual('analysis completed');
    expect(statusSeries[1].statusType).toEqual('quant-id completed');
    expect(statusSeries[2].statusType).toEqual('Data Received');
  });

  test('status chart returns null when all assays are empty', () => {
    const records = [
      makeRecord({
        'Data Received': 0,
        'quant-id completed': 0,
        'analysis completed': 0,
        Shipped: 10, // shipped > 0 so tissue is not filtered
      }),
    ];
    const result = transformCDNData(records);
    const statusOpts = result[0].tissues[0].statusOptions;
    expect(statusOpts).toBeNull();
  });

  test('uses correct STATUS_COLORS in series', () => {
    const records = [makeRecord()];
    const result = transformCDNData(records);
    const shippedColor = result[0].tissues[0].shippedOptions.series[0].color;
    expect(shippedColor).toEqual(STATUS_COLORS.shipped);

    const statusSeries = result[0].tissues[0].statusOptions.series;
    expect(statusSeries[0].color).toEqual(STATUS_COLORS.analysisCompleted);
    expect(statusSeries[1].color).toEqual(STATUS_COLORS.quantId);
    expect(statusSeries[2].color).toEqual(STATUS_COLORS.dataReceived);
  });

  // --- Delta calculations in status chart ---

  test('status chart computes deltas correctly (quant-id - analysis, dataReceived - quant-id)', () => {
    const records = [
      makeRecord({
        'analysis completed': 20,
        'quant-id completed': 50,
        'Data Received': 80,
      }),
    ];
    const result = transformCDNData(records);
    const series = result[0].tissues[0].statusOptions.series;
    // analysis completed = 20
    expect(series[0].data[0].y).toEqual(20);
    // quant-id delta = 50 - 20 = 30
    expect(series[1].data[0].y).toEqual(30);
    // data received delta = 80 - 50 = 30
    expect(series[2].data[0].y).toEqual(30);
  });

  test('deltas are clamped to zero when values are inverted', () => {
    const records = [
      makeRecord({
        'analysis completed': 80,
        'quant-id completed': 50,
        'Data Received': 30,
      }),
    ];
    const result = transformCDNData(records);
    const series = result[0].tissues[0].statusOptions.series;
    expect(series[0].data[0].y).toEqual(80);
    expect(series[1].data[0].y).toEqual(0); // max(0, 50-80)
    expect(series[2].data[0].y).toEqual(0); // max(0, 30-50)
    expect(result[0].tissues[0].statusOptions.yAxis.max).toBeGreaterThanOrEqual(
      80,
    );
  });

  test('status axis max accounts for qid being the largest value', () => {
    const records = [
      makeRecord({
        'analysis completed': 20,
        'quant-id completed': 100,
        'Data Received': 50,
      }),
    ];
    const result = transformCDNData(records);
    // Stack: ac(20) + max(0,100-20)(80) + max(0,50-100)(0) = 100
    expect(result[0].tissues[0].statusOptions.yAxis.max).toBeGreaterThanOrEqual(
      100,
    );
  });

  // --- Status selection / legend filtering ---

  test('selecting all statuses matches the default (unfiltered) output', () => {
    const records = [
      makeRecord({ 'analysis completed': 20, 'quant-id completed': 50, 'Data Received': 80 }),
    ];
    const def = transformCDNData(records);
    const all = transformCDNData(records, ['analysis', 'quant', 'received']);
    const defData = def[0].tissues[0].statusOptions.series.map((s) => s.data[0].y);
    const allData = all[0].tissues[0].statusOptions.series.map((s) => s.data[0].y);
    expect(allData).toEqual(defData);
  });

  test('all status series are visible by default', () => {
    const records = [makeRecord()];
    const series = transformCDNData(records)[0].tissues[0].statusOptions.series;
    expect(series.every((s) => s.visible)).toBe(true);
  });

  test('deselecting analysis nests only quant + received from baseline 0', () => {
    const records = [
      makeRecord({ 'analysis completed': 20, 'quant-id completed': 50, 'Data Received': 80 }),
    ];
    const series = transformCDNData(records, ['quant', 'received'])[0].tissues[0]
      .statusOptions.series;
    // analysis hidden + zeroed; quant now measured from 0; received from quant.
    expect(series[0].statusType).toEqual('analysis completed');
    expect(series[0].visible).toBe(false);
    expect(series[0].data[0].y).toEqual(0);
    expect(series[1].data[0].y).toEqual(50); // quant = qid - 0
    expect(series[2].data[0].y).toEqual(30); // received = dr - qid = 80 - 50
  });

  test('deselecting the middle status rebaselines the outer one', () => {
    const records = [
      makeRecord({ 'analysis completed': 20, 'quant-id completed': 50, 'Data Received': 80 }),
    ];
    const series = transformCDNData(records, ['analysis', 'received'])[0].tissues[0]
      .statusOptions.series;
    expect(series[0].data[0].y).toEqual(20); // analysis from 0
    expect(series[1].visible).toBe(false); // quant hidden
    expect(series[1].data[0].y).toEqual(0);
    expect(series[2].data[0].y).toEqual(60); // received = dr - analysis = 80 - 20
  });

  test('selecting a single status shows its full raw count', () => {
    const records = [
      makeRecord({ 'analysis completed': 20, 'quant-id completed': 50, 'Data Received': 80 }),
    ];
    const series = transformCDNData(records, ['received'])[0].tissues[0]
      .statusOptions.series;
    expect(series[2].data[0].y).toEqual(80);
    expect(series[0].visible).toBe(false);
    expect(series[1].visible).toBe(false);
  });

  test('the outermost selected status carries the tranche data label', () => {
    const records = [
      makeRecord({ Tranche: 'TR01', 'analysis completed': 20, 'quant-id completed': 50, 'Data Received': 80 }),
    ];
    // With received deselected, quant becomes the outer (labeled) segment.
    const series = transformCDNData(records, ['analysis', 'quant'])[0].tissues[0]
      .statusOptions.series;
    const labeled = series.filter((s) => s.dataLabels && s.dataLabels.enabled);
    expect(labeled).toHaveLength(1);
    expect(labeled[0].statusType).toEqual('quant-id completed');
  });
});
