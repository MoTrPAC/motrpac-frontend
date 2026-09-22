/**
 * Who the signed-in user is, for the purpose of deciding what they may see.
 *
 * The rest of the app threads a single string through its access gates. That
 * string used to be the Auth0 `userType` verbatim; reviewers are the reason it
 * no longer is. A reviewer is an `external` user carrying `role: 'reviewer'`,
 * so `userType` alone cannot tell them apart from an anonymous visitor, and
 * threading a second `role` argument through every gate would mean ~46 call
 * sites that each have to remember to pass it -- and one that forgets is a
 * silent leak rather than a crash.
 *
 * So the two fields collapse into one value here, once, at the point the
 * profile is read. Deriving it anywhere else re-creates the bug this avoids.
 *
 * This module deliberately imports nothing: `studyDataAccess` and
 * `collectionFiles` both depend on it, and they already depend on each other.
 */

export const INTERNAL = 'internal';
export const REVIEWER = 'reviewer';
export const EXTERNAL = 'external';

/**
 * Collapse an Auth0 profile into the one value the access gates understand.
 *
 * Returns `undefined` for an anonymous visitor, which every gate already treats
 * as the least privileged reading.
 */
export function accessLevel(profile) {
  const userType = profile?.user_metadata?.userType;
  if (userType === INTERNAL) {
    return INTERNAL;
  }
  if (userType === EXTERNAL && profile?.app_metadata?.role === REVIEWER) {
    return REVIEWER;
  }
  return userType;
}

/**
 * The study a reviewer is reviewing, by bucket folder name.
 *
 * A reviewer sees this study in full -- every collection, every file, whatever
 * its release stage -- and nothing beyond it except what is already public.
 * The pre-publication data they are reviewing is all of it: Quant-ID, Phenotype,
 * the Analysis differential results, its QC-normalized data and sample-level
 * metadata, and the genotype principal components.
 *
 * Quant-ID uses the shorter `human-precovid` folder while Analysis and
 * Phenotype use `human-precovid-sed-adu` -- the same study, spelled two ways in
 * the bucket (see `collections.yaml`). Both have to be listed or Quant-ID
 * silently stays hidden.
 *
 * rat-training-06 is not here because it needs nothing: it is public, so
 * reviewers already see it as any anonymous visitor does. Every other study --
 * rat-acute-06, human-main, human-eqc, human-biospecimen -- is absent on
 * purpose, and absence is what withholds it. Adding a folder here grants
 * reviewers that study's unreleased data, so this set is the whole rule.
 */
const REVIEWER_STUDY_FOLDERS = new Set(['human-precovid', 'human-precovid-sed-adu']);

/**
 * May a reviewer browse this collection at all?
 *
 * Takes a `storageLocation` (`gs://bucket/quant-id/human-precovid/c1.0`) or a
 * bare object-path prefix -- the study folder is the middle of the last three
 * segments either way.
 *
 * Answers only the question "beyond what is public": a public collection is
 * already visible to everyone and never reaches this.
 */
export function reviewerSeesCollection(storageLocation) {
  const [, folder] = String(storageLocation || '').split('/').slice(-3);
  return REVIEWER_STUDY_FOLDERS.has(folder);
}

/**
 * May a reviewer see this file, given it is not public?
 *
 * The object path carries the collection, so the study comes from the same
 * string the file is named by -- there is no separate field to fall out of step
 * with it.
 */
export function reviewerSeesFile(object) {
  const [, folder] = String(object || '').split('/');
  return REVIEWER_STUDY_FOLDERS.has(folder);
}
