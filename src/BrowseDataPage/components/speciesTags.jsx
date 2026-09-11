import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tooltip';

/**
 * The R / H species badges, and the legend that explains them.
 *
 * Markup, class names and colours are the search feature's
 * (`deaSearchResultFilters.jsx`, `search.scss`), copied rather than reinvented
 * so a badge means the same thing on both pages. Written once here because five
 * filter modules now show them.
 */

/** Rat first: the corpus is rat-dominant, so "R H" reads in frequency order. */
const ORDER = [
  { name: 'rat', initial: 'R', variant: 'badge-rat' },
  { name: 'human', initial: 'H', variant: 'badge-human' },
];

/**
 * `species` may be a single value or a list, in either case. The facet
 * vocabulary spells them "Rat"/"Human" because that is what the file metadata
 * says; `studyDataCards.js` spells them "rat"/"human". Accepting both keeps the
 * callers from each normalising it their own way.
 */
export function SpeciesTags({ species }) {
  const present = new Set(
    (Array.isArray(species) ? species : [species])
      .filter(Boolean)
      .map((value) => String(value).toLowerCase())
  );

  return ORDER.filter((tag) => present.has(tag.name)).map((tag) => (
    <span key={tag.name} className={`filter-species-tag ml-1 badge ${tag.variant}`}>
      {tag.initial}
    </span>
  ));
}

SpeciesTags.propTypes = {
  species: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
};

/**
 * The info icon beside a filter group's name.
 *
 * `id` has to be unique per instance -- react-tooltip resolves by id, so two
 * modules sharing one would anchor the same tooltip twice.
 */
export function SpeciesLegend({ id }) {
  const tooltipId = `${id}-species-legend`;
  return (
    <>
      <i
        className="bi bi-info-circle-fill ml-2 text-secondary"
        data-tooltip-id={tooltipId}
        data-tooltip-html="<span>H = Human, R = Rat</span>"
        data-tooltip-place="right"
      />
      <Tooltip id={tooltipId} />
    </>
  );
}

SpeciesLegend.propTypes = {
  id: PropTypes.string.isRequired,
};
