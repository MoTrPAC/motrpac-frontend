import React from 'react';
import PropTypes from 'prop-types';
import SearchTermRow from './searchTermRow';

function SearchTermList({
  advSearchParams,
  handleSearchFormChange,
  addSearchParam,
  removeSearchParam,
}) {
  // Render advanced search term/value pair list
  const advSearchParamListObj = advSearchParams.map((item, idx) => {
    const termId = `term-${idx}`;
    const valueId = `value-${idx}`;
    return (
      <li key={termId} className="param-item form-group d-flex align-items-center justify-content-start">
        <SearchTermRow
          advSearchParams={advSearchParams}
          item={item}
          termId={termId}
          valueId={valueId}
          idx={idx}
          handleSearchFormChange={handleSearchFormChange}
          addSearchParam={addSearchParam}
          removeSearchParam={removeSearchParam}
        />
      </li>
    );
  });

  return (
    <ul className="param-list">
      {advSearchParamListObj}
    </ul>
  );
}

SearchTermList.propTypes = {
  advSearchParams: PropTypes.arrayOf(PropTypes.shape({
    term: PropTypes.string,
    value: PropTypes.string,
    operator: PropTypes.string,
  })),
  handleSearchFormChange: PropTypes.func.isRequired,
  addSearchParam: PropTypes.func.isRequired,
  removeSearchParam: PropTypes.func.isRequired,
};

SearchTermList.defaultProps = {
  advSearchParams: [{ term: 'all', value: '', operator: 'and' }],
};

export default SearchTermList;
