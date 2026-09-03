/**
 * Reading the study/collection model, and the access rules over it.
 *
 * A kind's entry list is one of two shapes:
 *
 *   phenotype: [ {collection, storageLocation, ...}, ... ]            one series
 *   phenotype: [ {name, description, collections: [...] }, ... ]     named series
 *
 * The second exists because a kind is not always a single lineage. Human Main
 * Study's phenotype arrives as separate sub-collections -- sedentary adults,
 * pediatric participants -- each with its own version series, so `c2.0` of one
 * is not a later version of `c1.0` of another.
 */

/** Entries that carry a storageLocation are versions; the rest are series. */
function isVersion(entry) {
  return Boolean(entry && entry.storageLocation);
}

/**
 * Normalise a kind's entries into named series.
 *
 * A bare version list becomes one unnamed series, so every caller can treat the
 * model uniformly without checking which shape it was given.
 */
export function collectionSeries(entries) {
  const list = entries || [];
  if (list.length === 0) {
    return [];
  }
  if (list.every(isVersion)) {
    return [{ code: null, name: null, description: null, versions: list }];
  }
  return list
    .filter((entry) => !isVersion(entry))
    .map((entry) => ({
      code: entry.code || null,
      name: entry.name || entry.cardTitle || entry.code || null,
      description: entry.description || null,
      // Named `collections` in config because each entry *is* a collection; the
      // code calls the list `versions` because within one series they are
      // successive versions of the same thing.
      versions: entry.collections || [],
    }));
}

/** Every version of a kind, flattened across its series. */
export function allVersions(entries) {
  return collectionSeries(entries).flatMap((series) => series.versions);
}

/**
 * The release stages a version carries.
 *
 * Normally one, but a collection whose datasets were released at different times
 * can name several ("consortium, early"), which the prototype shows as
 * "EA / CR — varies by dataset".
 */
export function versionStages(version) {
  return String(version.releaseStage || '')
    .split(',')
    .map((stage) => stage.trim())
    .filter(Boolean);
}

/**
 * Versions this user may see.
 *
 * Two rules:
 *
 * 1. A collection holding *only* early-access files is not distributed through
 *    the data download feature at all -- not even to internal users. A mixed
 *    collection is still distributed on the strength of its released files.
 * 2. A mixed-stage collection is public only if *every* stage it names is
 *    public. Taking the most permissive stage instead would expose consortium
 *    datasets inside a collection that also holds public ones.
 */
export function visibleVersions(versions, userType) {
  return (versions || []).filter((version) => {
    const stages = versionStages(version);
    if (stages.length > 0 && stages.every((stage) => stage === 'early')) {
      return false;
    }
    if (userType === 'internal') {
      return true;
    }
    return stages.length > 0 && stages.every((stage) => stage === 'public');
  });
}

/** Series with their versions filtered by entitlement; empty series dropped. */
export function visibleSeries(entries, userType) {
  return collectionSeries(entries)
    .map((series) => ({ ...series, versions: visibleVersions(series.versions, userType) }))
    .filter((series) => series.versions.length > 0);
}

export function hasVisibleCollections(study, userType) {
  return Object.values(study.dataTypes).some(
    (entries) => visibleSeries(entries, userType).length > 0
  );
}
