import React from 'react';

function EmbargoExtension() {
  return (
    <div
      className="alert alert-warning alert-dismissible fade show d-flex align-items-center justify-content-between w-100 mt-2 mb-0 alert-embargo-extension"
      role="alert"
    >
      <span>
        Please note that the publication embargo on MoTrPAC data has been
        extended until release of additional control data necessary to fully
        control for non-exercise induced molecular changes in the current
        dataset. The control data has been delayed due to the COVID-19 pandemic
        and we apologize for any inconvenience caused. Please be sure that the
        consortium is hard at work to release this data to the scientific
        community as soon as possible. Until then, data can only be used for
        analyses supporting grant submissions, and cannot be used in abstracts,
        manuscripts, preprints or presentations.
      </span>
      <button
        type="button"
        className="close"
        data-dismiss="alert"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
}

export default EmbargoExtension;
