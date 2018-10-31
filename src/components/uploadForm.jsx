import React from 'react';
import PropTypes from 'prop-types';

// Form element for submission of data associated with files
function UploadForm({ validated, formValues, handleSubmit }) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(e); }} id="uploadForm" name="uploadForm" className={validated ? 'was-validated' : 'needs-validation'} noValidate>
      <div className="form-group">
        <div className="invalid-feedback">Field Required</div>
        <label htmlFor="data-type">
          Data Type *
          <input type="text" value={formValues.dataType} className="form-control" id="dataType" placeholder="Ex. Metabolomics" required />

        </label>
      </div>

      <div className="form-group">
        <div className="invalid-feedback">Field Required</div>
        <label htmlFor="identifier">
          Identifier(s) * – comma seperate if multiple
          <input type="text" value={formValues.identifier} className="form-control" id="identifier" placeholder="Ex: AS213141" required />
        </label>
      </div>

      <div className="form-group">
        <div className="invalid-feedback">Field Required</div>
        <label htmlFor="collection-date">
          Collection Date *
          <input type="text" value={formValues.collectionDate} className="form-control" id="collectionDate" placeholder="MM/DD/YYYY" required />
        </label>
      </div>

      <div className="form-group">
        <label htmlFor="subject-type">
          Subject Type *
          <select value={formValues.subjectType} className="form-control" id="subjectType">
            <option value="Human">Human</option>
            <option value="Animal">Animal</option>
          </select>
        </label>
      </div>

      <div className="form-group">
        <label htmlFor="study-phase">
          Study Phase *
          <select value={formValues.studyPhase} className="form-control" id="studyPhase">
            <option value="1">1</option>
            <option value="1A">1A</option>
            <option value="1B">1B</option>
            <option value="2">2</option>
            <option value="2A">2A</option>
            <option value="2B">2B</option>
            <option value="N/A">N/A</option>
            <option value="other">Other</option>
          </select>
        </label>
      </div>

      <div className="form-group">
        <label htmlFor="description">
          Description
          <textarea type="textarea" className="form-control" id="description" placeholder="Description" />
        </label>
      </div>

      <input type="submit" id="submit-form" style={{ visibility: 'hidden' }} />

    </form>
  );
}

UploadForm.propTypes = {
  validated: PropTypes.bool,
  formValues: PropTypes.shape({
    dataType: PropTypes.string,
    identifier: PropTypes.string,
    collectionDate: PropTypes.string,
    subjectType: PropTypes.string,
    studyPhase: PropTypes.string,
  }),
  handleSubmit: PropTypes.func.isRequired,
};
UploadForm.defaultProps = {
  validated: false,
  formValues: {
    dataType: '',
    identifier: '',
    collectionDate: '',
    subjectType: '',
    studyPhase: '',
  },
};

export default UploadForm;
