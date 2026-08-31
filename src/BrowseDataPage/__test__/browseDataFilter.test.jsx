import { describe, test, expect, vi } from 'vitest';
import React from 'react';
import { screen, within } from '@testing-library/react';
import { renderWithProviders } from '../../testUtils/test-utils';
import BrowseDataFilter from '../browseDataFilter';
import browseDataFilters from '../../lib/browseDataFilters';
import { transformData } from '../helper';
import browseDataReducer, { defaultBrowseDataState } from '../browseDataReducer';
import { types } from '../browseDataActions';

const noop = () => {};

function renderFilter({
  allFiles = [],
  flags = {},
  profile = {},
  route = '/data-download/file-browser/rat-training-06',
} = {}) {
  return renderWithProviders(
    <BrowseDataFilter
      activeFilters={defaultBrowseDataState.activeFilters}
      onChangeFilter={noop}
      onResetFilters={noop}
    />,
    {
      route,
      preloadedState: {
        browseData: { ...defaultBrowseDataState, allFiles, ...flags },
        auth: { profile },
      },
    }
  );
}

describe('BrowseDataFilter - no study selected', () => {
  test('renders without throwing before any collection has loaded', () => {
    // Reproduces the reported crash: an anonymous user clicks Browse Files and
    // the filter panel renders while the collection is still loading, so none
    // of the per-study flags is set yet. `filters` was left as an object and
    // `item.filters.map` threw "item.filters.map is not a function".
    expect(() => renderFilter()).not.toThrow();
  });

  test('offers no facets when nothing is loaded', () => {
    const { container } = renderFilter();
    // Category/Metadata have static options, so they remain; the derived facets
    // must not appear with zero files behind them.
    expect(screen.queryByText('Tissue')).not.toBeInTheDocument();
    expect(container.querySelectorAll('.filter-module').length).toBeGreaterThan(0);
  });
});

describe('BrowseDataFilter - facets follow the loaded files', () => {
  const files = [
    {
      object: 'quant-id/rat-training-06/c3.0/a.txt',
      tissue_name: 'Liver',
      omics: 'Epigenomics',
      assay: 'RRBS',
      reference_genome: 'RN8',
      category: 'Quant-ID',
    },
    {
      object: 'quant-id/rat-training-06/c3.0/b.txt',
      tissue_name: 'Heart',
      omics: 'Transcriptomics',
      assay: 'RNA-seq',
      reference_genome: 'RN8',
      category: 'Quant-ID',
    },
  ];

  test('shows only values present in the loaded collection', () => {
    const { container } = renderFilter({ allFiles: files });
    const tissue = [...container.querySelectorAll('.filter-module')].find((card) =>
      within(card).queryByText('Tissue')
    );

    const labels = [...tissue.querySelectorAll('.filterBtn')].map((b) => b.textContent);
    expect(labels).toEqual(['Heart', 'Liver']);
  });

  test('facets a collection cannot vary are absent', () => {
    // A collection has exactly one reference genome and exactly one category,
    // so those facets could only match everything or nothing. The Collection
    // picker expresses both -- each option names its kind and its genome.
    const { container } = renderFilter({
      allFiles: files,
      profile: { user_metadata: { userType: 'internal' } },
    });
    expect(screen.queryByText('Genome Assembly')).not.toBeInTheDocument();
    expect(screen.queryByText('Category')).not.toBeInTheDocument();
    expect(screen.queryByText('Metadata')).not.toBeInTheDocument();
    expect(container.querySelector('.collection-filter-module')).toBeInTheDocument();
  });

  test('comma-joined multi-values are split into separate options', () => {
    const merged = [
      {
        object: 'analysis/rat-training-06/c1.0/m.txt',
        assay: 'Targeted Amines, Targeted Tricarboxylic Acid Cycle',
        omics: 'Metabolomics',
        tissue_name: 'Liver',
        category: 'Analysis',
      },
    ];
    const { container } = renderFilter({ allFiles: merged });
    const assay = [...container.querySelectorAll('.filter-module')].find((card) =>
      within(card).queryByText('Assay')
    );
    expect([...assay.querySelectorAll('.filterBtn')].map((b) => b.textContent)).toEqual([
      'Targeted Amines',
      'Targeted Tricarboxylic Acid Cycle',
    ]);
  });

  test('rendering does not mutate the shared filter config', () => {
    const before = JSON.stringify(browseDataFilters);
    renderFilter({ allFiles: files });
    expect(JSON.stringify(browseDataFilters)).toBe(before);
  });
});

