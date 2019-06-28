import React from 'react';
import PropTypes from 'prop-types';

function SearchTermRow({
  advSearchParams,
  item,
  termId,
  valueId,
  idx,
  handleSearchFormChange,
  addSearchParam,
  removeSearchParam,
}) {
  return (
    <React.Fragment>
      {advSearchParams.length > 1 && idx > 0
        ? (
          <select
            name={`${termId}-operator`}
            id={`${termId}-operator`}
            value={item.operator}
            className="form-control param-operator col-1 mr-3"
            onChange={handleSearchFormChange.bind(this, idx, 'operator')}
          >
            <option value="and">And</option>
            <option value="or">Or</option>
          </select>
        )
        : <span className="param-operator-filler mr-3" />}
      <select
        name={termId}
        id={termId}
        value={item.term}
        className="form-control param-list col-2 mr-3"
        onChange={handleSearchFormChange.bind(this, idx, 'term')}
      >
        <option value="all">All</option>
        <option value="assay">Assay</option>
        <option value="biospecimenid">Biospecimen ID</option>
        <option value="gender">Gender</option>
        <option value="gene">Gene ID/Symbol</option>
        <option value="site">Site</option>
        <option value="species">Species</option>
        <option value="tissue">Tissue</option>
      </select>
      <input
        type="text"
        name={valueId}
        id={valueId}
        value={item.value}
        className="form-control param-value col-4 mr-3"
        onChange={handleSearchFormChange.bind(this, idx, 'value')}
      />
      {advSearchParams.length > 1
        ? (
          <button
            type="button"
            className="btn btn-secondary btn-sm btn-param-remove mr-3"
            aria-label="Remove"
            onClick={removeSearchParam.bind(this, idx)}
          >
            <i className="material-icons">remove</i>
          </button>
        )
        : <span className="param-btn-filler mr-3" />}
      {(advSearchParams.length - 1 === idx)
        ? (
          <button
            type="button"
            className="btn btn-success btn-sm btn-param-add"
            aria-label="Add"
            onClick={addSearchParam.bind(this)}
          >
            <i className="material-icons">add</i>
          </button>
        )
        : <span className="param-btn-filler" />}
    </React.Fragment>
  );
}

SearchTermRow.propTypes = {
  advSearchParams: PropTypes.arrayOf(PropTypes.shape({
    term: PropTypes.string,
    value: PropTypes.string,
    operator: PropTypes.string,
  })).isRequired,
  item: PropTypes.shape({
    term: PropTypes.string,
    value: PropTypes.string,
    operator: PropTypes.string,
  }).isRequired,
  termId: PropTypes.string.isRequired,
  valueId: PropTypes.string.isRequired,
  idx: PropTypes.number.isRequired,
  handleSearchFormChange: PropTypes.func.isRequired,
  addSearchParam: PropTypes.func.isRequired,
  removeSearchParam: PropTypes.func.isRequired,
};

export default SearchTermRow;
