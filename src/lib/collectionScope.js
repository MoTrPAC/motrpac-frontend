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
 *   /data-download/file-browser/rat-training-06                 all of a study
 *   /data-download/file-browser/rat-training-06?collections=a,b some of a study
 *   /data-download/file-browser?studies=a,b                     several studies
 *   /data-download/file-browser                                 every study
 *
 * One path segment is a study code, three are a collection prefix; the two
 * cannot collide.
 *
 * **An empty selection means no constraint**, and that holds for studies exactly
 * as it does for collections and for the Tissue/Omics/Assay facets: no study
 * named is every study, rendered as no button pressed. Representing "everything"
 * as every button pressed instead -- which is what an expanded study list would
 * do -- made the Study picker the one control where clearing the last selection
 * appeared to select them all.
 *
 * The one state that is *not* "no constraint" is a refusal: a URL naming only
 * collections this user may not see. `resolveScope` returns early there with an
 * empty `prefixes`, so callers distinguish the two by `prefixes`, never by an
 * empty `studyCodes`.
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

/**
 * A collection's version code, e.g. "c1.0".
 *
 * Just the version: the file table shows this beside a Type column that already
 * says Quant-ID / Analysis / Phenotype, so prefixing the kind repeats it on
 * every row. The Collection *picker* does prefix it, because its options are
 * grouped by study and "c1.0" alone cannot tell Quant-ID from Analysis there.
 *
 * Memoised because the table asks per row and `findCollection` scans every card.
 */
const COLLECTION_VERSIONS = new Map();
export function collectionVersion(prefix) {
  if (!COLLECTION_VERSIONS.has(prefix)) {
    const owner = findCollection(prefix);
    COLLECTION_VERSIONS.set(prefix, owner ? owner.version.collection : '');
  }
  return COLLECTION_VERSIONS.get(prefix);
}

/** A study's display name, or null when the code is unknown. */
export function studyName(code) {
  const card = allDataCards.find((entry) => entry.code === code);
  return card ? card.name : null;
}

export function isKnownStudy(code) {
  return allDataCards.some((card) => card.code === code);
}

/** Every collection of one study that this user may see. */
export function studyCollections(studyCode, userType) {
  return entitledPrefixes(userType).filter((prefix) => studyOf(prefix) === studyCode);
}

/**
 * Every collection of these studies that this user may see.
 *
 * No study named is every study, the same way no tissue selected is every
 * tissue.
 */
export function scopeCollections(studyCodes, userType) {
  const entitled = entitledPrefixes(userType);
  if (studyCodes.length === 0) {
    return entitled;
  }
  const wanted = new Set(studyCodes);
  return entitled.filter((prefix) => wanted.has(studyOf(prefix)));
}

/** Every study this user may see anything of, in card order. */
export function availableStudies(userType) {
  return [...new Set(entitledPrefixes(userType).map(studyOf))].filter(Boolean);
}

/**
 * The URL for a scope and selection.
 *
 * Single-study forms are kept exactly as they were, so links and bookmarks made
 * before the browser could span studies still resolve.
 */
export function scopeToPath(studyCodes, selected) {
  // The bare-collection form carries no study scope, so it is only usable when
  // the scope is the one that collection implies -- which is what the cards'
  // Browse Files links produce. From a wider scope it would silently narrow the
  // scope on the next read, disabling every other study's collections.
  const implied = selected.length === 1 ? studyOf(selected[0]) : null;
  if (implied && studyCodes.length === 1 && studyCodes[0] === implied) {
    return `${FILE_BROWSER_PATH}/${selected[0]}`;
  }
  const query = selected.length ? `collections=${selected.join(',')}` : '';
  if (studyCodes.length === 1) {
    const path = `${FILE_BROWSER_PATH}/${studyCodes[0]}`;
    return query ? `${path}?${query}` : path;
  }
  // No study named is the bare path: every study, no button pressed.
  const studies = studyCodes.length ? `studies=${studyCodes.join(',')}` : '';
  const search = [studies, query].filter(Boolean).join('&');
  return search ? `${FILE_BROWSER_PATH}?${search}` : FILE_BROWSER_PATH;
}

function trimSlashes(value) {
  return value.replace(/^\/+|\/+$/g, '');
}

const NOT_BROWSING = Object.freeze({
  inFileBrowser: false,
  studyCodes: [],
  available: [],
  selected: [],
  prefixes: [],
});

function listParam(search, key) {
  return (new URLSearchParams(search).get(key) || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}

/**
 * Resolve a location into the scope to render.
 *
 * `studyCodes` is what is in scope, `selected` the explicit collection choice
 * ([] meaning all of `available`), and `prefixes` what to load. An empty
 * `prefixes` while `inFileBrowser` means the URL asked for collections this
 * user may not see, and the caller should fall through to the download page.
 *
 * An empty `studyCodes` with a non-empty `prefixes` means every study; an empty
 * `studyCodes` with an empty `prefixes` means the URL asked for collections this
 * user may not see. Those are the only two, and `prefixes` tells them apart.
 */
export function resolveScope(location, userType) {
  if (!location.pathname.startsWith(FILE_BROWSER_PATH)) {
    return NOT_BROWSING;
  }

  const segment = trimSlashes(location.pathname.slice(FILE_BROWSER_PATH.length));
  const permitted = new Set(entitledPrefixes(userType));

  const requested = listParam(location.search, 'collections').filter(isKnownCollection);
  const pathNamesCollection = isKnownCollection(segment);

  const namedCollections = pathNamesCollection || requested.length > 0;
  const fromQuery = requested.filter((prefix) => permitted.has(prefix));
  const fromPath = pathNamesCollection && permitted.has(segment) ? [segment] : [];
  const selected = fromQuery.length ? fromQuery : fromPath;

  // The URL asked for specific collections and none are permitted. Distinct
  // from asking for none, which legitimately means "all of the scope".
  if (namedCollections && selected.length === 0) {
    return { ...NOT_BROWSING, inFileBrowser: true };
  }

  // A path segment that names neither a study nor a collection is a bad URL, not
  // an absent one. Now that no study named means *every* study, letting it fall
  // through would answer a typo with the whole corpus.
  if (segment && !isKnownStudy(segment) && !pathNamesCollection) {
    return { ...NOT_BROWSING, inFileBrowser: true };
  }

  const namedStudies = listParam(location.search, 'studies').filter(isKnownStudy);

  // Study and collection answer different questions -- which collections are
  // offered, and which of them are loaded -- so an explicit study scope outlives
  // a collection selection. Deriving the scope from the selection instead meant
  // picking one collection disabled every other study's buttons, which made a
  // second study's collection unreachable by clicking.
  //
  // The exception is the single-collection path form the study cards link to:
  // there the collection *is* the scope the user asked for, and its study
  // belongs in the picker.
  let studyCodes = namedStudies;
  if (studyCodes.length === 0) {
    if (isKnownStudy(segment)) {
      studyCodes = [segment];
    } else if (pathNamesCollection && selected.length) {
      studyCodes = [...new Set(selected.map(studyOf))].filter(Boolean);
    }
    // Otherwise: no study named, which means every study.
  }

  const available = scopeCollections(studyCodes, userType);
  if (available.length === 0) {
    // An unknown study, or one this user may see nothing of.
    return { ...NOT_BROWSING, inFileBrowser: true };
  }

  return {
    inFileBrowser: true,
    studyCodes,
    available,
    selected,
    prefixes: selected.length ? selected : available,
  };
}
