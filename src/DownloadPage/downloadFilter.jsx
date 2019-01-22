import React from 'react';
import PropTypes from 'prop-types';
import downloadFilters from '../lib/downloadFilters';

function DownloadFilter({
  activeFilters,
  onChangeFilter,
}) {
  const filters = downloadFilters.map(category => (
    <div key={category.name} className="filterCategory">
      <h5>{category.name}</h5>
      {
        category.filters
          .map((filter, i) => {
            const isActiveFilter = !(activeFilters[category.keyName].indexOf(filter) === -1);
            return (
              <button
                key={filter}
                type="button"
                className={`btn filterBtn ${isActiveFilter ? 'activeFilter' : ''}`}
                onClick={() => onChangeFilter(category.keyName, filter)}
              >
                {filter}
                &nbsp;
                {category.icons ? category.icons[i] : ''}
              </button>);
          })
      }
    </div>
  ));
  return (
    <div className="col-12 col-md-4 mx-4 mx-md-0 my-2 downloadFilter">
      <h4>Filter By:</h4>
      {filters}
    </div>
  );
}
DownloadFilter.propTypes = {
  activeFilters: PropTypes.shape({
    type: PropTypes.arrayOf(PropTypes.string),
    subject: PropTypes.arrayOf(PropTypes.string),
  }),
  onChangeFilter: PropTypes.func.isRequired,
};
DownloadFilter.defaultProps = {
  activeFilters: {
    type: [],
    subject: [],
  },
};

export default DownloadFilter;
