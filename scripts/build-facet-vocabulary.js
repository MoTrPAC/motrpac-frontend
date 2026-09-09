/**
 * build-facet-vocabulary.js
 *
 * Build script that reads every collection metadata file and writes the facet
 * vocabulary the file browser's filter panel renders from.
 *
 * The panel shows all of its Tissue / Omics / Assay options at all times and
 * disables the ones no in-scope study can match. It therefore needs to know
 * every value in the corpus, not just the values in the collections currently
 * loaded -- and loading all 17 collections up front to find out would undo the
 * per-collection lazy loading and hand consortium-only metadata to anonymous
 * visitors.
 *
 * Deriving the vocabulary rather than hand-writing it is the point. The lists
 * this replaced -- `src/lib/assayList.js` and `src/lib/browseDataFilters.jsx`,
 * kept in the tree for reference but no longer imported -- were held in
 * agreement with the metadata by hand, and count differently from the data:
 *
 *   rat-training-06   29 assays listed, 21 in the data
 *   rat-acute-06      25 listed, 28 in the data
 *   human-precovid    22 listed, 46 in the data
 *
 * Not all of that gap was drift. Production's reducer returns every merged
 * metabolomics file for *any* Targeted/Untargeted assay selection, so an assay
 * a study never ran still returned rows -- the extra rat-training-06 entries
 * were reachable buttons, whatever they claimed to filter by. (Confirmed with
 * the BIC: pass1b-06 really did run only 7 targeted platforms; the other 8 are
 * pass1a-06's.) The 24 unlisted human assays and the 4 unlisted rat-acute-06
 * ones had no such backstop and were simply unreachable.
 *
 * Deriving removes the question: an option exists here if and only if some file
 * carries it, because this reads the files the table reads and asks
 * `fileFacets.js`, the same function the reducer matches with. Values that are
 * wrong in the metadata are repaired in the generator, not here -- see
 * `vocab.refine_omics` for the bare-"Proteomics" split.
 *
 * Run after regenerating collection metadata:
 *   yarn build-facet-vocabulary
 */

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import facetValues from '../src/lib/fileFacets.js';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const COLLECTIONS_DIR = join(ROOT, 'src/data/file_download_metadata/collections');
const OUTPUT = join(ROOT, 'src/data/file_download_metadata/facet-vocabulary.json');

/** The facets built here, in the order the panel renders them. */
const CATEGORIES = ['tissue_name', 'omics', 'assay'];

/** `quant-id_rat-training-06_c1.0-minified.json` -> `quant-id/rat-training-06/c1.0`. */
function prefixOf(filename) {
  return filename.replace(/-minified\.json$/, '').split('_').join('/');
}

function build() {
  // value -> { species: Set, collections: Set }, per category.
  const seen = new Map(CATEGORIES.map((category) => [category, new Map()]));

  const filenames = readdirSync(COLLECTIONS_DIR)
    .filter((name) => name.endsWith('.json'))
    .sort();

  filenames.forEach((filename) => {
    const prefix = prefixOf(filename);
    const files = JSON.parse(readFileSync(join(COLLECTIONS_DIR, filename), 'utf8'));

    files.forEach((file) => {
      // The filename is only a naming convention; `object` is the contract the
      // rest of the app resolves collections by. A mismatch means the two have
      // diverged and every prefix written here would be wrong.
      if (file.object && !file.object.startsWith(`${prefix}/`)) {
        throw new Error(`${filename}: object "${file.object}" is not under "${prefix}"`);
      }

      CATEGORIES.forEach((category) => {
        const values = seen.get(category);
        // Same rule the panel offers by and the reducer matches on, imported
        // rather than restated so the three cannot drift.
        facetValues(file, category).forEach((value) => {
          if (!values.has(value)) {
            values.set(value, { species: new Set(), collections: new Set() });
          }
          const entry = values.get(value);
          if (file.species) {
            entry.species.add(file.species);
          }
          entry.collections.add(prefix);
        });
      });
    });
  });

  const vocabulary = {};
  CATEGORIES.forEach((category) => {
    vocabulary[category] = [...seen.get(category).entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([value, entry]) => ({
        value,
        species: [...entry.species].sort(),
        collections: [...entry.collections].sort(),
      }));
  });

  writeFileSync(OUTPUT, `${JSON.stringify(vocabulary, null, 2)}\n`);

  const counts = CATEGORIES.map((c) => `${c}=${vocabulary[c].length}`).join(' ');
  process.stdout.write(`facet vocabulary: ${filenames.length} collections, ${counts}\n`);
}

build();
