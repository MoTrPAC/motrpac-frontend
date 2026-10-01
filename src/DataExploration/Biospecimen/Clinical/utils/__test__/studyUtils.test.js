import { describe, expect, test } from 'vitest';
import { getStudyName } from '../studyUtils';

describe('getStudyName', () => {
  test('maps a study code to its display name', () => {
    expect(getStudyName('01')).toBe('Adult Sedentary');
  });

  test('passes through a display name, as /api/biospecimens returns', () => {
    expect(getStudyName('Pediatric High Active')).toBe('Pediatric High Active');
  });

  test('returns null for unknown values', () => {
    expect(getStudyName('05')).toBeNull();
    expect(getStudyName('Some Other Study')).toBeNull();
    expect(getStudyName(null)).toBeNull();
  });
});
