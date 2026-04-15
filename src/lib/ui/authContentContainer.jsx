import React from 'react';
import PropTypes from 'prop-types';

function AuthContentContainer({ classes = '', expanded = false, children }) {
  return (
    <div className="loggedInContentContainer d-flex w-100">
      <div
        className={`d-none d-md-block sidebarLayoutBlock ${
          expanded ? 'sidebar-expanded' : 'sidebar-collapsed'
        }`}
      />
      <div
        className={`ml-sm-auto px-4 ${classes} ${
          expanded ? 'sidebar-expanded' : 'sidebar-collapsed'
        }`}
      >
        {children}
      </div>
    </div>
  );
}

AuthContentContainer.propTypes = {
  classes: PropTypes.string,
  expanded: PropTypes.bool,
};

export default AuthContentContainer;
