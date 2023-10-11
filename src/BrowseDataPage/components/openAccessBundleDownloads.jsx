import React from 'react';
import PropTypes from 'prop-types';
import BundleDataTypes from './bundleDataTypes';
import BundleDownloadButton from './bundleDownloadButton';

function OpenAccessBundleDownloads({
  sets,
  profile,
  handleUserSurveyOpenOnBundledDownload,
}) {
  const numOfSets = sets === 'all' ? BundleDataTypes.length : 2;

  return (
    <div className="row row-cols-1 row-cols-md-2 open-access-bundle-data-sets">
      {BundleDataTypes.slice(0, numOfSets).map((item) => {
        return (
          <div
            key={`${item.type}-${item.object_zipfile}`}
            className={`open-access-bundle-data-sets-item col ${
              sets === 'all' ? 'mb-4' : null
            }`}
          >
            <div className="card">
              <div className="card-body">
                <h6 className="card-title d-flex align-items-center justify-content-between open-access-bundle-data-title-container">
                  <span className="open-access-bundle-data-title font-weight-bolder">
                    {item.title}
                  </span>
                  <span className="open-access-bundle-data-size">{`${item.object_zipfile_size}`}</span>
                </h6>
                <p>{item.description}</p>
                <BundleDownloadButton
                  bundlefile={item.object_zipfile}
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

OpenAccessBundleDownloads.propTypes = {
  sets: PropTypes.string,
  profile: PropTypes.shape({
    user_metadata: PropTypes.shape({
      userType: PropTypes.string,
      email: PropTypes.string,
      name: PropTypes.string,
    }),
  }),
  handleUserSurveyOpenOnBundledDownload: PropTypes.func,
};

OpenAccessBundleDownloads.defaultProps = {
  sets: '',
  profile: {},
  handleUserSurveyOpenOnBundledDownload: null,
};

export default OpenAccessBundleDownloads;
