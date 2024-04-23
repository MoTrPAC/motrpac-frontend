import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import PageTitle from '../lib/ui/pageTitle';
import BicUpdates from './bicUpdates';
import PreCAWG from './preCAWG';
import DawgPAC from './dawgPAC';

function MultiOmicsWorkingGroups() {
  // get states from redux store
  const userProfile = useSelector((state) => state.auth.profile);

  const userType =
    userProfile.user_metadata && userProfile.user_metadata.userType;

  if (userType !== 'internal') {
    return <Navigate to="/search" />;
  }

  return (
    <div className="multiOmicsWorkingGroupsPage px-3 px-md-4 mb-3 container">
      <Helmet>
        <html lang="en" />
        <title>Resources for MoTrPAC Multi-omics Analysis Working Groups</title>
      </Helmet>
      <PageTitle title="Resources for Multi-omics Analysis Working Groups" />
      <div className="multi-omics-working-groups-container">
        <BicUpdates />
        {/* nav tabs */}
        <ul className="nav nav-tabs multi-omics-wg-tabs mt-4" role="tablist">
          <li className="nav-item font-weight-bold" role="presentation">
            <a
              className="nav-link active"
              id="pre-cawg_tab"
              data-toggle="pill"
              href="#pre-cawg"
              role="tab"
              aria-controls="pre-cawg"
              aria-selected="true"
            >
              PRE-CAWG
            </a>
          </li>
          <li className="nav-item font-weight-bold" role="presentation">
            <a
              className="nav-link"
              id="dawg-pac_tab"
              data-toggle="pill"
              href="#dawg-pac"
              role="tab"
              aria-controls="dawg-pac"
              aria-selected="false"
            >
              DAWG-PAC
            </a>
          </li>
        </ul>
        {/* tab panes */}
        <div className="tab-content multi-omics-wg-tab-content mt-3">
          <div
            className="tab-pane fade show active"
            id="pre-cawg"
            role="tabpanel"
            aria-labelledby="pre-cawg_tab"
          >
            <PreCAWG />
          </div>
          <div
            className="tab-pane fade"
            id="dawg-pac"
            role="tabpanel"
            aria-labelledby="dawg-pac_tab"
          >
            <DawgPAC profile={userProfile} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MultiOmicsWorkingGroups;
