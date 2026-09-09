import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { FACETS, facetOptions } from '../lib/facetVocabulary';
import StudyFilterModule from './components/studyFilterModule';
import CollectionFilterModule from './components/collectionFilterModule';
import useCollectionSelection from './useCollectionSelection';

import '@styles/browseData.scss';
import '@styles/tooltip.scss';

/**
 * Species tags, spelled the way the search feature spells them.
 *
 * Same markup, same class names, same colours: a user who has learned what a
 * yellow R means on the search page should not have to learn it again here.
 * Rat first, and a value both species carry gets both tags.
 */
const SPECIES_TAGS = [
  { name: 'Rat', initial: 'R', variant: 'badge-rat' },
  { name: 'Human', initial: 'H', variant: 'badge-human' },
];

function BrowseDataFilter({ activeFilters = { assay: [], omics: [], tissue_name: [], category: [], reference_genome: [] }, onChangeFilter, onResetFilters }) {
  const profile = useSelector((state) => state.auth.profile);
  const userType = profile?.user_metadata?.userType;
  const {
    selected: selectedCollections,
    entitled,
    prefixes,
    apply: applyCollections,
  } = useCollectionSelection(userType);

  // The Collection picker is a module in this panel, so "Reset filters" clears
  // it too. Leaving collections selected after a reset read as the button being
  // broken. Clearing means "every collection in scope", not "none".
  function handleReset() {
    if (selectedCollections.length) {
      applyCollections([]);
    }
    onResetFilters();
  }

  // Options come from the built vocabulary, not from the loaded files. Deriving
  // them from what was loaded made the panel reflow on every study toggle and
  // hid the rest of the corpus; deriving them from the hand-written per-study
  // lists that preceded it was worse, since those had drifted from the data in
  // both directions. `entitled` decides which options exist, `prefixes` which
  // are enabled -- an option no loaded collection can match stays visible but
  // cannot be clicked into an empty table.
  const facets = FACETS.map((facet) => ({
    ...facet,
    options: facetOptions(facet.keyName, entitled, prefixes),
  })).filter((facet) => facet.options.length > 0);

  const filters = facets.map((facet) => (
    <div key={facet.name} className="card filter-module mb-4">
      <div className="card-header font-weight-bold d-flex align-items-center">
        <div>{facet.name}</div>
      </div>
      <div className="card-body">
        {facet.options.map((option) => {
          const isActiveFilter =
            activeFilters[facet.keyName]
            && activeFilters[facet.keyName].indexOf(option.value) > -1;
          return (
            <button
              key={option.value}
              type="button"
              disabled={!option.enabled}
              aria-pressed={isActiveFilter}
              className={`btn filterBtn ${isActiveFilter ? 'activeFilter' : ''}`}
              onClick={() => onChangeFilter(facet.keyName, option.value)}
            >
              {option.value}
              {SPECIES_TAGS.filter((tag) => option.species.includes(tag.name)).map((tag) => (
                <span
                  key={tag.name}
                  className={`filter-species-tag ml-1 badge ${tag.variant}`}
                >
                  {tag.initial}
                </span>
              ))}
            </button>
          );
        })}
      </div>
    </div>
  ));

  return (
    <div className="col-md-3 browse-data-filter-group">
      <div className="browse-data-filter-group-header d-flex justify-content-between align-items-center mb-3">
        <div className="font-weight-bold">Filter results:</div>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={handleReset}
        >
          Reset filters
        </button>
      </div>
      <StudyFilterModule userType={userType} />
      <CollectionFilterModule userType={userType} />
      {filters}
    </div>
  );
}

BrowseDataFilter.propTypes = {
  activeFilters: PropTypes.shape({
    tissue_name: PropTypes.arrayOf(PropTypes.string),
    assay: PropTypes.arrayOf(PropTypes.string),
    omics: PropTypes.arrayOf(PropTypes.string),
    category: PropTypes.arrayOf(PropTypes.string),
    reference_genome: PropTypes.arrayOf(PropTypes.string),
  }),
  onChangeFilter: PropTypes.func.isRequired,
  onResetFilters: PropTypes.func.isRequired,
};

export default BrowseDataFilter;
