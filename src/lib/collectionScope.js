import {
  allDataCards,
  entitledPrefixes,
  findCollection,
  isKnownCollection,
} from './collectionFiles';

/**
 * The file browser's scope: which study is being viewed, and which of its
 * collections are loaded.
 *
 * All URL parsing, study grouping and path building lives here so the contract
 * has one owner. Components ask this module; none of them parse a pathname.
 *
 * URL forms:
 *   /data-download/file-browser/quant-id/rat-training-06/c3.0   one collection
 *   /data-download/file-browser/rat-training-06?collections=a,b some of a study
 *   /data-download/file-browser/rat-training-06                 all of a study
 *
 * One path segment is a study code, three are a collection prefix; the two
 * cannot collide. An empty selection means "every collection in this study the
 * user may see", matching the Tissue/Omics/Assay facets where an empty
 * selection means no constraint.
 */
export const FILE_BROWSER_PATH = '/data-download/file-browser';

/**
 * The study a collection belongs to.
 *
 * Resolved through the card, never the object path: the study *folder* differs
 * per family -- human-precovid-sed-adu is `human-precovid` for Quant-ID and
 * `human-precovid-sed-adu` for Analysis and Phenotype -- so grouping on the
 * path would split one study in two and drop its Quant-ID collection.
 */
export function studyOf(prefix) {
  const owner = findCollection(prefix);
  return owner ? owner.card.code : null;
}

export function isKnownStudy(code) {
  return allDataCards.some((card) => card.code === code);
}

/** Every collection of one study that this user may see. */
export function studyCollections(studyCode, userType) {
  return entitledPrefixes(userType).filter((prefix) => studyOf(prefix) === studyCode);
}

/** The URL for a selection. An empty selection is the whole study. */
export function scopeToPath(studyCode, selected) {
  if (selected.length === 1) {
    return `${FILE_BROWSER_PATH}/${selected[0]}`;
  }
  if (selected.length === 0) {
    return `${FILE_BROWSER_PATH}/${studyCode}`;
  }
  return `${FILE_BROWSER_PATH}/${studyCode}?collections=${selected.join(',')}`;
}

function trimSlashes(value) {
  return value.replace(/^\/+|\/+$/g, '');
}

const NOT_BROWSING = Object.freeze({
  inFileBrowser: false,
  studyCode: null,
  available: [],
  selected: [],
  prefixes: [],
});

/**
 * Resolve a location into the scope to render.
 *
 * `prefixes` is what to load: the explicit selection, or the whole study when
 * nothing is selected. An empty `prefixes` while `inFileBrowser` means the URL
 * asked for collections this user may not see, and the caller should fall
 * through to the download page.
 */
export function resolveScope(location, userType) {
  if (!location.pathname.startsWith(FILE_BROWSER_PATH)) {
    return NOT_BROWSING;
  }

  const segment = trimSlashes(location.pathname.slice(FILE_BROWSER_PATH.length));
  const entitled = entitledPrefixes(userType);
  const permitted = new Set(entitled);

  const requested = (new URLSearchParams(location.search).get('collections') || '')
    .split(',')
    .map((value) => value.trim())
    .filter((value) => value && isKnownCollection(value));

  const pathNamesCollection = isKnownCollection(segment);
  const named = pathNamesCollection || requested.length > 0;
  const fromQuery = requested.filter((prefix) => permitted.has(prefix));
  const fromPath = pathNamesCollection && permitted.has(segment) ? [segment] : [];
  const chosen = fromQuery.length ? fromQuery : fromPath;

  // The URL asked for specific collections and none of them are permitted.
  // Distinct from asking for none, which legitimately means "all of the study".
  if (named && chosen.length === 0) {
    return { ...NOT_BROWSING, inFileBrowser: true };
  }

  let studyCode = null;
  if (chosen.length) {
    studyCode = studyOf(chosen[0]);
  } else if (isKnownStudy(segment)) {
    studyCode = segment;
  }
  if (!studyCode) {
    return { ...NOT_BROWSING, inFileBrowser: true };
  }

  const available = studyCollections(studyCode, userType);
  // A hand-written list spanning studies would make the page title wrong and
  // break the one-study assumption the table and filters still rely on.
  const selected = chosen.filter((prefix) => studyOf(prefix) === studyCode);

  return {
    inFileBrowser: true,
    studyCode,
    available,
    selected,
    prefixes: selected.length ? selected : available,
  };
}