describe('browseDataReducer - filter matching', () => {
  function applyFilter(allFiles, category, filter) {
    const state = { ...defaultBrowseDataState, allFiles };
    return browseDataReducer(state, { type: types.CHANGE_FILTER, category, filter });
  }

  test('matches a file whose value is comma-joined with others', () => {
    const files = [
      { object: 'a', assay: 'Targeted Amines, Targeted Ceramides', tissue_name: 'Liver' },
      { object: 'b', assay: 'RRBS', tissue_name: 'Liver' },
    ];
    const next = applyFilter(files, 'assay', 'Targeted Amines');
    expect(next.filteredFiles.map((f) => f.object)).toEqual(['a']);
  });

  test('does not match on a partial value', () => {
    const files = [{ object: 'a', assay: 'Targeted Amines', tissue_name: 'Liver' }];
    const next = applyFilter(files, 'assay', 'Amines');
    expect(next.filteredFiles).toEqual([]);
  });

  test('asking for a specific metabolomics ome still surfaces merged files', () => {
    const files = [
      { object: 'merged', omics: 'Metabolomics', tissue_name: 'Liver' },
      { object: 'other', omics: 'Epigenomics', tissue_name: 'Liver' },
    ];
    const next = applyFilter(files, 'omics', 'Metabolomics Targeted');
    expect(next.filteredFiles.map((f) => f.object)).toEqual(['merged']);
  });
});

describe('browseDataReducer - a collection change prunes filters instead of wiping them', () => {
  const liverRna = { object: 'quant-id/rat-training-06/c1.0/a.txt', tissue_name: 'Liver', assay: 'RNA-seq' };
  const heartRna = { object: 'quant-id/rat-training-06/c2.0/b.txt', tissue_name: 'Heart', assay: 'RNA-seq' };

  function afterLoad(activeFilters, files, prefixes) {
    return browseDataReducer(
      { ...defaultBrowseDataState, activeFilters },
      { type: types.SELECT_COLLECTIONS_SUCCESS, prefixes, selection: prefixes, files }
    );
  }

  const filters = (tissue, assay) => ({
    ...defaultBrowseDataState.activeFilters,
    tissue_name: tissue,
    assay,
  });

  test('filters survive when their values are still present', () => {
    const next = afterLoad(filters(['Liver'], ['RNA-seq']), [liverRna, heartRna], ['a', 'b']);
    expect(next.activeFilters.tissue_name).toEqual(['Liver']);
    expect(next.activeFilters.assay).toEqual(['RNA-seq']);
    expect(next.filteredFiles.map((f) => f.object)).toEqual([liverRna.object]);
  });

  test('a filter whose only source collection was removed is dropped', () => {
    // Liver is gone from the loaded set; keeping it active would empty the table
    // with its facet button no longer visible to explain why.
    const next = afterLoad(filters(['Liver'], ['RNA-seq']), [heartRna], ['b']);
    expect(next.activeFilters.tissue_name).toEqual([]);
    expect(next.activeFilters.assay).toEqual(['RNA-seq']);
    expect(next.filteredFiles.map((f) => f.object)).toEqual([heartRna.object]);
  });

  test('unrelated filters survive that removal', () => {
    const next = afterLoad(filters([], ['RNA-seq']), [heartRna], ['b']);
    expect(next.activeFilters.assay).toEqual(['RNA-seq']);
  });

  test('exactly one per-study flag is true after any collection change', () => {
    const next = afterLoad(defaultBrowseDataState.activeFilters, [liverRna], [
      'quant-id/rat-training-06/c1.0',
    ]);
    const flags = [
      next.pass1b06DataSelected,
      next.pass1a06DataSelected,
      next.humanPrecovidSedAduDataSelected,
    ];
    expect(flags.filter(Boolean)).toHaveLength(1);
    expect(next.pass1b06DataSelected).toBe(true);
  });
});

