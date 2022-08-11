import React from 'react';
import EmailLink from '../lib/ui/emailLink';

function ReleaseDescFileExtract() {
  return (
    <p className="release-description">
      To request access to raw files of the different omics data, please contact{' '}
      <EmailLink
        mailto="motrpac-data-requests@lists.stanford.edu"
        label="MoTrPAC Data Requests"
      />{' '}
      and specify the omics, tissues, and assays in which you are interested.
    </p>
  );
}

export default ReleaseDescFileExtract;
