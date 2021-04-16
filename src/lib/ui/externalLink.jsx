import React from 'react';
import PropTypes from 'prop-types';

/**
 * Renders a link to external URL
 * Requires Google Material Icons
 *
 * @param {String} to       A URL
 * @param {String} label    Link text
 *
 * @returns {Object} JSX representation of a link.
 */
function ExternalLink({ to, label }) {
  return (
    <a
      href={to}
      className="inline-link-with-icon"
      target="_blank"
      rel="noopener noreferrer"
    >
      {label && label.length ? label : to}
      <i className="material-icons external-linkout-icon">open_in_new</i>
    </a>
  );
}

ExternalLink.propTypes = {
  to: PropTypes.string.isRequired,
  label: PropTypes.string,
};

ExternalLink.defaultProps = {
  label: null,
};

export default ExternalLink;
