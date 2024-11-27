import React from 'react';
import pass1b06AssayTissueJson from './pass1b_06_assay_tissue.json';
import pass1b06AssayByOmicJson from './pass1b_06_assay_by_omic.json';

const capitalize = (str) => str.replace(/\b\w/g, (char) => char.toUpperCase());

function Pass1b06AssayTissueTable() {
  return (
    <div className="pass1b-06-assay-tissue-table">
      {/* Render epigenomics assay table */}
      <h4 className="mt-4">Epigenomics</h4>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Assay</th>
              <th>Tissues</th>
            </tr>
          </thead>
          <tbody>
            {pass1b06AssayByOmicJson['epigenomics'].map((item) => (
              <tr key={item.id}>
                <td>{item.assay}</td>
                <td>
                  {pass1b06AssayTissueJson['epigenomics'][item.id].map((tissue) => (
                    <span key={`${item.id}-${tissue}`} className="badge badge-pill badge-light mr-1">
                      {capitalize(tissue.split('-').slice(1).join('-').replace(/-/g, ' '))}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Render transcriptomics assay table */}
      <h4 className="mt-4">Transcriptomics</h4>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Assay</th>
              <th>Tissues</th>
            </tr>
          </thead>
          <tbody>
            {pass1b06AssayByOmicJson['transcriptomics'].map((item) => (
              <tr key={item.id}>
                <td>{item.assay}</td>
                <td>
                  {pass1b06AssayTissueJson['transcriptomics'][item.id].map((tissue) => (
                    <span key={`${item.id}-${tissue}`} className="badge badge-pill badge-light mr-1">
                      {capitalize(tissue.split('-').slice(1).join('-').replace(/-/g, ' '))}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Render proteomics-untargeted assay table */}
      <h4 className="mt-4">Untargeted Proteomics</h4>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Assay</th>
              <th>Tissues</th>
            </tr>
          </thead>
          <tbody>
            {pass1b06AssayByOmicJson['proteomics-untargeted'].map((item) => (
              <tr key={item.id}>
                <td>{item.assay}</td>
                <td>
                  {pass1b06AssayTissueJson['proteomics-untargeted'][item.id].map((tissue) => (
                    <span key={`${item.id}-${tissue}`} className="badge badge-pill badge-light mr-1">
                      {capitalize(tissue.split('-').slice(1).join('-').replace(/-/g, ' '))}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Render metabolomics-untargeted assay table */}
      <h4 className="mt-4">Untargeted Metabolomics</h4>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Assay</th>
              <th>Tissues</th>
            </tr>
          </thead>
          <tbody>
            {pass1b06AssayByOmicJson['metabolomics-untargeted'].map((item) => (
              <tr key={item.id}>
                <td>{item.assay}</td>
                <td>
                  {pass1b06AssayTissueJson['metabolomics-untargeted'][item.id].map((tissue) => (
                    <span key={`${item.id}-${tissue}`} className="badge badge-pill badge-light mr-1">
                      {capitalize(tissue.split('-').slice(1).join('-').replace(/-/g, ' '))}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Render metabolomics-targeted assay table */}
      <h4 className="mt-4">Targeted Metabolomics</h4>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Assay</th>
              <th>Tissues</th>
            </tr>
          </thead>
          <tbody>
            {pass1b06AssayByOmicJson['metabolomics-targeted'].map((item) => (
              <tr key={item.id}>
                <td>{item.assay}</td>
                <td>
                  {pass1b06AssayTissueJson['metabolomics-targeted'][item.id].map((tissue) => (
                    <span key={`${item.id}-${tissue}`} className="badge badge-pill badge-light mr-1">
                      {capitalize(tissue.split('-').slice(1).join('-').replace(/-/g, ' '))}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Pass1b06AssayTissueTable;
