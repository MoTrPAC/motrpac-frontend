import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import browseDataFilters, { tissues, omes, referenceGenomes } from '../lib/browseDataFilters';
import assayList from '../lib/assayList';

import '@styles/browseData.scss';
import '@styles/tooltip.scss';

function BrowseDataFilter({ activeFilters = { assay: [], omics: [], tissue_name: [], category: [], reference_genome: [] }, onChangeFilter, onResetFilters }) {
  const dataDownload = useSelector((state) => state.browseData);

  const fileFilters = [...browseDataFilters];
  // Remove phenotype filter if human-precovid-sed-adu data tab is selected
  if (dataDownload.humanPrecovidSedAduDataSelected) {
    fileFilters.splice(4, 1);
  }

  fileFilters.forEach((item) => {
    if (item.keyName === 'reference_genome') {
      if (dataDownload.pass1b06DataSelected) {
        item.filters = referenceGenomes.pass1b_06;
      }
      if (dataDownload.pass1a06DataSelected) {
        item.filters = referenceGenomes.pass1a_06;
      }
      if (dataDownload.humanPrecovidSedAduDataSelected) {
        item.filters = referenceGenomes.human_sed_adu;
      }
    }
    if (item.keyName === 'tissue_name') {
      if (dataDownload.pass1b06DataSelected) {
        item.filters = tissues.pass1b_06;
      }
      if (dataDownload.pass1a06DataSelected) {
        item.filters = tissues.pass1a_06;
      }
      if (dataDownload.humanPrecovidSedAduDataSelected) {
        item.filters = tissues.human_sed_adu;
      }
    }
    if (item.keyName === 'omics') {
      if (dataDownload.pass1b06DataSelected) {
        item.filters = omes.pass1b_06;
      }
      if (dataDownload.pass1a06DataSelected) {
        item.filters = omes.pass1a_06;
      }
      if (dataDownload.humanPrecovidSedAduDataSelected) {
        item.filters = omes.human_sed_adu;
      }
    }
    if (item.keyName === 'assay') {
      if (dataDownload.pass1b06DataSelected) {
        item.filters = assayList.pass1b_06;
      }
      if (dataDownload.pass1a06DataSelected) {
        item.filters = assayList.pass1a_06;
      }
      if (dataDownload.humanPrecovidSedAduDataSelected) {
        item.filters = assayList.human_sed_adu;
      }
    }
  });
  const filters = fileFilters
    .filter((item) => {
      // Hide reference genome filter if no options available
      if (item.keyName === 'reference_genome' && (!item.filters || item.filters.length === 0)) {
        return false;
      }
      return true;
    })
    .map((item) => (
      <div key={item.name} className="card filter-module mb-4">
        <div className="card-header font-weight-bold d-flex align-items-center">
          <div>{item.name}</div>
          {item.keyName === 'category' && item.name === 'Category' && (
            <div className="data-filter-info-icon-wrapper d-flex align-items-center">
              <i className="material-icons data-filter-info-icon ml-1">info</i>
              <span className="tooltip-on-right" id="data-filter-info-tooltip">
                <span>
                  <strong>Analysis</strong> - Differential analysis and normalized
                  data tables.
                  <br />
                  <strong>Results</strong> - Quantitative results,
                  experimental/sample metadata, and QA/QC reports.
                </span>
                <i />
              </span>
            </div>
          )}
        </div>
        <div className="card-body">
          {item.filters.map((filter) => {
            const isActiveFilter =
              activeFilters[item.keyName] &&
              activeFilters[item.keyName].indexOf(filter) > -1;
            return (
              <button
                key={filter}
                type="button"
                className={`btn filterBtn ${
                  isActiveFilter ? 'activeFilter' : ''
                }`}
                onClick={() => onChangeFilter(item.keyName, filter)}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>
    ));
  return (
    <div className="col-md-3 browse-data-filter-group">
      <div className="browse-data-filter-group-header d-flex justify-content-between align-items-center mb-3">
        <div className="font-weight-bold">Filter results:</div>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onResetFilters}
        >
          Reset filters
        </button>
      </div>
      {filters}
    </div>
  );
}

BrowseDataFilter.propTypes = {
  activeFilters: PropTypes.shape({
    tissue_name: PropTypes.arrayOf(PropTypes.string),
    assay: PropTypes.arrayOf(PropTypes.string),
    omics: PropTypes.arrayOf(PropTypes.string),
    category: PropTypes.arrayOf(PropTypes.string),
    reference_genome: PropTypes.arrayOf(PropTypes.string),
  }),
  onChangeFilter: PropTypes.func.isRequired,
  onResetFilters: PropTypes.func.isRequired,
};

export default BrowseDataFilter;