describe('tissue facets are grouped for human data', () => {
  const human = [
    { object: 'analysis/human-precovid-sed-adu/c1.3/a.txt', species: 'Human',
      tissue_name: 'Human Muscle Powder', tissue_superclass: 'Muscle' },
    { object: 'analysis/human-precovid-sed-adu/c1.3/b.txt', species: 'Human',
      tissue_name: 'Human Muscle', tissue_superclass: 'Muscle' },
    { object: 'analysis/human-precovid-sed-adu/c1.3/c.txt', species: 'Human',
      tissue_name: 'HUman EDTA Plasma', tissue_superclass: 'Plasma' },
    { object: 'analysis/human-precovid-sed-adu/c1.3/d.txt', species: 'Human',
      tissue_name: 'Human EDTA Packed Cells', tissue_superclass: 'Blood' },
    { object: 'analysis/human-precovid-sed-adu/c1.3/e.txt', species: 'Human',
      tissue_name: 'Human Adipose Powder', tissue_superclass: 'Adipose' },
  ];

  const rat = [
    { object: 'quant-id/rat-training-06/c1.0/a.txt', species: 'Rat',
      tissue_name: 'Heart', tissue_superclass: 'Muscle' },
    { object: 'quant-id/rat-training-06/c1.0/b.txt', species: 'Rat',
      tissue_name: 'Gastrocnemius', tissue_superclass: 'Muscle' },
  ];

  const tissueOptions = (container) => {
    const card = [...container.querySelectorAll('.filter-module')].find((node) =>
      within(node).queryByText('Tissue')
    );
    return [...card.querySelectorAll('.filterBtn')].map((b) => b.textContent);
  };

  test('human tissues collapse to the four superclasses', () => {
    // The raw names are variants of one specimen and include a typo
    // ("HUman EDTA Plasma"); the superclass is the grain that means something.
    const { container } = renderFilter({ allFiles: human });
    expect(tissueOptions(container)).toEqual(['Adipose', 'Blood', 'Muscle', 'Plasma']);
  });

  test('rat tissues stay at the specimen level', () => {
    // Heart and Gastrocnemius are both superclass "Muscle"; collapsing them
    // would merge distinct specimens.
    const { container } = renderFilter({ allFiles: rat });
    expect(tissueOptions(container)).toEqual(['Gastrocnemius', 'Heart']);
  });

  test('a human tissue filter matches on the superclass', () => {
    const state = { ...defaultBrowseDataState, allFiles: human };
    const next = browseDataReducer(state, {
      type: types.CHANGE_FILTER, category: 'tissue_superclass', filter: 'Muscle',
    });
    expect(next.filteredFiles.map((f) => f.object.slice(-5))).toEqual(['a.txt', 'b.txt']);
  });
});

describe('rendering the table does not rewrite the data behind the filters', () => {
  test('transformData leaves the caller’s records untouched', () => {
    // These objects are `browseData.allFiles`. Mutating them made the tissue
    // pickers swap from names to superclasses after the first render, and made
    // clicks stop matching.
    const files = [{
      object: 'analysis/human-precovid-sed-adu/c1.3/x.txt',
      phase: 'HUMAN-PRECOVID-SED-ADU',
      study: 'Acute Exercise',
      tissue_name: 'Human Muscle Powder',
      tissue_superclass: 'Muscle',
      omics: 'Proteomics',
      assay: 'Global Proteomics',
    }];
    const snapshot = JSON.stringify(files);
    const out = transformData(files);

    expect(JSON.stringify(files)).toBe(snapshot);
    expect(out[0].tissue_name).toBe('Muscle');
  });
});
