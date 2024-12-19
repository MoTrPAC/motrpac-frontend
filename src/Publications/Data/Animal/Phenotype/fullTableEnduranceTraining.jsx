import React, { useState, useRef } from 'react';

function FullTableEnduranceTraining() {
  const iframeRef = useRef(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const handleIframeLoad = () => {
    setIframeLoaded(true);
  };

  return (
    <div className="fullPhenoPass1b06Table container-fluid px-3 px-md-4 mb-3">
      <div className="headerContainer d-flex flex-row justify-content-start align-items-center">
        <h1>Full phenotype table for animal endurance training study</h1>
        <a
          type="button"
          role="button"
          className="btn btn-primary d-flex align-items-center ml-4"
          href="https://d1yw74buhe0ts0.cloudfront.net/static/motrpac-data-hub/publications/data/animal/phenotype/animal-endurance-training-study-full-table.xlsx"
          download
        >
          <i className="material-icons">file_download</i>
          <span className="px-1 text-left">Download this dataset</span>
        </a>
      </div>
      <div className="embedContainer embed-responsive embed-responsive-1by1 mt-3">
        {!iframeLoaded && (
          <div className="bootstrap-spinner d-flex justify-content-center py-5">
            <div className="spinner-border text-secondary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}
        <iframe
          ref={iframeRef}
          title="Full phenotype table for animal endurance training study"
          src="https://docs.google.com/spreadsheets/d/e/2PACX-1vQjmAo-lDbApZ42E86U91MP3VZX5KVzoVZWGbyh6oZiHoV0PTq0DIBpUWiSfukQSj5faCpMXjytfpn1/pubhtml?widget=true&amp;headers=true&amp;chrome=false"
          className="embed-responsive-item border border-dark"
          allowFullScreen
          onLoad={handleIframeLoad}
        />
      </div>
    </div>
  );
}

export default FullTableEnduranceTraining;
