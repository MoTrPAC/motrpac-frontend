import { describe, expect, test } from 'vitest';
import facetValues from '../fileFacets';

describe('facetValues - the shapes a metadata field takes', () => {
  test('a single value is one option', () => {
    expect(facetValues({ assay: 'RNA-seq' }, 'assay')).toEqual(['RNA-seq']);
  });

  test('a comma-joined value is split', () => {
    // Merged metabolomics files name every assay they cover in one string.
    expect(
      facetValues({ assay: 'Targeted Amines, Targeted Tricarboxylic Acid Cycle' }, 'assay')
    ).toEqual(['Targeted Amines', 'Targeted Tricarboxylic Acid Cycle']);
  });

  test('an array is split', () => {
    expect(facetValues({ omics: ['Epigenomics', 'Transcriptomics'] }, 'omics')).toEqual([
      'Epigenomics',
      'Transcriptomics',
    ]);
  });

  test('an array element that is itself comma-joined is split too', () => {
    // `analysis/human-precovid-sed-adu/c1.3` really does carry this shape.
    // Splitting the array but not its elements offered "Transcriptomics,
    // Proteomics" as a single facet option, which is not an ome.
    expect(
      facetValues({ omics: ['Epigenomics', 'Transcriptomics, Proteomics'] }, 'omics')
    ).toEqual(['Epigenomics', 'Transcriptomics', 'Proteomics']);
  });

  test('absent, empty and null fields yield nothing', () => {
    expect(facetValues({}, 'assay')).toEqual([]);
    expect(facetValues({ assay: '' }, 'assay')).toEqual([]);
    expect(facetValues({ assay: null }, 'assay')).toEqual([]);
  });
});

describe('facetValues - tissue is named at a different grain per species', () => {
  const human = {
    species: 'Human',
    tissue_name: 'Human Muscle Powder',
    tissue_superclass: 'Muscle',
  };
  const rat = { species: 'Rat', tissue_name: 'Heart', tissue_superclass: 'Muscle' };

  test('human files report their superclass', () => {
    // "Human Muscle" and "Human Muscle Powder" are the same tissue, and one row
    // carries a typo ("HUman EDTA Plasma"). The superclass is the grain that
    // means something.
    expect(facetValues(human, 'tissue_name')).toEqual(['Muscle']);
  });

  test('rat files stay at the specimen level', () => {
    // Heart and Gastrocnemius are both superclass "Muscle"; collapsing them
    // would merge distinct specimens.
    expect(facetValues(rat, 'tissue_name')).toEqual(['Heart']);
  });

  test('the rule is the same one field away from the panel and the matcher', () => {
    // One facet key for both species; the per-file rule decides which field it
    // reads, so the options offered and the matching done cannot disagree.
    expect(facetValues({ ...human, tissue_superclass: 'Plasma' }, 'tissue_name')).toEqual([
      'Plasma',
    ]);
  });
});
