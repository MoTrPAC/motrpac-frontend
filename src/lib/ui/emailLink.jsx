import React from 'react';
import PropTypes from 'prop-types';

/**
 * Renders an email link
 * Requires Google Material Icons
 *
 * @param {String} mailto  Email address
 * @param {String} label   Email link text
 *
 * @returns {Object} JSX representation of an email link.
 */
function EmailLink({ mailto, label = null }) {
  return (
    <a
      href={`mailto:${mailto}`}
      className="inline-link-with-icon"
      target="_blank"
      rel="noopener noreferrer"
    >
      {label && label.length ? label : mailto}
      <i className="material-icons email-icon">mail</i>
    </a>
  );
}

EmailLink.propTypes = {
  mailto: PropTypes.string.isRequired,
  label: PropTypes.string,
};

export default EmailLink;
