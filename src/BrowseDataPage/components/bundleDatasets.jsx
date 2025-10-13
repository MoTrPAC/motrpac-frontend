import React, { useEffect } from 'react';
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
  preCovid: 'badge-danger',
  sedentary: 'badge-purple',
  refGenome: 'badge-dark',
};

function BundleDatasets({
  profile = {},
  bundleDatasets,
  surveySubmitted,
  downloadedData,
}) {
  const dispatch = useDispatch();

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

  return (
    <div className="row row-cols-1 row-cols-md-3 bundle-datasets">
      {bundleDatasets.map((item) => {
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
                      className={`badge badge-pill ${item.study_group === 'Pre-COVID' && tagColors.preCovid} mr-1`}
                    >
                      {item.study_group}
                    </span>
                  )}
                  {item.reference_genome && (
                    <span
                      className={`badge badge-pill ${tagColors.refGenome} mr-1`}
                    >
                      {item.reference_genome}
                    </span>
                  )}
                </div>
                <p className="text-muted">{item.description}</p>
              </div>
              <div className="card-footer">
                <BundleDownloadButton
                  bundlefile={item.object_zipfile}
                  bundlefileSize={item.object_zipfile_size}
                  profile={profile}
                />
              </div>
            </div>
          </div>
        );
      })}
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
