import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import browseDataFilters from '../lib/browseDataFilters';
import CollectionFilterModule from './components/collectionFilterModule';
import useCollectionSelection from './useCollectionSelection';

import '@styles/browseData.scss';
import '@styles/tooltip.scss';

function BrowseDataFilter({ activeFilters = { assay: [], omics: [], tissue_name: [], tissue_superclass: [], category: [], reference_genome: [] }, onChangeFilter, onResetFilters }) {
  const dataDownload = useSelector((state) => state.browseData);
  const profile = useSelector((state) => state.auth.profile);
  const userType = profile?.user_metadata?.userType;
  const { selected: selectedCollections, apply: applyCollections } =
    useCollectionSelection(userType);

  // The Collection picker is a module in this panel, so "Reset filters" clears
  // it too. Leaving collections selected after a reset read as the button being
  // broken. Clearing means "every collection in this study", not "none".
  function handleReset() {
    if (selectedCollections.length) {
      applyCollections([]);
    }
    onResetFilters();
  }

  // Facet values are derived from the files actually loaded, not from hardcoded
  // per-study lists. Three reasons:
  //   1. The old code left `filters` as an object whenever no per-study flag was
  //      set - which is every first render now that loading is async - and
  //      `item.filters.map` threw.
  //   2. It assigned to `item.filters` on a shallow copy, mutating the shared
  //      module-level config for the rest of the session.
  //   3. The hardcoded lists cannot describe the newer collections at all
  //      (rat-acute RN8, human-eqc, which has no tissue or omics).
  // Deriving means a collection only ever offers filters that can match one of
  // its own files.
  function facetOptions(files, keyName) {
    const values = new Set();
    files.forEach((file) => {
      const raw = file[keyName];
      if (raw === null || raw === undefined || raw === '') {
        return;
      }
      // omics, tissue_name and assay may hold comma-joined multi-values.
      String(raw)
        .split(',')
        .forEach((part) => {
          const value = part.trim();
          if (value) {
            values.add(value);
          }
        });
    });
    return [...values].sort();
  }

  // Human tissue names in this dataset are variants of the same specimen --
  // "Human Muscle" / "Human Muscle Powder", "Human EDTA Plasma" / "HUman EDTA
  // Plasma" -- so the useful grain is the superclass: Adipose, Blood, Muscle,
  // Plasma. Rat names are already distinct specimens and must not be collapsed:
  // Heart, Gastrocnemius and Vastus Lateralis all share the superclass "Muscle".
  const isHuman = dataDownload.allFiles.some((file) => file.species === 'Human');
  const tissueKey = isHuman ? 'tissue_superclass' : 'tissue_name';

  const fileFilters = browseDataFilters
    .map((item) => {
      const keyName = item.keyName === 'tissue_name' ? tissueKey : item.keyName;
      return { ...item, keyName, filters: facetOptions(dataDownload.allFiles, keyName) };
    })
    .filter((item) => item.filters.length > 0);

  const filters = fileFilters
    .map((item) => (
      <div key={item.name} className="card filter-module mb-4">
        <div className="card-header font-weight-bold d-flex align-items-center">
          <div>{item.name}</div>
        </div>
        <div className="card-body">
          {item.filters.map((filter) => {
            const isActiveFilter =
              activeFilters[item.keyName] &&
              activeFilters[item.keyName].indexOf(filter) > -1;
            return (
              <button
                key={filter}
                type="button"
                className={`btn filterBtn ${
                  isActiveFilter ? 'activeFilter' : ''
                }`}
                onClick={() => onChangeFilter(item.keyName, filter)}
              >
                {filter}
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
      <CollectionFilterModule userType={userType} />
      {filters}
    </div>
  );
}

BrowseDataFilter.propTypes = {
  activeFilters: PropTypes.shape({
    tissue_name: PropTypes.arrayOf(PropTypes.string),
    tissue_superclass: PropTypes.arrayOf(PropTypes.string),
    assay: PropTypes.arrayOf(PropTypes.string),
    omics: PropTypes.arrayOf(PropTypes.string),
    category: PropTypes.arrayOf(PropTypes.string),
    reference_genome: PropTypes.arrayOf(PropTypes.string),
  }),
  onChangeFilter: PropTypes.func.isRequired,
  onResetFilters: PropTypes.func.isRequired,
};

export default BrowseDataFilter;
