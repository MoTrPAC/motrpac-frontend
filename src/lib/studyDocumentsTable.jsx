import React from 'react';
import PropTypes from 'prop-types';
import IconSet from './iconSet';
import { AnimalStudyDocuments } from '../DataAccess/studyDocuments';

function StudyDocumentsTable({ currentView }) {
  const newArray = [...AnimalStudyDocuments];
  if (currentView === 'internal') {
    newArray.pop();
  }
  // Handler to render study documents table rows
  function renderStudyDocumentsTableRow(item) {
    return (
      <div key={item.title} className="table-row-document-list">
        <div className="table-cell-document-list column-file">
          <div className="d-flex align-items-center justify-content-start">
            <img src={item.filetype === 'zip' ? IconSet.Archive : IconSet.PDF} alt={item.title} />
            <a href={item.location} download target="_blank" rel="noopener noreferrer" className={item.filetype}>{item.title}</a>
          </div>
        </div>
        <div className="table-cell-document-list column-description">
          {item.description}
        </div>
      </div>
    );
  }

  return (
    <div className="card mb-3 border-secondary motrpac-study-documents">
      <h5 className="card-header bg-secondary text-light">MoTrPAC animal study documents</h5>
      <div className="card-body">
        <div className="table-responsive">
          <div className="table table-document-list">
            <div className="table-header-document-list">
              <div className="table-cell-document-list">Title</div>
              <div className="table-cell-document-list">Description</div>
            </div>
            {newArray.map((item) => renderStudyDocumentsTableRow(item))}
          </div>
        </div>
      </div>
    </div>
  );
}

StudyDocumentsTable.propTypes = {
  currentView: PropTypes.string,
};

StudyDocumentsTable.defaultProps = {
  currentView: '',
};

export default StudyDocumentsTable;
