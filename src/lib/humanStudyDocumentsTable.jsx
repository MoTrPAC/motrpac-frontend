import React from 'react';
import IconSet from './iconSet';
import { HumanStudyDocuments } from '../DataAccess/studyDocuments';

function HumanStudyDocumentsTable() {
  // Handler to render study documents table rows
  function renderStudyDocumentsTableRow(item) {
    return (
      <div key={item.title} className="table-row-document-list">
        <div className="table-cell-document-list column-file">
          <div className="d-flex align-items-center justify-content-start">
            <img
              src={item.filetype === 'zip' ? IconSet.Archive : IconSet.PDF}
              alt={item.title}
            />
            <a
              href={item.location}
              download
              target="_blank"
              rel="noopener noreferrer"
              className={item.filetype}
            >
              {item.title}
            </a>
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
      <h5 className="card-header bg-secondary text-light">
        MoTrPAC human study documents
      </h5>
      <div className="card-body">
        <div className="table-responsive">
          <div className="table table-document-list">
            <div className="table-header-document-list">
              <div className="table-cell-document-list">Title</div>
              <div className="table-cell-document-list">Description</div>
            </div>
            {HumanStudyDocuments.map((item) =>
              renderStudyDocumentsTableRow(item),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HumanStudyDocumentsTable;
