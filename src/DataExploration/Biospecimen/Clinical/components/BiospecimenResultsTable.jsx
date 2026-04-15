import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAdvancedPagination } from '../hooks/useAdvancedPagination';
import AdvancedPagination from './AdvancedPagination';
import { transformTissueCode, transformTrancheCode, transformCASReceived } from '../utils/dataTransformUtils';
import roundNumbers from '../../../../lib/utils/roundNumbers';

import '@styles/biospecimenSummary.scss';

function BiospecimenResultsTable({ data = [] }) {
  const pagination = useAdvancedPagination(data, {
    initialPageSize: 20,
    enableUrlSync: true,
    enableAnalytics: true,
    maxPagesToShow: 7,
    debounceDelay: 300,
  });
  
  // Reset pagination when data changes (e.g., when filters change)
  useEffect(() => {
    pagination.resetPagination();
  }, [data, pagination.resetPagination]);

  if (!data || data.length === 0) {
    return (
      <div className="alert alert-info" role="alert">
        <h5 className="alert-heading">No matches found</h5>
        <p>No biospecimens match the selected criteria. Please try different filter combinations.</p>
      </div>
    );
  }

  return (
    <div className="biospecimen-results-container">
      <h5 className="mb-3">
        <i className="bi bi-table mr-2" />
        Biospecimen Results ({pagination.totalItems} matches)
      </h5>
      
      {/* Pagination controls - top */}
      <AdvancedPagination {...pagination} data={data} />
      
      <div className="biospecimen-lookup-table table-responsive mt-3">
        <table className="table table-striped table-hover table-bordered">
          <thead className="thead-dark">
            <tr>
              <th scope="col">Vial Label</th>
              <th scope="col">Participant ID</th>
              <th scope="col">Tranche</th>
              <th scope="col">Temp Sample Profile</th>
              <th scope="col">Randomized Group</th>
              <th scope="col">Visit Code</th>
              <th scope="col">Timepoint</th>
              <th scope="col">Sample Group</th>
              <th scope="col">Sex</th>
              <th scope="col">Age Group</th>
              <th scope="col">BMI</th>
              <th scope="col">CAS Received</th>
            </tr>
          </thead>
          <tbody>
            {pagination.currentPageData.map((specimen, index) => (
              <tr key={specimen.vial_label || index}>
                <td className="vial-label text-dark">{specimen.vial_label}</td>
                <td>{specimen.pid}</td>
                <td>
                  <span className="badge badge-secondary">{transformTrancheCode(specimen.tranche)}</span>
                </td>
                <td>{specimen.tempSampProfile}</td>
                <td>{specimen.randomGroupCode}</td>
                <td>{specimen.visitcode}</td>
                <td>{specimen.timepoint}</td>
                <td>{transformTissueCode(specimen.sampleGroupCode)}</td>
                <td>
                  <span className={`badge ${specimen.sex === 'Male' ? 'badge-info' : 'badge-warning'}`}>
                    {specimen.sex}
                  </span>
                </td>
                <td>{specimen.age_groups}</td>
                <td>{roundNumbers(specimen.bmi, 1)}</td>
                <td>
                  <span className="badge badge-success">
                    {Number(specimen.receivedCAS) === 1 ? 'Yes' : 'No'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination controls - bottom */}
      <AdvancedPagination {...pagination} data={data} />
    </div>
  );
}

BiospecimenResultsTable.propTypes = {
  data: PropTypes.array,
};

export default BiospecimenResultsTable;
