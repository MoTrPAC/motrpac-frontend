import { describe, test, expect } from 'vitest';
import React from 'react';
import { screen, within } from '@testing-library/react';
import { renderWithProviders } from '../../testUtils/test-utils';
import BrowseDataFilter from '../browseDataFilter';
import vocabulary, { FACETS, facetOptions } from '../../lib/facetVocabulary';
import { entitledPrefixes } from '../../lib/collectionFiles';
import { studyCollections } from '../../lib/collectionScope';
import { transformData } from '../helper';
import browseDataReducer, { defaultBrowseDataState } from '../browseDataReducer';
import { types } from '../browseDataActions';

const noop = () => {};

function renderFilter({
  allFiles = [],
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
        browseData: { ...defaultBrowseDataState, allFiles },
        auth: { profile },
      },
    }
  );
}

const facetCard = (container, name) =>
  [...container.querySelectorAll('.filter-module')].find((card) =>
    within(card).queryByText(name)
  );

const buttons = (container, name) => [...facetCard(container, name).querySelectorAll('.filterBtn')];

describe('BrowseDataFilter - the panel does not depend on what has loaded', () => {
  test('renders without throwing before any collection has loaded', () => {
    // Reproduces the reported crash: an anonymous user clicks Browse Files and
    // the filter panel renders while the collection is still loading.
    expect(() => renderFilter()).not.toThrow();
  });

  test('every facet is offered with nothing loaded', () => {
    // Options used to be derived from the loaded files, so the panel was empty
    // until the fetch resolved and then reflowed on every study toggle.
    const { container } = renderFilter();
    ['Tissue', 'Omics', 'Assay'].forEach((name) => {
      expect(buttons(container, name).length).toBeGreaterThan(0);
    });
  });

  test('options outside the scope are disabled, not hidden', () => {
    const { container } = renderFilter({
      profile: { user_metadata: { userType: 'internal' } },
    });
    const tissue = buttons(container, 'Tissue');
    const inScope = facetOptions(
      'tissue_name',
      entitledPrefixes('internal'),
      studyCollections('rat-training-06', 'internal')
    );

    expect(tissue).toHaveLength(inScope.length);
    expect(tissue.filter((button) => !button.disabled)).toHaveLength(
      inScope.filter((option) => option.enabled).length
    );
    expect(tissue.some((button) => button.disabled)).toBe(true);
  });
});

describe('BrowseDataFilter - entitlement', () => {
  test('a value only a restricted collection carries is never offered', () => {
    // Disabling is a UI affordance. Entitlement is not: an option the user may
    // not reach must not appear at all.
    const internal = facetOptions('assay', entitledPrefixes('internal'), []);
    const external = facetOptions('assay', entitledPrefixes('external'), []);
    const anonymous = facetOptions('assay', entitledPrefixes(undefined), []);

    const values = (options) => options.map((option) => option.value);
    expect(values(external).every((value) => values(internal).includes(value))).toBe(true);
    expect(external.length).toBeLessThan(internal.length);
    expect(values(anonymous)).toEqual(values(external));
  });
});

describe('BrowseDataFilter - species tags', () => {
  // Same markup and class names the search feature uses, so the tags read the
  // same on both pages: <span class="filter-species-tag ml-1 badge badge-rat">R
  const tags = (button) =>
    [...button.querySelectorAll('.filter-species-tag')].map((span) => [
      span.textContent,
      span.className,
    ]);

  const EXPECTED = {
    Rat: ['R', 'filter-species-tag ml-1 badge badge-rat'],
    Human: ['H', 'filter-species-tag ml-1 badge badge-human'],
  };

  // Asserted against the vocabulary rather than named tissues: the committed
  // metadata is one record per collection (see `generator mock`), so no
  // particular value is guaranteed to be present. The rule is what matters --
  // one badge per species the value belongs to, rat first, matching the search
  // feature's markup exactly.
  test.each(FACETS.map((facet) => [facet.name, facet.keyName]))(
    'every %s option is badged with exactly the species that carry it',
    (name, keyName) => {
      const { container } = renderFilter({
        profile: { user_metadata: { userType: 'internal' } },
      });
      const options = facetOptions(keyName, entitledPrefixes('internal'), []);
      const rendered = buttons(container, name);
      expect(rendered).toHaveLength(options.length);

      rendered.forEach((button, index) => {
        const expected = ['Rat', 'Human']
          .filter((species) => options[index].species.includes(species))
          .map((species) => EXPECTED[species]);
        expect(tags(button)).toEqual(expected);
      });
    }
  );

  test('badges always read rat-first, never human-first', () => {
    // The corpus has values both species carry -- `Plasma` is one -- and they
    // must read "R H". Asserted as a subsequence of [R, H] so it holds however
    // many species a given option has.
    const { container } = renderFilter({
      profile: { user_metadata: { userType: 'internal' } },
    });
    const rendered = FACETS.flatMap((facet) => buttons(container, facet.name));
    expect(rendered.length).toBeGreaterThan(0);

    rendered.forEach((button) => {
      const initials = tags(button).map(([initial]) => initial);
      expect(initials).toEqual(['R', 'H'].filter((i) => initials.includes(i)));
    });
  });
});

