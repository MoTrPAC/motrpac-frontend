import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import InteractiveBiospecimenChart from './components/InteractiveBiospecimenChart';

function ClinicalBiospecimenSummaryStatistics({ profile = {} }) {
  // get states from redux store
  const userProfile = useSelector((state) => state.auth.profile);
  const userType =
    userProfile.user_metadata && userProfile.user_metadata.userType;
  if (userType !== 'internal') {
    return <Navigate to="/dashboard" />;
  }

  // render JSX
  return (
    <div className="biospecimenSummary w-100 px-3 px-md-4 mb-3">
      <Helmet>
        <html lang="en" />
        <title>Biospecimen Summary - MoTrPAC Data Hub</title>
      </Helmet>
      <h1 className="mb-4 display-4">
        <i className="bi bi-search mr-3" />
        <span>Biospecimen Lookup</span>
      </h1>
      <div className="lead mb-4">
        Use this tool to look up biospecimen data curated from pre-COVID human
        sedentary adults and the highly active adults in the human main study.
      </div>
      <div className="biospecimen-lookup-container border shadow-sm px-4 pt-3 pb-2 mb-4">
        {/* Interactive Biospecimen Chart Component - handles all filtering and visualization */}
        <InteractiveBiospecimenChart />
      </div>
    </div>
  );
}

export default ClinicalBiospecimenSummaryStatistics;
