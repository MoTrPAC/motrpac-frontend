import React from 'react';
import PropTypes from 'prop-types';

function PageTitle({ title }) {
  return (
    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-3">
      <div className="page-title">
        <h1 className="mb-0">{title}</h1>
      </div>
    </div>
  );
}

PageTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

export default PageTitle;
