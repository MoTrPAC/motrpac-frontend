/**
 * The values a file offers to a facet.
 *
 * One rule, used by both the facet builder and the matching predicate. Written
 * once because the two must agree: an option the panel offers that the matcher
 * cannot match returns an empty table, and a value the matcher accepts that the
 * panel never offers is unreachable.
 */

/**
 * A field may hold one value, a comma-joined list, or a JSON array -- and an
 * array element may itself be comma-joined.
 *
 * `analysis/human-precovid-sed-adu/c1.3` carries
 * `omics: ['Epigenomics', 'Transcriptomics, Proteomics']`. Splitting the array
 * but not its elements offered "Transcriptomics, Proteomics" as one facet
 * option, which is not an ome and matched only the files spelling it that way.
 * Both shapes mean the same thing, so both are flattened the same way.
 */
function toList(raw) {
  if (raw === null || raw === undefined || raw === '') {
    return [];
  }
  const parts = Array.isArray(raw) ? raw : [raw];
  return parts
    .flatMap((part) => String(part).split(','))
    .map((value) => value.trim())
    .filter(Boolean);
}

/**
 * Tissue is named at different grains per species, the same way the search
 * feature does it.
 *
 * Rat files name a specimen -- Gastrocnemius, Heart, Liver. Human files name
 * variants of one specimen: "Human Muscle" and "Human Muscle Powder" are the
 * same tissue, and one row even carries a typo. Their superclass (Adipose,
 * Blood, Muscle, Plasma) is the grain that means something, so human files
 * report that instead.
 *
 * Doing this per file rather than per panel is what lets one Tissue facet serve
 * a scope holding both species.
 */
function tissueValues(file) {
  return toList(file.species === 'Human' ? file.tissue_superclass : file.tissue_name);
}

export default function facetValues(file, category) {
  return category === 'tissue_name' ? tissueValues(file) : toList(file[category]);
}
