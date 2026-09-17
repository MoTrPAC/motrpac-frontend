import { describe, test, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { SPECIES_LEGEND_ID, SpeciesLegend, SpeciesTags } from '../speciesTags';

const tags = (container) =>
  [...container.querySelectorAll('.filter-species-tag')].map((span) => [
    span.textContent,
    span.className,
  ]);

describe('SpeciesTags', () => {
  test('renders the search feature’s markup exactly', () => {
    // Copied from deaSearchResultFilters.jsx so a badge means the same thing on
    // both pages; asserted on the full class string so a drift fails here.
    const { container } = render(<SpeciesTags species={['Rat', 'Human']} />);
    expect(tags(container)).toEqual([
      ['R', 'filter-species-tag ml-1 badge badge-rat'],
      ['H', 'filter-species-tag ml-1 badge badge-human'],
    ]);
  });

  test('is rat-first whatever order it is given', () => {
    const { container } = render(<SpeciesTags species={['Human', 'Rat']} />);
    expect(tags(container).map(([initial]) => initial)).toEqual(['R', 'H']);
  });

  test('accepts both spellings and a bare string', () => {
    // The facet vocabulary says "Rat"/"Human" because the file metadata does;
    // studyDataCards.js says "rat"/"human".
    ['rat', 'Rat'].forEach((value) => {
      const { container } = render(<SpeciesTags species={value} />);
      expect(tags(container).map(([initial]) => initial)).toEqual(['R']);
    });
  });

  test('renders nothing when the species is unknown', () => {
    [null, undefined, [], 'fish'].forEach((value) => {
      const { container } = render(<SpeciesTags species={value} />);
      expect(container.querySelectorAll('.filter-species-tag')).toHaveLength(0);
    });
  });
});

describe('SpeciesLegend', () => {
  test('carries the same wording the search filters use', () => {
    const { container } = render(<SpeciesLegend />);
    const icon = container.querySelector('i');
    expect(icon.className).toContain('bi-info-circle-fill');
    expect(icon.getAttribute('data-tooltip-html')).toBe('<span>H = Human, R = Rat</span>');
  });

  test('is an anchor only, pointing every group at the one shared tooltip', () => {
    // One `<Tooltip>` serves any number of anchors. Rendering one per group
    // would mount five components doing the same work for the same text.
    const { container } = render(<SpeciesLegend />);
    expect(container.querySelector('i').getAttribute('data-tooltip-id')).toBe(
      SPECIES_LEGEND_ID
    );
    expect(container.querySelector('.react-tooltip')).toBeNull();
  });
});
