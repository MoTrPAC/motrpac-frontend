import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import BundleDownloadButton from './bundleDownloadButton';
import surveyModdalActions from '../../UserSurvey/userSurveyActions';

const tagColors = {
  human: 'badge-primary',
  rat: 'badge-warning',
  endurance: 'badge-success',
  acute: 'badge-info',
  youngAdult: 'badge-secondary',
  adult: 'badge-dark',
  preSuspension: 'badge-danger',
  sedentary: 'badge-purple',
};

function BundleDatasets({
  profile = {},
  bundleDatasets,
  surveySubmitted,
  downloadedData,
}) {
  const dispatch = useDispatch();
  const [filterKeywords, setFilterKeywords] = useState('');

  useEffect(() => {
    // show user survey modal if user has not submitted survey after downloading data
    if (downloadedData) {
      if (!surveySubmitted) {
        setTimeout(() => {
          dispatch(surveyModdalActions.toggleUserSurveyModal(true));
        }, 2000);
      }
    }
  }, [dispatch, downloadedData, surveySubmitted]);

  // Filter datasets based on keywords (title, description, species, intervention, etc.)
  const filteredDatasets = useMemo(() => {
    if (filterKeywords.length < 2) {
      return bundleDatasets;
    }

    const keywords = filterKeywords.toLowerCase();
    return bundleDatasets.filter((item) =>
      item.title?.toLowerCase().includes(keywords) ||
      item.description?.toLowerCase().includes(keywords) ||
      item.species?.toLowerCase().includes(keywords) ||
      item.intervention?.toLowerCase().includes(keywords) ||
      item.participant_type?.toLowerCase().includes(keywords) ||
      item.study_group?.toLowerCase().includes(keywords)
    );
  }, [filterKeywords, bundleDatasets]);

  const handleFilterChange = (e) => {
    setFilterKeywords(e.target.value);
  };

  return (
    <div className="bundle-datasets-container">
      <div className="bundle-datasets-filter-container mb-3">
        <div className="input-group d-flex align-items-center">
          <div className="glossary-filter-label mr-2">
            <b>Search bundled datasets:</b>
          </div>
          <input
            id="bundle-datasets-filter"
            type="search"
            className="form-control"
            placeholder="Enter at least 2 characters to filter results"
            value={filterKeywords}
            onChange={handleFilterChange}
          />
        </div>
        {filterKeywords.length >= 2 && (
          <small className="text-muted mt-1">
            Showing {filteredDatasets.length} of {bundleDatasets.length} datasets
          </small>
        )}
      </div>
      <div className="row row-cols-1 row-cols-md-3 bundle-datasets">
        {filteredDatasets.map((item) => {
        return (
          <div
            key={`${item.type}-${item.object_zipfile}`}
            className="bundle-datasets-item col mb-4"
          >
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{item.title}</h5>
                <div className="bundle-dataset-tags mb-2">
                  <span
                    className={`badge badge-pill ${item.species === 'Rat' ? tagColors.rat : tagColors.human} mr-1`}
                  >
                    {item.species}
                  </span>
                  <span
                    className={`badge badge-pill ${item.participant_type === 'Young Adult' ? tagColors.youngAdult : tagColors.adult} mr-1`}
                  >
                    {item.participant_type}
                  </span>
                  <span
                    className={`badge badge-pill ${item.intervention === 'Endurance Training' ? tagColors.endurance : item.intervention === 'Acute Exercise' ? tagColors.acute : tagColors.sedentary} mr-1`}
                  >
                    {item.intervention}
                  </span>
                  {item.species === 'Human' && (
                    <span
                      className={`badge badge-pill ${item.study_group === 'Pre-Suspension' && tagColors.preSuspension} mr-1`}
                    >
                      {item.study_group}
                    </span>
                  )}
                </div>
                <p className="text-muted mb-0">{item.description}</p>
              </div>
              <div className="card-footer">
                <BundleDownloadButton
                  bundlefile={item.object_zipfile}
                  bundlefileSize={item.object_zipfile_size}
                  profile={profile}
                />
                {item.object_rn7_zipfile && profile?.user_metadata?.userType === 'internal' && (
                  <>
                    <div className="text-center text-muted my-1">- or -</div>
                    <BundleDownloadButton
                      bundlefile={item.object_rn7_zipfile}
                      bundlefileSize={item.object_rn7_zipfile_size}
                      profile={profile}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}

BundleDatasets.propTypes = {
  profile: PropTypes.shape({
    user_metadata: PropTypes.shape({
      userType: PropTypes.string,
      email: PropTypes.string,
      name: PropTypes.string,
    }),
  }),
  bundleDatasets: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  surveySubmitted: PropTypes.bool.isRequired,
  downloadedData: PropTypes.bool.isRequired,
};

export default BundleDatasets;
