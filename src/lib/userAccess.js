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
 * Where the reviewer's answer to the data use agreement is kept.
 *
 * `sessionStorage`, so it dies with the tab and a reviewer is asked again next
 * time rather than being held to an answer they gave weeks ago. The navbar
 * clears it on sign-out too, so the next person at the same browser starts from
 * no answer rather than inheriting one.
 *
 * The name is exported because three files touch this key, and a typo in any
 * one of them fails open in a way nothing would notice.
 */
export const REVIEWER_AGREEMENT_KEY = 'reviewerAgreement';

/**
 * Has this reviewer accepted the data use agreement?
 *
 * Anything other than an explicit yes is a no: an absent key -- a reviewer who
 * went straight to the download page without passing the dashboard -- reads the
 * same as a refusal. Storage access is guarded because a browser that refuses
 * it (private mode, blocked cookies) must deny the elevated access, not throw
 * from inside every access check in the app.
 */
export function reviewerAgreementAccepted() {
  try {
    return window.sessionStorage.getItem(REVIEWER_AGREEMENT_KEY) === 'true';
  } catch (error) {
    return false;
  }
}

/** Record the reviewer's answer. */
export function setReviewerAgreement(accepted) {
  try {
    window.sessionStorage.setItem(REVIEWER_AGREEMENT_KEY, accepted ? 'true' : 'false');
  } catch (error) {
    // Nothing to do: `reviewerAgreementAccepted` already reads an unwritable
    // store as a refusal, which is the safe answer.
  }
}

/**
 * Forget the answer, so the next reviewer at this browser is asked again.
 *
 * Called on logout. `Auth.logout` empties localStorage but not sessionStorage,
 * and the agreement lives in the latter, so without this an expired session
 * followed by a fresh sign-in would inherit the previous reviewer's acceptance
 * and never show the modal.
 */
export function clearReviewerAgreement() {
  try {
    window.sessionStorage.removeItem(REVIEWER_AGREEMENT_KEY);
  } catch (error) {
    // An unreadable store has nothing to clear, and logout must not fail here.
  }
}

/**
 * Collapse an Auth0 profile into the one value the access gates understand.
 *
 * Returns `undefined` for an anonymous visitor, which every gate already treats
 * as the least privileged reading.
 *
 * A reviewer who has not accepted the data use agreement is `external`, not
 * `reviewer`. The agreement is a condition of the access, so it belongs here
 * rather than on the controls it governs: gating the dashboard's download
 * buttons alone left the study collections, the release cards and the file
 * browser open to someone who had declined, since each of those asks this
 * function and nothing else.
 */
export function accessLevel(profile) {
  const userType = profile?.user_metadata?.userType;
  if (userType === INTERNAL) {
    return INTERNAL;
  }
  if (userType === EXTERNAL && profile?.app_metadata?.role === REVIEWER) {
    return reviewerAgreementAccepted() ? REVIEWER : EXTERNAL;
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