describe('BrowseDataFilter - facets a collection cannot vary are absent', () => {
  test('no Genome Assembly, Category or Metadata facet', () => {
    // A collection has exactly one reference genome and exactly one category,
    // so those facets could only match everything or nothing. The Collection
    // picker expresses both -- each option names its kind and its genome.
    const { container } = renderFilter({
      profile: { user_metadata: { userType: 'internal' } },
    });
    expect(screen.queryByText('Genome Assembly')).not.toBeInTheDocument();
    expect(screen.queryByText('Category')).not.toBeInTheDocument();
    expect(screen.queryByText('Metadata')).not.toBeInTheDocument();
    expect(container.querySelector('.collection-filter-module')).toBeInTheDocument();
  });

  test('rendering does not mutate the shared vocabulary', () => {
    const before = JSON.stringify(vocabulary);
    renderFilter({ profile: { user_metadata: { userType: 'internal' } } });
    expect(JSON.stringify(vocabulary)).toBe(before);
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

  test('a human tissue filter matches on the superclass, under the one tissue key', () => {
    const human = [
      { object: 'a', species: 'Human', tissue_name: 'Human Muscle Powder', tissue_superclass: 'Muscle' },
      { object: 'b', species: 'Human', tissue_name: 'HUman EDTA Plasma', tissue_superclass: 'Plasma' },
    ];
    const next = applyFilter(human, 'tissue_name', 'Muscle');
    expect(next.filteredFiles.map((f) => f.object)).toEqual(['a']);
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
    // while its facet button sits disabled with nothing to explain why.
    const next = afterLoad(filters(['Liver'], ['RNA-seq']), [heartRna], ['b']);
    expect(next.activeFilters.tissue_name).toEqual([]);
    expect(next.activeFilters.assay).toEqual(['RNA-seq']);
    expect(next.filteredFiles.map((f) => f.object)).toEqual([heartRna.object]);
  });

  test('unrelated filters survive that removal', () => {
    const next = afterLoad(filters([], ['RNA-seq']), [heartRna], ['b']);
    expect(next.activeFilters.assay).toEqual(['RNA-seq']);
  });

  test('the loaded collections are recorded, with no per-study flags', () => {
    // The per-study booleans are gone: they could only ever describe one study,
    // and the browser can now hold several. Consumers read the loaded set.
    const next = afterLoad(defaultBrowseDataState.activeFilters, [liverRna], [
      'quant-id/rat-training-06/c1.0',
    ]);
    expect(next.loadedCollections).toEqual(['quant-id/rat-training-06/c1.0']);
    expect(Object.keys(next).some((key) => /DataSelected$/.test(key))).toBe(false);
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

  test('every row names its collection, from the object path', () => {
    const out = transformData([
      { object: 'quant-id/rat-training-06/c3.0/a.txt', phase: 'x', study: 'y' },
      { object: 'phenotype/human-precovid-sed-adu/c2.0/b.csv', phase: 'x', study: 'y' },
    ]);
    expect(out.map((row) => row.collection)).toEqual(['Quant-ID c3.0', 'Phenotype c2.0']);
  });
});
