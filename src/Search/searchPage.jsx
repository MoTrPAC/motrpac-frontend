import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import SearchForm from './searchForm';
import actions from '../UploadPage/uploadActions';

export function SearchPage({
  handleSearchFormSubmit,
  isAuthenticated,
}) {
  const [advSearchParams, setAdvSearchParams] = useState([{ term: 'all', value: '', operator: 'and' }]);
  const [searchQueries, setSearchQueries] = useState(null);

  if (!isAuthenticated) {
    return (<Redirect to="/" />);
  }

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.entries().length) {
    console.log(urlParams);
    setSearchQueries(urlParams);
  }

  // Hanlder to add a search term
  const addSearchParam = () => {
    setAdvSearchParams([
      ...advSearchParams,
      { term: 'all', value: '', operator: 'and' },
    ]);
  };

  // Handler to remove a search term
  const removeSearchParam = (idx) => {
    const newParamList = [...advSearchParams];
    newParamList.splice(idx, 1);
    setAdvSearchParams(newParamList);
  };

  // Handler to update array state upon form changes
  const handleSearchFormChange = (idx, field, e) => {
    e.preventDefault();
    const newParamList = [...advSearchParams];
    if (field === 'term') {
      newParamList[idx].term = e.target.value;
    } else if (field === 'value') {
      newParamList[idx].value = e.target.value;
    } else if (field === 'operator') {
      newParamList[idx].operator = e.target.value;
    }
    setAdvSearchParams(newParamList);
  };

  // Handler to reset form
  const resetSearchForm = () => {
    setAdvSearchParams([{ term: 'all', value: '', operator: 'and' }]);
  };

  return (
    <div className="col-md-9 ml-sm-auto col-lg-10 px-4 searchPage">
      <div className="page-title pt-3 pb-2 border-bottom">
        <h3>{searchQueries && searchQueries.length ? 'Search Results' : 'Advanced Search'}</h3>
      </div>
      <div className="advanced-search-content-container mt-3">
        <div className="adv-search-example-searches">
          <p className="text-left">
            Example searches:&nbsp;
            <Link to="/search?assay=rna-seq" className="example-search-link">rna-seq</Link>
            <Link to="/search?tissue=liver" className="example-search-link">liver</Link>
            <Link to="/search?species=rat" className="example-search-link">rat</Link>
          </p>
        </div>
        <SearchForm
          advSearchParams={advSearchParams}
          handleSearchFormChange={handleSearchFormChange}
          addSearchParam={addSearchParam}
          removeSearchParam={removeSearchParam}
          resetSearchForm={resetSearchForm}
          handleSearchFormSubmit={handleSearchFormSubmit}
        />
      </div>
    </div>
  );
}

SearchPage.propTypes = {
  formValues: PropTypes.shape({
    gene: PropTypes.string,
    biospecimenId: PropTypes.string,
    site: PropTypes.string,
  }),
  handleSearchFormSubmit: PropTypes.func.isRequired,
  clearForm: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};

SearchPage.defaultProps = {
  formValues: {
    gene: '',
    biospecimenId: '',
    site: '',
  },
};

const mapStateToProps = state => ({
  ...(state.upload),
  isAuthenticated: state.auth.isAuthenticated,
});

const mapDispatchToProps = dispatch => ({
  handleSearchFormSubmit: e => dispatch(actions.formSubmit(e)),
  clearForm: () => dispatch(actions.clearForm()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
