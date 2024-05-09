import React from 'react';
import PropTypes from 'prop-types';

function SelectiveDataDownloadFileBrowserTab({
  className,
  id,
  href,
  ariaControls,
  tabTitle,
  tabSelectHandler,
  onResetFilters,
}) {
  function handleTabSelect(e) {
    e.preventDefault();
    tabSelectHandler();
    onResetFilters();
  }

  return (
    <li className="nav-item font-weight-bold" role="presentation">
      <a
        className={className}
        id={id}
        data-toggle="pill"
        href={href}
        role="tab"
        aria-controls={ariaControls}
        aria-selected="false"
        onClick={(e) => handleTabSelect(e)}
      >
        {tabTitle}
      </a>
    </li>
  );
}

SelectiveDataDownloadFileBrowserTab.propTypes = {
  className: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  ariaControls: PropTypes.string.isRequired,
  tabTitle: PropTypes.string.isRequired,
  tabSelectHandler: PropTypes.func.isRequired,
  onResetFilters: PropTypes.func.isRequired,
};

export default SelectiveDataDownloadFileBrowserTab;
