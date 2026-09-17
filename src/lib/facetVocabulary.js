import vocabulary from '../data/file_download_metadata/facet-vocabulary.json';

/**
 * Every value the Tissue, Omics and Assay facets can offer, and which
 * collections offer it.
 *
 * Built from the shipped collection metadata by
 * `scripts/build-facet-vocabulary.js`, so an option exists here if and only if
 * some file carries it. The hand-maintained lists this replaces had drifted in
 * both directions: rat-training-06 offered 8 assay buttons that matched zero
 * files, rat-acute-06 was missing 4 assays it does have, and 24 of
 * human-precovid's assays were unreachable.
 *
 * Deriving the options from the *loaded* files instead would be simpler, but the
 * panel now shows every option at all times and only disables the ones no
 * in-scope study can match -- which needs the whole corpus, not the part of it
 * currently in memory.
 *
 * There is no Genome Assembly or Category facet: a collection has exactly one of
 * each, so filtering by either within a collection matches everything or
 * nothing. The Collection picker expresses both.
 */

/** The facets the filter panel renders, in order. */
export const FACETS = [
  { keyName: 'tissue_name', name: 'Tissue' },
  { keyName: 'omics', name: 'Omics' },
  { keyName: 'assay', name: 'Assay' },
];

/**
 * The options to render for one facet.
 *
 * `entitled` decides which options exist at all -- a value whose only source is
 * a collection this user may not see is not theirs to know about. `inScope`
 * decides which are enabled: the rest stay visible so the panel does not reflow
 * as studies are picked, but cannot be clicked into an empty table.
 */
export function facetOptions(category, entitled, inScope) {
  const permitted = new Set(entitled);
  const scoped = new Set(inScope);

  return (vocabulary[category] || [])
    .filter((entry) => entry.collections.some((prefix) => permitted.has(prefix)))
    .map((entry) => ({
      value: entry.value,
      species: entry.species,
      enabled: entry.collections.some((prefix) => scoped.has(prefix)),
    }));
}

export default vocabulary;
