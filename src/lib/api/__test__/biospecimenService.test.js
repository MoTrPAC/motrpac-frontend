import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import {
  BIOSPECIMEN_API_FIELDS,
  normalizeBiospecimenRecord,
  parseBiospecimenTsv,
} from '../biospecimenService';

describe('normalizeBiospecimenRecord', () => {
  test('renames the data dictionary spelling the API returns to the keys components read', () => {
    const record = normalizeBiospecimenRecord({
      vial_label: 'V1',
      sampleGroupCode: 'BLO',
      randomGroupCode: 'ADUControl',
      enrollRandomGroupCode: 'PEDEnrollEndur',
      tempSampProfile: 'P1',
      DMAQC_age_groups: '18-39',
      visit_code: 'ADU_BAS',
    });
    expect(record).toEqual({
      vial_label: 'V1',
      sample_group_code: 'BLO',
      random_group_code: 'ADUControl',
      enroll_random_group_code: 'PEDEnrollEndur',
      temp_samp_profile: 'P1',
      dmaqc_age_groups: '18-39',
      visit_code: 'ADU_BAS',
    });
  });

  test('stored lowercase and snake_case spellings normalize the same way', () => {
    expect(normalizeBiospecimenRecord({ samplegroupcode: 'MUS', visitcode: 'ADU_PAS' }))
      .toEqual({ sample_group_code: 'MUS', visit_code: 'ADU_PAS' });
    expect(normalizeBiospecimenRecord({ sample_group_code: 'ADI' }))
      .toEqual({ sample_group_code: 'ADI' });
  });

  test('keys it does not know are kept as-is', () => {
    expect(normalizeBiospecimenRecord({ timepointOrder: '1' })).toEqual({ timepointOrder: '1' });
  });

  test('every requested API field normalizes to a key the components read', () => {
    const normalized = Object.keys(normalizeBiospecimenRecord(
      Object.fromEntries(BIOSPECIMEN_API_FIELDS.map((field) => [field, null])),
    ));
    expect(normalized).toContain('sample_group_code');
    expect(normalized).toContain('temp_samp_profile');
    expect(normalized).not.toContain('samplegroupcode');
    expect(normalized).toHaveLength(BIOSPECIMEN_API_FIELDS.length);
  });
});

describe('parseBiospecimenTsv', () => {
  test('parses rows, maps empty cells to null and normalizes keys', () => {
    const tsv = 'vial_label\tpid\tsampleGroupCode\tbmi\traw_assays_with_results\n'
      + 'V1\tP1\tBLO\t27.37\tprot-ol\n'
      + '\tP2\tMUS\t\t\n';
    expect(parseBiospecimenTsv(tsv)).toEqual([
      { vial_label: 'V1', pid: 'P1', sample_group_code: 'BLO', bmi: '27.37', raw_assays_with_results: 'prot-ol' },
      { vial_label: null, pid: 'P2', sample_group_code: 'MUS', bmi: null, raw_assays_with_results: null },
    ]);
  });

  test('rows without assay results are dropped by a != null filter', () => {
    const rows = parseBiospecimenTsv('vial_label\traw_assays_with_results\nV1\tprot-ol\nV2\t\n');
    expect(rows.filter((item) => item?.raw_assays_with_results != null).map((r) => r.vial_label))
      .toEqual(['V1']);
  });

  test('quoted cells, as written for values with tabs or quotes, are unquoted', () => {
    expect(parseBiospecimenTsv('vial_label\tstudy\nV1\t"a\tb ""c"""\n'))
      .toEqual([{ vial_label: 'V1', study: 'a\tb "c"' }]);
  });

  test('a header-only body yields no rows', () => {
    expect(parseBiospecimenTsv('vial_label\tpid\n')).toEqual([]);
  });
});

describe('queryBiospecimens caching', () => {
  const fakeClient = {
    interceptors: { request: { use: () => {} }, response: { use: () => {} } },
    get: vi.fn(),
  };

  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('VITE_API_SERVICE_ADDRESS', 'http://localhost:8080');
    vi.stubEnv('VITE_BIOSPECIMEN_DATA_ENDPOINT', '/api/biospecimens');
    vi.stubEnv('VITE_API_SERVICE_KEY', 'test-key');
    vi.doMock('axios', () => ({ default: { create: () => fakeClient } }));
    fakeClient.get.mockReset();
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.doUnmock('axios');
  });

  test('does not write the response to localStorage and clears leftover entries', async () => {
    window.localStorage.setItem('biospecimen-etag-{"__all__":true}', 'W/"old"');
    window.localStorage.setItem('biospecimen-data-{"__all__":true}', '{"data":[]}');
    fakeClient.get.mockResolvedValue({
      status: 200,
      data: 'vial_label\tsampleGroupCode\traw_assays_with_results\nV1\tBLO\tprot-ol\n',
      headers: {},
    });

    const { CreateBiospecimenService } = await import('../biospecimenService');
    const result = await CreateBiospecimenService().queryBiospecimens({});

    expect(result.data).toEqual([
      { vial_label: 'V1', sample_group_code: 'BLO', raw_assays_with_results: 'prot-ol' },
    ]);
    expect(Object.keys(window.localStorage).filter((k) => k.startsWith('biospecimen-'))).toEqual([]);
  });

  test('requests the new endpoint without a trailing slash, with the query params', async () => {
    fakeClient.get.mockResolvedValue({ status: 200, data: 'vial_label\n', headers: {} });

    const { CreateBiospecimenService } = await import('../biospecimenService');
    await CreateBiospecimenService().queryBiospecimens({});

    const [url, config] = fakeClient.get.mock.calls[0];
    expect(url).toBe('');
    expect(config.params).toMatchObject({ return_format: 'tsv' });
    expect(config.responseType).toBe('text');
    // Every row is requested; the hook drops rows without assay results.
    expect(config.params).not.toHaveProperty('not_null');
    expect(config.params.fields.split(',')).toEqual(BIOSPECIMEN_API_FIELDS);
  });

  test('a JSON array response is still accepted', async () => {
    fakeClient.get.mockResolvedValue({
      status: 200,
      data: [{ vial_label: 'V1', sampleGroupCode: 'BLO' }],
      headers: {},
    });

    const { CreateBiospecimenService } = await import('../biospecimenService');
    const result = await CreateBiospecimenService().queryBiospecimens({});

    expect(result.data).toEqual([{ vial_label: 'V1', sample_group_code: 'BLO' }]);
  });

  test('requests stored column names, which the API accepts, not component keys', () => {
    // The API resolves fields by stored name or data dictionary spelling;
    // snake_case keys such as temp_samp_profile would be rejected with a 400.
    ['tempsampprofile', 'samplegroupcode', 'randomgroupcode',
      'enrollrandomgroupcode', 'receivedcas', 'bmi_groups'].forEach((field) => {
      expect(BIOSPECIMEN_API_FIELDS).toContain(field);
    });
    ['temp_samp_profile', 'sample_group_code', 'received_cas'].forEach((key) => {
      expect(BIOSPECIMEN_API_FIELDS).not.toContain(key);
    });
  });

  test('normalizes the new columns to the component keys', () => {
    expect(normalizeBiospecimenRecord({ receivedCAS: '1', bmi_groups: 'Normal (18.5-24.9)' }))
      .toEqual({ received_cas: '1', bmi_groups: 'Normal (18.5-24.9)' });
  });
});
