import React from 'react';
import PropTypes from 'prop-types';
import BundleDownloadButton from './bundleDownloadButton';

function BundleDatasets({
  profile,
  bundleDatasets,
  tagColor,
  handleUserSurveyOpenOnBundledDownload,
}) {
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
                  <span className={`badge badge-pill ${tagColor} mr-1`}>
                    {item.species}
                  </span>
                  <span className={`badge badge-pill ${tagColor} mr-1`}>
                    {item.participant_type}
                  </span>
                  <span className={`badge badge-pill ${tagColor} mr-1`}>
                    {item.intervention}
                  </span>
                  {item.species === 'Human' && (
                    <span className={`badge badge-pill ${tagColor} mr-1`}>
                      {item.study_group}
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
                  handleUserSurveyOpenOnBundledDownload={
                    handleUserSurveyOpenOnBundledDownload
                  }
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
  tagColor: PropTypes.string.isRequired,
  handleUserSurveyOpenOnBundledDownload: PropTypes.func,
};

BundleDatasets.defaultProps = {
  profile: {},
  handleUserSurveyOpenOnBundledDownload: null,
};

export default BundleDatasets;
