import { beforeEach, describe, expect, test } from 'vitest';
import {
  REVIEWER_AGREEMENT_KEY,
  accessLevel,
  reviewerAgreementAccepted,
  reviewerSeesCollection,
  reviewerSeesFile,
  setReviewerAgreement,
} from '../userAccess';
import { entitledPrefixes, visibleTo } from '../collectionFiles';
import { visibleBundleCards } from '../bundleDataCards';
import studyDataCards, { humanPhenotypeDataCards } from '../studyDataCards';
import { hasVisibleCollections } from '../studyDataAccess';

const REVIEWER = {
  user_metadata: { userType: 'external' },
  app_metadata: { role: 'reviewer' },
};

// Reviewer access is conditional on the data use agreement, so every test that
// expects a reviewer to be one has to say so. Cleared first, because an answer
// left behind by the previous test would grant the access under examination.
beforeEach(() => {
  window.sessionStorage.clear();
});

const agreeToTerms = () => setReviewerAgreement(true);

describe('accessLevel', () => {
  test('a reviewer is distinguished from the plain external user they look like', () => {
    // The whole reason this function exists: both carry userType 'external',
    // and every gate downstream sees only its return value.
    agreeToTerms();
    expect(accessLevel(REVIEWER)).toBe('reviewer');
    expect(accessLevel({ user_metadata: { userType: 'external' } })).toBe('external');
  });

  test('a role alone does not grant reviewer access', () => {
    // An internal user keeps internal access, and a role on a profile with no
    // userType is not an entitlement -- reviewer is external + role, both.
    agreeToTerms();
    expect(accessLevel({
      user_metadata: { userType: 'internal' },
      app_metadata: { role: 'reviewer' },
    })).toBe('internal');
    expect(accessLevel({ app_metadata: { role: 'reviewer' } })).toBeUndefined();
  });

  test('an unknown role is not a reviewer', () => {
    agreeToTerms();
    expect(accessLevel({
      user_metadata: { userType: 'external' },
      app_metadata: { role: 'administrator' },
    })).toBe('external');
  });

  test('an absent profile is anonymous, not privileged', () => {
    agreeToTerms();
    [undefined, null, {}].forEach((profile) => {
      expect(accessLevel(profile)).toBeUndefined();
    });
  });
});

describe('the data use agreement gates the access, not just the download buttons', () => {
  test('declining leaves a reviewer with exactly what any external user gets', () => {
    // The reported gap: declining disabled the dashboard buttons while the
    // study collections, the release cards and the file browser stayed open,
    // because each of those asks `accessLevel` and nothing asked the agreement.
    setReviewerAgreement(false);
    expect(accessLevel(REVIEWER)).toBe('external');
  });

  test('not having answered yet is a refusal, not a pass', () => {
    // A reviewer who goes straight to /data-download never passes the dashboard
    // and never sees the modal. Nothing has been stored, and that has to read
    // as "no" -- the one case where failing open would be silent.
    expect(reviewerAgreementAccepted()).toBe(false);
    expect(accessLevel(REVIEWER)).toBe('external');
  });

  test('accepting grants it, and only an exact yes counts', () => {
    agreeToTerms();
    expect(accessLevel(REVIEWER)).toBe('reviewer');

    // Guards the comparison: a truthy-but-wrong value must not pass.
    window.sessionStorage.setItem(REVIEWER_AGREEMENT_KEY, 'TRUE');
    expect(accessLevel(REVIEWER)).toBe('external');
    window.sessionStorage.setItem(REVIEWER_AGREEMENT_KEY, '1');
    expect(accessLevel(REVIEWER)).toBe('external');
  });

  test('the agreement never widens anyone else', () => {
    // Accepting is a condition on reviewer access, not a grant of its own.
    agreeToTerms();
    expect(accessLevel({ user_metadata: { userType: 'external' } })).toBe('external');
    expect(accessLevel({})).toBeUndefined();
  });

  test('unreadable storage denies rather than throwing', () => {
    // Private browsing can make sessionStorage throw on access. This function
    // is called from every access check in the app, so it has to answer.
    const original = Object.getOwnPropertyDescriptor(window, 'sessionStorage');
    Object.defineProperty(window, 'sessionStorage', {
      configurable: true,
      get() { throw new Error('SecurityError'); },
    });

    try {
      expect(reviewerAgreementAccepted()).toBe(false);
      expect(accessLevel(REVIEWER)).toBe('external');
      expect(() => setReviewerAgreement(true)).not.toThrow();
    } finally {
      Object.defineProperty(window, 'sessionStorage', original);
    }
  });
});

