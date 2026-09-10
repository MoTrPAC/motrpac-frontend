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
 *   /data-download/file-browser/all                             every study
 *   /data-download/file-browser                                 the default study
 *
 * One path segment is a study code, three are a collection prefix; the two
 * cannot collide. An empty collection selection means "every collection in
 * scope", matching the Tissue/Omics/Assay facets where an empty selection means
 * no constraint.
 *
 * A bare URL is a destination, not a fall-through: the browser is reachable
 * without going through the cards. It opens on DEFAULT_STUDY rather than on
 * everything, because "no scope was named" is not the same as "no constraint
 * within a scope", and loading every study for a glancing visitor is a poor
 * trade.
 *
 * `/all` is what "no scope named" is not: an explicit request for everything,
 * reached by deselecting the last study or selecting them all. It has to be
 * written down rather than inferred from an empty study list, because an empty
 * study list already means something else -- the URL asked for collections this
 * user may not see -- and turning that denial into "show everything" would be a
 * grant, not a fallback.
 */
export const FILE_BROWSER_PATH = '/data-download/file-browser';

/** Opened when the URL names no scope: the one study every visitor can reach. */
export const DEFAULT_STUDY = 'rat-training-06';

/**
 * Stands in for every study in the URL, so the scope survives a bookmark even
 * as the corpus grows and regardless of who opens it. Safe as a path segment
 * because no card uses it as a code -- `isKnownStudy('all')` is false.
 */
export const ALL_STUDIES = 'all';

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

/** Every collection of these studies that this user may see. */
export function scopeCollections(studyCodes, userType) {
  const wanted = new Set(studyCodes);
  return entitledPrefixes(userType).filter((prefix) => wanted.has(studyOf(prefix)));
}

/** Every study this user may see anything of, in card order. */
export function availableStudies(userType) {
  return [...new Set(entitledPrefixes(userType).map(studyOf))].filter(Boolean);
}

/**
 * The study list to write back into a URL for a resolved scope.
 *
 * Both the Study picker and the Collection picker rebuild the URL, and neither
 * should have to remember that "everything" has its own spelling.
 */
export function scopeStudies(scope) {
  return scope.allStudies ? [ALL_STUDIES] : scope.studyCodes;
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
  const studies = `studies=${studyCodes.join(',')}`;
  return `${FILE_BROWSER_PATH}?${[studies, query].filter(Boolean).join('&')}`;
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
  allStudies: false,
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
 * `allStudies` records that the scope was asked for as "everything" rather than
 * as a list that happens to be complete, so rebuilding the URL keeps the short
 * form. `studyCodes` is expanded either way -- callers render from it and never
 * see the sentinel.
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

  const studiesParam = listParam(location.search, 'studies');
  const namedStudies = studiesParam.filter(isKnownStudy);
  const everything = segment === ALL_STUDIES || studiesParam.includes(ALL_STUDIES);

  // Study and collection answer different questions -- which collections are
  // offered, and which of them are loaded -- so an explicit study scope outlives
  // a collection selection. Deriving the scope from the selection instead meant
  // picking one collection disabled every other study's buttons, which made a
  // second study's collection unreachable by clicking.
  let studyCodes;
  let allStudies = false;
  if (everything) {
    studyCodes = availableStudies(userType);
    allStudies = true;
  } else {
    const selectedStudies = selected.map(studyOf).filter(Boolean);
    studyCodes = [...new Set([...namedStudies, ...selectedStudies])];
    if (studyCodes.length === 0) {
      if (isKnownStudy(segment)) {
        studyCodes = [segment];
      } else if (!segment) {
        studyCodes = [DEFAULT_STUDY];
      }
    }
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
    allStudies,
  };
}
