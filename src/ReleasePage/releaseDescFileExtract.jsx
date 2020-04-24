import React from 'react';
import PropTypes from 'prop-types';
import EmailLink from '../lib/ui/emailLink';
import ExternalLink from '../lib/ui/externalLink';

function ReleaseDescFileExtract({ currentView }) {
  return (
    <>
      <p className="release-description file-extraction-instruction">
        All bundled datasets are compressed (*.tar.gz) and need to be extracted upon
        downloading. For Mac users, double-clicking a downloaded *.tar.gz file will
        extract it. For Windows users, use
        {' '}
        <ExternalLink to="https://www.winzip.com" label="WinZip" />
        {' '}
        or
        {' '}
        <ExternalLink to="https://www.7-zip.org" label="7-Zip" />
        {' '}
        to extract the compressed file.
      </p>
      {currentView === 'external'
        ? (
          <p className="release-description">
            To request access to raw files of the different omics
            data, please contact
            {' '}
            <EmailLink mailto="motrpac-data-requests@lists.stanford.edu" label="MoTrPAC Data Requests" />
            {' '}
            and specify the omics, tissues, and assays in which you are interested.
          </p>
        )
        : null}
    </>
  );
}

ReleaseDescFileExtract.propTypes = {
  currentView: PropTypes.string.isRequired,
};

export default ReleaseDescFileExtract;
