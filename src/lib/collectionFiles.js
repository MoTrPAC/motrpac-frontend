import studyDataCards, { humanPhenotypeDataCards } from './studyDataCards';
import { allVersions, visibleSeries } from './studyDataAccess';

/**
 * Loads file metadata one collection at a time.
 *
 * Each collection is a separate chunk fetched on demand rather than a static
 * import, so a browser only ever receives metadata for collections its user is
 * entitled to see. The previous per-study imports put every study's metadata in
 * the main bundle for every visitor, including collections that are
 * consortium-only.
 *
 * Vite needs the import specifiers to be statically analysable, so this map is
 * written out rather than built from a template string. Keys are object-path
 * prefixes -- the same `{family}/{study-folder}/{collection}` that each file's
 * `object` field starts with, and that `storageLocation` ends with.
 */
const LOADERS = {
  'quant-id/rat-training-06/c3.0': () => import('../data/file_download_metadata/collections/quant-id_rat-training-06_c3.0-minified.json'),
  'quant-id/rat-training-06/c2.0': () => import('../data/file_download_metadata/collections/quant-id_rat-training-06_c2.0-minified.json'),
  'quant-id/rat-training-06/c1.0': () => import('../data/file_download_metadata/collections/quant-id_rat-training-06_c1.0-minified.json'),
  'analysis/rat-training-06/c2.0': () => import('../data/file_download_metadata/collections/analysis_rat-training-06_c2.0-minified.json'),
  'analysis/rat-training-06/c1.0': () => import('../data/file_download_metadata/collections/analysis_rat-training-06_c1.0-minified.json'),
  'phenotype/rat-training-06/c4.0': () => import('../data/file_download_metadata/collections/phenotype_rat-training-06_c4.0-minified.json'),
  'quant-id/rat-acute-06/c2.0': () => import('../data/file_download_metadata/collections/quant-id_rat-acute-06_c2.0-minified.json'),
  'quant-id/rat-acute-06/c1.0': () => import('../data/file_download_metadata/collections/quant-id_rat-acute-06_c1.0-minified.json'),
  'analysis/rat-acute-06/c2.0': () => import('../data/file_download_metadata/collections/analysis_rat-acute-06_c2.0-minified.json'),
  'analysis/rat-acute-06/c1.1': () => import('../data/file_download_metadata/collections/analysis_rat-acute-06_c1.1-minified.json'),
  'analysis/rat-acute-06/c1.0': () => import('../data/file_download_metadata/collections/analysis_rat-acute-06_c1.0-minified.json'),
  'phenotype/rat-acute-06/c4.0': () => import('../data/file_download_metadata/collections/phenotype_rat-acute-06_c4.0-minified.json'),
  'quant-id/human-precovid/c1.0': () => import('../data/file_download_metadata/collections/quant-id_human-precovid_c1.0-minified.json'),
  'analysis/human-precovid-sed-adu/c2.0': () => import('../data/file_download_metadata/collections/analysis_human-precovid-sed-adu_c2.0-minified.json'),
  'analysis/human-precovid-sed-adu/c1.3': () => import('../data/file_download_metadata/collections/analysis_human-precovid-sed-adu_c1.3-minified.json'),
  'phenotype/human-precovid-sed-adu/c3.0': () => import('../data/file_download_metadata/collections/phenotype_human-precovid-sed-adu_c3.0-minified.json'),
  'phenotype/human-precovid-sed-adu/c2.0': () => import('../data/file_download_metadata/collections/phenotype_human-precovid-sed-adu_c2.0-minified.json'),
  'phenotype/human-eqc/c14.0': () => import('../data/file_download_metadata/collections/phenotype_human-eqc_c14.0-minified.json'),
  'phenotype/human-biospecimen/c3.0': () => import('../data/file_download_metadata/collections/phenotype_human-biospecimen_c3.0-minified.json'),
  'phenotype/human-main-sed-adu/c2.0': () => import('../data/file_download_metadata/collections/phenotype_human-main-sed-adu_c2.0-minified.json'),
  'phenotype/human-all-ped/c2.0': () => import('../data/file_download_metadata/collections/phenotype_human-all-ped_c2.0-minified.json'),
  'phenotype/human-all-ha-adu/c2.0': () => import('../data/file_download_metadata/collections/phenotype_human-all-ha-adu_c2.0-minified.json'),
  'phenotype/human-screening-adu/c2.0': () => import('../data/file_download_metadata/collections/phenotype_human-screening-adu_c2.0-minified.json'),
  'phenotype/human-screening-ped/c2.0': () => import('../data/file_download_metadata/collections/phenotype_human-screening-ped_c2.0-minified.json'),
};

