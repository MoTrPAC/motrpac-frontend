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

/** All five filter groups explain the badges the same way, so they share one. */
export const SPECIES_LEGEND_ID = 'species-legend';

/**
 * The info icon beside a filter group's name.
 *
 * Anchor only. react-tooltip resolves by id, and one `<Tooltip>` serves any
 * number of anchors -- rendering one per group would mount five components that
 * each do the same mount-time state update for the same text. The single
 * instance lives in `SpeciesLegendTooltip`, which the filter panel renders once.
 */
export function SpeciesLegend() {
  return (
    <i
      className="bi bi-info-circle-fill ml-2 text-secondary"
      data-tooltip-id={SPECIES_LEGEND_ID}
      data-tooltip-html="<span>H = Human, R = Rat</span>"
      data-tooltip-place="right"
    />
  );
}

/**
 * The one tooltip every `SpeciesLegend` anchors to.
 *
 * Rendered by the filter panel, not by the groups: a group shown on its own --
 * which only happens in tests -- keeps its icon and simply has nothing to pop
 * up, rather than each group carrying a duplicate.
 *
 * The class is not cosmetic. react-tooltip ships the tooltip as `position:
 * absolute` with no z-index, and a Bootstrap `.card` is `position: relative`,
 * so the filter modules are positioned siblings that paint in DOM order --
 * every one of them over a tooltip declared above them. Giving it a layer is
 * what makes it visible from wherever the panel chooses to mount it.
 */
export function SpeciesLegendTooltip() {
  return <Tooltip id={SPECIES_LEGEND_ID} className="species-legend-tooltip" />;
}
