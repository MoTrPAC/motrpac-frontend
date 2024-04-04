import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import PageTitle from '../../../../lib/ui/pageTitle';

function ClinicalStudyProtocols() {
  // get states from redux store
  const userProfile = useSelector((state) => state.auth.profile);

  const userType =
    userProfile.user_metadata && userProfile.user_metadata.userType;

  if (userType !== 'internal') {
    return <Redirect to="/search" />;
  }

  return (
    <div className="clinicalStudyProtocolsPage px-3 px-md-4 mb-3 container">
      <Helmet>
        <html lang="en" />
        <title>MoTrPAC Clinical Study Protocols and MOPs</title>
      </Helmet>
      <PageTitle title="MoTrPAC Clinical Study Protocols and MOPs" />
      <div className="clinical-study-protocols-container">
        <div className="clinical-study-protocols-content-container mt-5">
          <p>
            <a
              href="https://drive.google.com/file/d/1-XvXVV2iLfg5q-b7GmLQ1Dd_GFqbnhs5/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
            >
              MoTrPAC Adult Study - Manual of Procedures chapters_2024.03.28
            </a>
          </p>
          <p>
            <a
              href="https://drive.google.com/file/d/15QxK8QfaiWN0U9T3tlsuaWqbp5Yu7rIr/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
            >
              MoTrPAC Adult Study - Protocol_v3.0_2023.08.22
            </a>
          </p>
          <p>
            <a
              href="https://drive.google.com/file/d/1L82fU6Ex09rxuYbi6Xxk-QPv3o64R2rM/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
            >
              MoTrPAC Pediatric Study - Protocol_v8.12_2023.03.14
            </a>
          </p>
          <p>
            <a
              href="https://drive.google.com/file/d/1rfJLN3ELxT02139xN5BITG_LfrvSLIxJ/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
            >
              MoTrPAC Pediatric Study - Manual of Procedures chapters_2024.01.08
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ClinicalStudyProtocols;