const BUCKET_PREFIX = `gs://${import.meta.env.VITE_DATA_FILE_BUCKET}/`;

/** All cards that can own a collection, including the cross-study ones. */
export const allDataCards = [...studyDataCards, ...humanPhenotypeDataCards];

/** `gs://bucket/quant-id/rat-training-06/c3.0` -> `quant-id/rat-training-06/c3.0`. */
export function prefixFromStorageLocation(storageLocation) {
  return storageLocation.startsWith(BUCKET_PREFIX)
    ? storageLocation.slice(BUCKET_PREFIX.length)
    : storageLocation;
}

/** `quant-id/rat-training-06/c3.0/file.txt` -> `quant-id/rat-training-06/c3.0`. */
export function prefixFromObject(object) {
  return String(object || '').split('/').slice(0, 3).join('/');
}

export function isKnownCollection(prefix) {
  return Object.prototype.hasOwnProperty.call(LOADERS, prefix);
}

/**
 * Object-path prefixes for every collection this user may see.
 *
 * Derived from the same `visibleVersions` rule the cards render with, so the
 * file browser can never offer a collection the cards would have hidden.
 */
export function entitledPrefixes(userType) {
  const prefixes = [];
  allDataCards.forEach((card) => {
    Object.values(card.dataTypes).forEach((entries) => {
      visibleSeries(entries, userType).forEach((series) => {
        series.versions.forEach((version) => {
          const prefix = prefixFromStorageLocation(version.storageLocation);
          if (isKnownCollection(prefix)) {
            prefixes.push(prefix);
          }
        });
      });
    });
  });
  return prefixes;
}

/** Find the card and version that own a collection prefix. */
export function findCollection(prefix) {
  let found = null;
  allDataCards.forEach((card) => {
    Object.entries(card.dataTypes).forEach(([kind, entries]) => {
      allVersions(entries).forEach((version) => {
        if (prefixFromStorageLocation(version.storageLocation) === prefix) {
          found = { card, kind, version };
        }
      });
    });
  });
  return found;
}

/**
 * Release stage is a per-file property, not just a per-collection one.
 *
 * `analysis/human-precovid-sed-adu/c1.3` is a public collection whose
 * sample-level metadata and QC-normalized data are not: 98 of its 218 files are
 * consortium-only. Entitlement checked at collection granularity therefore is
 * not enough -- `entitledPrefixes` correctly offers the collection, and the
 * file rows inside it would still have reached anonymous visitors.
 *
 * The old per-study loaders avoided this by shipping two files and picking one
 * by user type. One file per collection is the better trade, but it moves the
 * per-file gate here, next to the per-collection one, so both are applied in
 * the same place and neither can be forgotten.
 */
function visibleTo(records, userType) {
  return userType === 'internal'
    ? records
    : records.filter((record) => record.external_release === true);
}

export async function loadCollection(prefix, userType) {
  const loader = LOADERS[prefix];
  if (!loader) {
    throw new Error(`Unknown collection: ${prefix}`);
  }
  const module = await loader();
  return visibleTo(module.default, userType);
}

/**
 * Load several collections at once, for browsing across the whole corpus.
 *
 * A prefix the user is not entitled to is a programming error, not a runtime
 * condition -- callers pass the output of `entitledPrefixes`. `userType` is not
 * optional: defaulting it would mean the least privileged reading, which fails
 * safe, but silently dropping an internal user's consortium files is still a
 * bug, and one that looks like missing data rather than a mistake.
 */
export async function loadCollections(prefixes, userType) {
  const loaded = await Promise.all(
    prefixes.map((prefix) => loadCollection(prefix, userType))
  );
  return loaded.flat();
}

export default LOADERS;
