import React from 'react';
import { Link } from 'react-router-dom';
import PageTitle from '../lib/ui/pageTitle';

function Tutorials() {
  return (
    <div className="mainStudyPage px-3 px-md-4 mb-3 container">
      <PageTitle title="Tutorials" />
      <div className="main-study-container">
        <div className="main-study-summary-container row mb-4">
          <div className="lead col-12">
            Coming soon
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tutorials;
