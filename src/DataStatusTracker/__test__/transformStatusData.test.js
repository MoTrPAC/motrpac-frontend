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

  // --- Global axis max ---

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

  test('status axis max reflects sum of Data Received across tranches per assay', () => {
    const records = [
      makeRecord({ Assay: 'assay-1', Tranche: 'T1', 'Data Received': 50 }),
      makeRecord({ Assay: 'assay-1', Tranche: 'T2', 'Data Received': 70 }),
    ];
    const result = transformCDNData(records);
    const statusMax = result[0].tissues[0].statusOptions.yAxis.max;
    expect(statusMax).toEqual(120);
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
});
