import React from 'react';
import IconSet from './iconSet';
import StudyDocuments from '../DataAccess/studyDocuments';

function StudyDocumentsTable() {
  // Handler to render study documents table rows
  function renderStudyDocumentsTableRow(item) {
    return (
      <tr key={item.title} className="document-list-item">
        <td>
          <div className="d-flex align-items-center justify-content-start">
            <img src={item.location.indexOf('.tar.gz') > 0 ? IconSet.Archive : IconSet.PDF} alt={item.title} />
            <a href={item.location} download target="_blank" rel="noopener noreferrer">{item.title}</a>
          </div>
        </td>
        <td>{item.description}</td>
      </tr>
    );
  }

  return (
    <div className="card mb-3 border-secondary motrpac-study-documents">
      <div className="card-header bg-secondary text-light">MoTrPAC study documents</div>
      <div className="card-body">
        <table className="table table-striped table-sm document-list">
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Description</th>
            </tr>
          </thead>
          <tbody>
            {StudyDocuments.map(item => renderStudyDocumentsTableRow(item))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudyDocumentsTable;