describe('what a reviewer may reach, beyond the public corpus', () => {
  test('every kind of the study under review, under either folder name', () => {
    // Quant-ID sits under the shorter `human-precovid` folder while the others
    // use `human-precovid-sed-adu`. Same study, and both spellings must pass.
    expect(reviewerSeesCollection('gs://bucket/quant-id/human-precovid/c1.0')).toBe(true);
    expect(reviewerSeesCollection('phenotype/human-precovid-sed-adu/c2.0')).toBe(true);
    expect(reviewerSeesCollection('analysis/human-precovid-sed-adu/c2.0')).toBe(true);
  });

  test('and no other study', () => {
    expect(reviewerSeesCollection('quant-id/rat-acute-06/c2.0')).toBe(false);
    expect(reviewerSeesCollection('phenotype/human-main-sed-adu/c2.0')).toBe(false);
    expect(reviewerSeesCollection('phenotype/human-eqc/c14.0')).toBe(false);
  });

  test('every file of that study, whatever its release stage', () => {
    // The four consortium categories the reviewer rule has to cover. Listed
    // individually because each was granted separately, and a future narrowing
    // of the rule should have to fail one of these to take any of them away.
    const base = 'analysis/human-precovid-sed-adu/c2.0';
    [
      `${base}/proteomics/metadata/x_metadata_samples_v2.0.txt`,
      `${base}/proteomics/qc-norm/x_qc-norm_v2.0.txt`,
      `${base}/resources/motrpac_human-precovid_1kg_pca.csv`,
      `${base}/proteomics/da/x_dea_v2.0.txt`,
    ].forEach((object) => expect(reviewerSeesFile(object)).toBe(true));

    expect(reviewerSeesFile('quant-id/human-precovid/c1.0/lab-ck/x_results_v1.0.txt')).toBe(true);
  });

  test('a file in another study is withheld, however it is named', () => {
    // Study is the whole test: a file named exactly like one the reviewer may
    // see must not ride in from a study they have no access to.
    expect(reviewerSeesFile(
      'analysis/rat-acute-06/c2.0/proteomics/metadata/x_metadata_samples_v1.0.txt'
    )).toBe(false);
    expect(reviewerSeesFile('phenotype/human-main-sed-adu/c2.0/curated/x.txt')).toBe(false);
  });
});

describe('the file gate applies those rules', () => {
  const records = [
    { object: 'analysis/human-precovid-sed-adu/c2.0/a/da/pub.txt', external_release: true },
    { object: 'analysis/human-precovid-sed-adu/c2.0/a/metadata/samples.txt', external_release: false },
    { object: 'analysis/human-precovid-sed-adu/c2.0/a/qc-norm/norm.txt', external_release: false },
    { object: 'quant-id/human-precovid/c1.0/a/quant.txt', external_release: false },
    // The row that must drop out: another study, and not public.
    { object: 'analysis/rat-acute-06/c2.0/a/qc-norm/other.txt', external_release: false },
  ];
  const seen = (access) => visibleTo(records, access).map((r) => r.object.split('/').pop());

  test('a reviewer gets the public files plus the whole study under review', () => {
    expect(seen('reviewer')).toEqual(['pub.txt', 'samples.txt', 'norm.txt', 'quant.txt']);
  });

  test('external users and anonymous visitors are unaffected', () => {
    // The reviewer branch must not widen what anyone else sees.
    expect(seen('external')).toEqual(['pub.txt']);
    expect(seen(undefined)).toEqual(['pub.txt']);
  });

  test('internal users still get everything', () => {
    expect(visibleTo(records, 'internal')).toEqual(records);
  });
});

describe('reviewers are confined to two studies', () => {
  const studies = (access) =>
    [...studyDataCards, ...humanPhenotypeDataCards]
      .filter((study) => hasVisibleCollections(study, access))
      .map((study) => study.code)
      .sort();

  test('study cards, and so the Study Collections and Data Releases tabs', () => {
    expect(studies('reviewer')).toEqual(['human-precovid-sed-adu', 'rat-training-06']);
  });

  test('the file browser offers the three collections external users cannot see', () => {
    const reviewer = entitledPrefixes('reviewer');
    const external = entitledPrefixes('external');
    const added = reviewer.filter((prefix) => !external.includes(prefix)).sort();
    expect(added).toEqual([
      'phenotype/human-precovid-sed-adu/c2.0',
      'phenotype/human-precovid-sed-adu/c3.0',
      'quant-id/human-precovid/c1.0',
    ]);
  });

  test('and no collection from any other study', () => {
    // The property that matters most here. Stated over the whole corpus rather
    // than by listing what is excluded, so a study added later is covered.
    const strays = entitledPrefixes('reviewer').filter(
      (prefix) => !/^[a-z-]+\/(rat-training-06|human-precovid|human-precovid-sed-adu)\//.test(prefix)
    );
    expect(strays).toEqual([]);
  });

});

describe('bundles follow the same agreement', () => {
  const zips = (access) =>
    (JSON.stringify(visibleBundleCards(access)).match(/"bundles\/[^"]*"/g) || [])
      .map((name) => name.replace(/"/g, ''));

  test('accepting hands a reviewer the restricted builds', () => {
    // The restricted build of a bundle is the individual-level one; the
    // unrestricted build of the same collection is summary-level. Reviewers get
    // the former, which is the point of them being reviewers.
    const gained = zips('reviewer').filter((name) => !zips('external').includes(name));

    expect(gained.length).toBeGreaterThan(0);
    expect(gained.every((name) => /human-pre(covid|suspension)-sed-adu/.test(name))).toBe(true);
  });

  test('and nothing beyond what a consortium member gets', () => {
    // A reviewer is not an internal user: elevated within one study, not past it.
    expect(zips('reviewer').filter((name) => !zips('internal').includes(name))).toEqual([]);
    expect(zips('reviewer').length).toBeLessThan(zips('internal').length);
  });

  test('declining leaves the bundles exactly as an external user sees them', () => {
    setReviewerAgreement(false);
    expect(zips(accessLevel(REVIEWER))).toEqual(zips('external'));
  });

  test('so does never having answered', () => {
    expect(zips(accessLevel(REVIEWER))).toEqual(zips('external'));
  });
});
