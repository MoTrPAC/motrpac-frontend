import { describe, test, expect } from 'vitest';
import {
  transformRatData,
  shortSite,
  RAT_STATUS_COLORS,
  STUDY_ORDER,
  STUDY_TAB_LABELS,
} from '../transformRatStatusData';

/**
 * Helper to build a minimal rat CDN record with sensible defaults.
 */
function makeRecord(overrides = {}) {
  return {
    Study: 'PASS1AC-06',
    Site: 'motrpac-portal-transfer-pnnl',
    Assay: 'PROT-PR',
    Tissue: 'heart',
    Shipped: 100,
    'Data Received': 80,
    'quant-id completed': 60,
    'analysis completed': 40,
    ...overrides,
  };
}

/** Find the study group by name. */
function studyGroup(result, study) {
  return result.find((s) => s.study === study);
}

describe('shortSite', () => {
  test('strips the motrpac-portal-transfer- prefix', () => {
    expect(shortSite('motrpac-portal-transfer-pnnl')).toEqual('pnnl');
  });

  test('applies the broad → broad-carr override', () => {
    expect(shortSite('motrpac-portal-transfer-broad')).toEqual('broad-carr');
  });
});

describe('transformRatData', () => {
  test('returns one group per study in STUDY_ORDER with no data', () => {
    const result = transformRatData([]);
    expect(result.map((s) => s.study)).toEqual(STUDY_ORDER);
    result.forEach((s) => expect(s.sites).toEqual([]));
  });

  test('attaches the study tab label', () => {
    const result = transformRatData([makeRecord()]);
    const group = studyGroup(result, 'PASS1AC-06');
    expect(group.label).toEqual(STUDY_TAB_LABELS['PASS1AC-06']);
  });

  // --- Filtering ---

  test('filters out records where all counts are zero', () => {
    const records = [
      makeRecord({
        Shipped: 0,
        'Data Received': 0,
        'quant-id completed': 0,
        'analysis completed': 0,
      }),
    ];
    const group = studyGroup(transformRatData(records), 'PASS1AC-06');
    expect(group.sites).toEqual([]);
  });

  test('empty study yields sites: []', () => {
    const result = transformRatData([makeRecord({ Study: 'PASS1AC-06' })]);
    expect(studyGroup(result, 'PASS1B-18').sites).toEqual([]);
  });

  // --- Grouping & ordering ---

  test('sorts sites alphabetically and strips prefixes', () => {
    const records = [
      makeRecord({ Site: 'motrpac-portal-transfer-stanford-sinai' }),
      makeRecord({ Site: 'motrpac-portal-transfer-broad' }),
      makeRecord({ Site: 'motrpac-portal-transfer-mayo' }),
    ];
    const group = studyGroup(transformRatData(records), 'PASS1AC-06');
    // Sorted by full site name then shortened: broad-carr, mayo, stanford-sinai
    expect(group.sites.map((s) => s.site)).toEqual([
      'broad-carr',
      'mayo',
      'stanford-sinai',
    ]);
  });

  test('sorts assays alphabetically within a site', () => {
    const records = [
      makeRecord({ Assay: 'RNA-SEQ' }),
      makeRecord({ Assay: 'ATAC-SEQ' }),
      makeRecord({ Assay: 'PROT-PR' }),
    ];
    const group = studyGroup(transformRatData(records), 'PASS1AC-06');
    expect(group.sites[0].assays.map((a) => a.assay)).toEqual([
      'ATAC-SEQ',
      'PROT-PR',
      'RNA-SEQ',
    ]);
  });

  // --- Chart structure ---

  test('uses tissues as x-axis categories', () => {
    const records = [
      makeRecord({ Tissue: 'liver' }),
      makeRecord({ Tissue: 'heart' }),
    ];
    const group = studyGroup(transformRatData(records), 'PASS1AC-06');
    const { chartOptions } = group.sites[0].assays[0];
    expect(chartOptions.xAxis.categories).toEqual(['heart', 'liver']);
  });

  test('overlay series are ordered [shipped, received, quant, analysis]', () => {
    const group = studyGroup(transformRatData([makeRecord()]), 'PASS1AC-06');
    const { series } = group.sites[0].assays[0].chartOptions;
    expect(series.map((s) => s.statusType)).toEqual([
      'shipped',
      'received',
      'quant',
      'analysis',
    ]);
  });

  test('disables grouping so bars overlay', () => {
    const group = studyGroup(transformRatData([makeRecord()]), 'PASS1AC-06');
    const { chartOptions } = group.sites[0].assays[0];
    expect(chartOptions.plotOptions.bar.grouping).toBe(false);
  });

  test('shipped series is a transparent fill with a colored outline', () => {
    const group = studyGroup(transformRatData([makeRecord()]), 'PASS1AC-06');
    const shipped = group.sites[0].assays[0].chartOptions.series[0];
    expect(shipped.color).toEqual('rgba(0,0,0,0)');
    expect(shipped.borderColor).toEqual(RAT_STATUS_COLORS.shipped);
    expect(shipped.borderWidth).toEqual(2);
  });

  test('status series use the expected fill colors', () => {
    const group = studyGroup(transformRatData([makeRecord()]), 'PASS1AC-06');
    const { series } = group.sites[0].assays[0].chartOptions;
    expect(series[1].color).toEqual(RAT_STATUS_COLORS.dataReceived);
    expect(series[2].color).toEqual(RAT_STATUS_COLORS.quantId);
    expect(series[3].color).toEqual(RAT_STATUS_COLORS.analysisCompleted);
  });

  test('yAxis max is the largest value across the chart times 1.05', () => {
    const records = [
      makeRecord({ Tissue: 'heart', Shipped: 200, 'Data Received': 80 }),
      makeRecord({ Tissue: 'liver', Shipped: 100, 'Data Received': 50 }),
    ];
    const group = studyGroup(transformRatData(records), 'PASS1AC-06');
    const { chartOptions } = group.sites[0].assays[0];
    expect(chartOptions.yAxis.max).toBeCloseTo(200 * 1.05);
  });

  test('each point carries all four counts in custom', () => {
    const records = [
      makeRecord({
        Tissue: 'heart',
        Shipped: 159,
        'Data Received': 144,
        'quant-id completed': 130,
        'analysis completed': 120,
      }),
    ];
    const group = studyGroup(transformRatData(records), 'PASS1AC-06');
    const { custom } = group.sites[0].assays[0].chartOptions.series[0].data[0];
    expect(custom).toMatchObject({
      tissue: 'heart',
      assay: 'PROT-PR',
      site: 'pnnl',
      shipped: 159,
      received: 144,
      quant: 130,
      analysis: 120,
    });
  });

  test('shipped is shared across assays for the same site + tissue', () => {
    const records = [
      makeRecord({ Assay: 'PROT-PR', Tissue: 'heart', Shipped: 159 }),
      // Same site + tissue but a different assay record omits Shipped (0)
      makeRecord({ Assay: 'PROT-PH', Tissue: 'heart', Shipped: 0, 'Data Received': 100 }),
    ];
    const group = studyGroup(transformRatData(records), 'PASS1AC-06');
    const protPh = group.sites[0].assays.find((a) => a.assay === 'PROT-PH');
    expect(protPh.chartOptions.series[0].data[0].custom.shipped).toEqual(159);
  });

  // --- Status selection / legend filtering ---

  test('all series are visible by default', () => {
    const group = studyGroup(transformRatData([makeRecord()]), 'PASS1AC-06');
    const { series } = group.sites[0].assays[0].chartOptions;
    expect(series.every((s) => s.visible)).toBe(true);
  });

  test('only the selected status series stay visible', () => {
    const group = studyGroup(
      transformRatData([makeRecord()], ['shipped', 'analysis']),
      'PASS1AC-06',
    );
    const visibility = Object.fromEntries(
      group.sites[0].assays[0].chartOptions.series.map((s) => [s.statusType, s.visible]),
    );
    expect(visibility).toEqual({
      shipped: true,
      received: false,
      quant: false,
      analysis: true,
    });
  });

  test('deselecting everything hides all series', () => {
    const group = studyGroup(transformRatData([makeRecord()], []), 'PASS1AC-06');
    const { series } = group.sites[0].assays[0].chartOptions;
    expect(series.every((s) => s.visible === false)).toBe(true);
  });
});
