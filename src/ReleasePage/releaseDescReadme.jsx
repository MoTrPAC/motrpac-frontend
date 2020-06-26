import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import EmailLink from '../lib/ui/emailLink';

function ReleaseDescReadme({ releaseVersion, fileLocation }) {
  if (releaseVersion === '1.2.1' || releaseVersion === '2.0') {
    return (
      <p className="release-description">
        A
        {' '}
        <a
          href={fileLocation}
          className="inline-link-with-icon"
          target="_blank"
          rel="noopener noreferrer"
        >
          README
          <i className="material-icons readme-file-icon">description</i>
        </a>
        {' '}
        document has been provided summarizing the data available in this release. To
        learn more about the prior released dataset, please see the
        {' '}
        <Link to="/announcements" className="inline-link">recent announcement</Link>
        . For any technical issues, please contact us at
        {' '}
        <EmailLink mailto="motrpac-helpdesk@lists.stanford.edu" label="MoTrPAC Helpdesk" />
      </p>
    );
  }

  return (
    <p className="release-description">
      A
      {' '}
      <a
        href={fileLocation}
        className="inline-link-with-icon"
        target="_blank"
        rel="noopener noreferrer"
      >
        README
        <i className="material-icons readme-file-icon">description</i>
      </a>
      {' '}
      document has been provided detailing the different data types available
      in this release in addition to how to access them. For updates on known
      issues with the initial dataset, please see our
      {' '}
      <Link to="/announcements" className="inline-link">recent announcement</Link>
      . For any technical issues, please contact us at
      {' '}
      <EmailLink mailto="motrpac-helpdesk@lists.stanford.edu" label="MoTrPAC Helpdesk" />
    </p>
  );
}

ReleaseDescReadme.propTypes = {
  releaseVersion: PropTypes.string.isRequired,
  fileLocation: PropTypes.string.isRequired,
};

export default ReleaseDescReadme;
