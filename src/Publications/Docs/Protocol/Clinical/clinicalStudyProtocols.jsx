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
              Adult_Combined_MOPs_2024_03_28.pdf
            </a>
          </p>
          <p>
            <a
              href="https://drive.google.com/file/d/1nCJAgLKVxgzVwGm8qPMM-3co4pYuRdRY/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
            >
              MoTrPAC_Adult_Protocol_v3.0_2023_08_22_clean.pdf
            </a>
          </p>
          <p>
            <a
              href="https://drive.google.com/file/d/1L82fU6Ex09rxuYbi6Xxk-QPv3o64R2rM/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
            >
              Pediatric_Clinical_Protocol_Version_v8.12_2023_03_14.pdf
            </a>
          </p>
          <p>
            <a
              href="https://drive.google.com/file/d/1rfJLN3ELxT02139xN5BITG_LfrvSLIxJ/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
            >
              Peds_Combined_MOPs_2024_01_08.pdf
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ClinicalStudyProtocols;
