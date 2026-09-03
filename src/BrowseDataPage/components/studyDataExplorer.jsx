import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import studyDataCards, { humanPhenotypeDataCards } from '../../lib/studyDataCards';
import { hasVisibleCollections } from '../../lib/studyDataAccess';
import { prefixFromStorageLocation } from '../../lib/collectionFiles';
import actions from '../browseDataActions';
import StudyCollectionCard from './studyCollectionCard';
import DataReleaseCards from './dataReleaseCard';

const SPECIES_OPTIONS = ['all', 'rat', 'human'];
const DESIGN_OPTIONS = ['all', 'Acute exercise', 'Endurance training', 'Acute + training'];

function matchesFilters(study, filters) {
  if (filters.species !== 'all' && study.species !== filters.species) {
    return false;
  }
  if (filters.design !== 'all' && study.studyDesign !== filters.design) {
    return false;
  }
  if (filters.stage === 'public' && !hasVisibleCollections(study, 'external')) {
    return false;
  }
  return true;
}

function StudyDataExplorer({ userType = undefined }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('collections');
  const [filters, setFilters] = useState({ species: 'all', design: 'all', stage: 'all' });

  const visibleStudies = studyDataCards
    .filter((study) => hasVisibleCollections(study, userType))
    .filter((study) => matchesFilters(study, filters));

  // human-eqc and friends are not tied to one study, so they are not subject to
  // the species/design filters -- only to what the user may see.
  const visibleSupportingCollections = humanPhenotypeDataCards.filter((collection) =>
    hasVisibleCollections(collection, userType)
  );

  // Every Browse Files button hands back the collection's own storageLocation,
  // which reduces to the object-path prefix -- the same string the file
  // metadata's `object` field starts with, and the one the URL carries.
  function handleBrowseFiles(storageLocation) {
    const prefix = prefixFromStorageLocation(storageLocation);
    dispatch(actions.selectCollection(prefix));
    navigate(`/data-download/file-browser/${prefix}`);
  }

  return (
    <div className="study-data-explorer mt-4">
      <ul className="study-data-explorer-tabs nav nav-pills border-bottom pb-3 mb-3" id="pills-tab" role="tablist" aria-label="Choose a view">
        <li className="nav-item" role="presentation">
          <button
            type="button"
            className="nav-link active font-weight-bold"
            id="pills-collections-tab"
            role="tab"
            data-toggle="pill"
            aria-selected={activeView === 'collections'}
            onClick={() => setActiveView('collections')}
          >
            Study Collections
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            type="button"
            className="nav-link font-weight-bold"
            id="pills-releases-tab"
            role="tab"
            data-toggle="pill"
            aria-selected={activeView === 'releases'}
            onClick={() => setActiveView('releases')}
          >
            Data Releases
          </button>
        </li>
      </ul>
      {/* Filters are only shown in the "Study Collections" view
      <div className="study-data-explorer-filters">
        <div role="group" aria-label="Species">
          <span>Species</span>
          {SPECIES_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={filters.species === option}
              onClick={() => setFilters({ ...filters, species: option })}
            >
              {option === 'all' ? 'All' : option[0].toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
        <div role="group" aria-label="Study design">
          <span>Design</span>
          {DESIGN_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={filters.design === option}
              onClick={() => setFilters({ ...filters, design: option })}
            >
              {option === 'all' ? 'All' : option}
            </button>
          ))}
        </div>
        <div role="group" aria-label="Release stage">
          <span>Stage</span>
          <button
            type="button"
            aria-pressed={filters.stage === 'all'}
            onClick={() => setFilters({ ...filters, stage: 'all' })}
          >
            All
          </button>
          <button
            type="button"
            aria-pressed={filters.stage === 'public'}
            onClick={() => setFilters({ ...filters, stage: 'public' })}
          >
            Has public data
          </button>
        </div>
      </div>
      */}
      {activeView === 'collections' && (
        <div className="study-collections-panel">
          {visibleStudies.map((study) => (
            <StudyCollectionCard
              key={study.code}
              study={study}
              userType={userType}
              onBrowseFiles={handleBrowseFiles}
            />
          ))}
          {visibleSupportingCollections.length > 0 && (
            <section className="supporting-collections-panel mt-5">
              <h2 className="h4">Supporting human collections</h2>
              <p className="supporting-collections-intro">
                Cross-study phenotype resources that sit alongside the primary study
                collections.
              </p>
              {visibleSupportingCollections.map((collection) => (
                <StudyCollectionCard
                  key={collection.code}
                  study={collection}
                  userType={userType}
                  onBrowseFiles={handleBrowseFiles}
                />
              ))}
            </section>
          )}
        </div>
      )}

      {activeView === 'releases' && (
        <DataReleaseCards
          studies={[...visibleStudies, ...visibleSupportingCollections]}
          userType={userType}
          onBrowseFiles={handleBrowseFiles}
        />
      )}
    </div>
  );
}

StudyDataExplorer.propTypes = {
  userType: PropTypes.string,
};

export default StudyDataExplorer;
