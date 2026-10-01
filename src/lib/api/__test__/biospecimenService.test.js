import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import {
  BIOSPECIMEN_API_FIELDS,
  normalizeBiospecimenRecord,
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
    expect(normalizeBiospecimenRecord({ receivedCAS: '1' })).toEqual({ receivedCAS: '1' });
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
      data: [{ vial_label: 'V1', sampleGroupCode: 'BLO', raw_assays_with_results: 'prot-ol' }],
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
    fakeClient.get.mockResolvedValue({ status: 200, data: [], headers: {} });

    const { CreateBiospecimenService } = await import('../biospecimenService');
    await CreateBiospecimenService().queryBiospecimens({});

    const [url, config] = fakeClient.get.mock.calls[0];
    expect(url).toBe('');
    expect(config.params).toMatchObject({
      return_format: 'json',
      not_null: 'raw_assays_with_results',
    });
    expect(config.params.fields.split(',')).toContain('samplegroupcode');
  });
});
