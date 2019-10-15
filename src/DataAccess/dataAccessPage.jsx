import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import dayjs from 'dayjs';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';
import RegistrationResponse from './response';
import IconSet from '../lib/iconSet';
import StudyDocuments from './studyDocuments';

const defaultFormValues = {
  dataUseAgreement1: false,
  dataUseAgreement2: false,
  dataUseAgreement3: false,
  dataUseAgreement4: false,
  dataUseAgreement5: false,
  dataUseAgreement6: false,
  eSignature: '',
  lastName: '',
  firstName: '',
  emailAddress: '',
  institution: '',
  isPrincipalInvestigator: false,
  PIName: '',
  dataUseIntent: '',
};

/**
 * Renders the data access page
 *
 * @param {Boolean} isAuthenticated Redux state for user's authentication status.
 * @param {Object}  profile         Redux state for authenticated user's info.
 *
 * @returns {object} JSX representation of the data access page
 */
export function DataAccessPage({ isAuthenticated, profile }) {
  const [reCaptcha, setReCaptcha] = useState('');
  const [auth0Status, setAuth0Status] = useState();
  const [auth0Error, setAuth0Error] = useState();
  const [formValidated, setFormValidated] = useState(false);
  const [checkboxAlert, setCheckboxAlert] = useState(false);
  const [formValues, setFormValues] = useState(defaultFormValues);
  const [requestPending, setRequestPending] = useState(false);

  useEffect(() => {
    // validate REQUIRED form values by subscribing to changes
    // in the 'formValues' and 'reCaptcha' states
    // and determine whether user can submit registration form
    const newObj = { ...formValues };
    // delete non-required keys from object
    delete newObj.isPrincipalInvestigator;
    delete newObj.PIName;
    delete newObj.dataUseIntent;
    // append REQUIRED reCAPTCHA key to object
    newObj.reCaptcha = reCaptcha;
    // invalidate form if this array is non-zero
    const invalidValues = [];

    Object.entries(newObj).forEach(([key, value]) => {
      if ((typeof value === 'string' && !value.length) || (typeof value === 'boolean' && value === false)) {
        invalidValues.push(key);
      }
    });
    if (invalidValues.length) {
      setFormValidated(false);
    } else {
      setFormValidated(true);
    }
    return () => {
      setFormValidated(false);
    };
  }, [formValues, reCaptcha]);

  // Route user to release page if authenticated and has access to data
  const hasAccess = profile.user_metadata && profile.user_metadata.hasAccess;

  if (isAuthenticated && hasAccess) {
    return <Redirect to="/releases" />;
  }

  // Render registration response view if auth0 post request is successful
  if (auth0Status && auth0Status.length) {
    return (
      <div className={`col-md-9 ${isAuthenticated ? 'ml-sm-auto' : ''} col-lg-10 px-4 dataAccessPage`}>
        <div className={`${!isAuthenticated ? 'container' : ''}`}>
          <RegistrationResponse status={auth0Status} errMsg={auth0Error} />
        </div>
      </div>
    );
  }

  // Handler to render study documents table rows
  function renderStudyDocumentsTableRow(item) {
    return (
      <tr key={item.title} className="document-list-item">
        <td>
          <div className="d-flex align-items-center justify-content-start">
            <img src={IconSet.PDF} alt="PDF" />
            <a href={item.location} download target="_blank" rel="noopener noreferrer">{item.title}</a>
          </div>
        </td>
        <td>{item.description}</td>
      </tr>
    );
  }

  // Handler for checkbox click events
  function handleCheckboxClick(checked, e) {
    const cloneFormValues = { ...formValues };
    cloneFormValues[e.target.id] = !!checked;
    setFormValues(cloneFormValues);
  }

  // Handler for form field change events
  function handleFormChange(value, e) {
    const cloneFormValues = { ...formValues };
    cloneFormValues[e.target.id] = value;
    setFormValues(cloneFormValues);
  }

  // Handler for reCAPTCHA click event
  function handleReCAPTCHA(value) {
    setReCaptcha(value);
  }

  // Handler to validate form values on blur event
  function validateOnBlur(e) {
    const regex = new RegExp(e.target.pattern);
    if (regex.test(e.target.value)) {
      e.target.classList.remove('is-invalid');
      e.target.classList.add('is-valid');
    } else {
      e.target.classList.remove('is-valid');
      e.target.classList.add('is-invalid');
    }
  }

  // Handler to validate email on blur event
  function validateEmailOnBlur(e) {
    if (e.target.validity.valid) {
      e.target.classList.remove('is-invalid');
      e.target.classList.add('is-valid');
    } else {
      e.target.classList.remove('is-valid');
      e.target.classList.add('is-invalid');
    }
  }

  // Handler to validate all embargo agreement checkboxes selected
  function validateAgreementTerms() {
    const checkboxes = [
      'dataUseAgreement1',
      'dataUseAgreement2',
      'dataUseAgreement3',
      'dataUseAgreement4',
      'dataUseAgreement5',
      'dataUseAgreement6',
    ];
    const uncheckboxes = checkboxes.filter(checkbox => !formValues[checkbox]);
    if (uncheckboxes.length) {
      setCheckboxAlert(true);
    } else {
      setCheckboxAlert(false);
    }
  }

  // Handler to reset form
  function handleReset() {
    const fields = [
      'eSignature',
      'lastName',
      'firstName',
      'emailAddress',
      'institution',
    ];
    setFormValues(defaultFormValues);
    setCheckboxAlert(false);
    setFormValidated(false);
    fields.forEach((field) => {
      document.querySelector(`#${field}`).classList.remove('is-valid', 'is-invalid');
    });
  }

  // Handler to submit form
  function handleSubmit() {
    // activate spinner UI in submit button
    // while submit button is disabled
    setRequestPending(true);

    const timeFormat = 'MMM D, YYYY'; // Oct 15, 2019

    const userObj = {
      email: formValues.emailAddress,
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      institution: formValues.institution,
      isPrincipalInvestigator: formValues.isPrincipalInvestigator,
      principalInvestigatorName: formValues.PIName,
      dataUseIntent: formValues.dataUseIntent,
      eSignature: formValues.eSignature,
      embargoAgreementVersion: 'E1.0',
      embargoAgreementDate: dayjs().format(timeFormat),
    };

    // post request configs
    const serviceUrl = 'https://service-apis.motrpac-data.org/new_user';
    const timeOutConfig = { timeout: 5000 };

    return axios.post(serviceUrl, userObj, timeOutConfig).then((response) => {
      setAuth0Status(response.data.status);
      // handle default Auth0 error returned by backend service
      if (response.data.auth0) {
        setAuth0Error(response.data.auth0);
      }
      // revert submit button to default state
      setRequestPending(false);
    }).catch((err) => {
      setAuth0Status('internal-error');
      // revert submit button to default state
      setRequestPending(false);
      console.log(`${err.error}: ${err.errorDescription}`);
    });
  }

  return (
    <div className={`col-md-9 ${isAuthenticated ? 'ml-sm-auto' : ''} col-lg-10 px-4 dataAccessPage`}>
      <div className={`${!isAuthenticated ? 'container' : ''}`}>
        <form id="dataAccessRegistration" name="dataAccessRegistration" noValidate>
          <div className="page-title pt-3 pb-2 border-bottom">
            <h3>MoTrPAC External Data Release</h3>
          </div>
          <div className="alert alert-dark alert-consortia-members-access" role="alert">
            MoTrPAC consortium members are not required to fill out the following data use agreement
            and registration. Consortium members who already have registered accounts may access the
            released data upon login. Consortium members who don't have registered accounts and wish
            to access the data, please contact&nbsp;
            <a href="mailto:motrpac-helpdesk@lists.stanford.edu" className="inline-link-with-icon">
              motrpac-helpdesk@lists.stanford.edu
              <i className="material-icons email-icon">mail</i>
            </a>
          </div>
          <div className="data-access-content">
            <p>
              MoTrPAC (
              <a href="https://commonfund.nih.gov/moleculartransducers" className="inline-link-with-icon" target="_blank" rel="noopener noreferrer">
                Molecular Transducers of Physical Activity Consortium
                <i className="material-icons external-linkout-icon">open_in_new</i>
              </a>
              ) is national research
              consortium funded by the&nbsp;
              <a href="https://commonfund.nih.gov" className="inline-link-with-icon" target="_blank" rel="noopener noreferrer">
                NIH Common Fund
                <i className="material-icons external-linkout-icon">open_in_new</i>
              </a>
              . MoTrPAC is designed to discover and perform
              preliminary characterization of the range of molecular transducers
              (the "molecular map") that underlie the effects of physical activity. The study
              consists of acute and long-term exercise interventions in humans and rats, where
              multiple tissues are collected at multiple time points.
            </p>
          </div>
          <div className="section-title mt-4 mb-2">
            <h5 className="mt-4">Accessing the MoTrPAC data</h5>
          </div>
          <div className="data-access-content">
            <p>
            To access MoTrPAC data, please register and fill out the data use agreement here
            (see below). Assay-specific results and associated metadata, QC reports and animal
            phenotype data can be downloaded as separate files or as a combined file from the
            MoTrPAC Data Hub. Please note that during the embargo period, until January 15th
            2021, data can only be used for analyses supporting grant submissions, and not be
            used in abstracts, manuscripts, preprints or presentations.
            </p>
          </div>
          <div className="section-title mt-4 mb-2">
            <h5 className="mt-4">Data included in the releases</h5>
          </div>
          <div className="data-access-content">
            <p>
              <span className="subhead">Release 1.0:</span>
              This release contains data from 6-month old rats that performed an acute bout
              of endurance exercise. For a full description of this study, see the animal
              protocol (Phase 1A) study documentation. There is data from 5 different tissues
              collected at multiple different time points after exercise. Untrained control
              animals from 2 time points are also included. The data includes phenotypic
              and -omic data from multiple assays, including RNA sequencing, Reduced Representation
              Bisulfite Sequencing (RRBS), proteomics, phosphoproteomics, acetylproteomics,
              and targeted and untargeted metabolomics.
            </p>
          </div>
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
          <div className="card mb-3 border-secondary">
            <div className="card-header bg-secondary text-light">Data Use Agreement and Registration</div>
            <div className="card-body">
              {/* Data use agreement section */}
              <h5 className="card-title pt-1 pb-2">Data Use Agreement</h5>
              <div className="data-access-content data-use-agreement-container">
                <p className="card-text">
                  Use of MoTrPAC external release data is subject to the terms specified in this
                  Data Use Agreement. The terms establish and maintain an appropriate balance
                  between the interests data users have in rapid access to data and needs that
                  data producers have to publish and receive recognition for their work.
                </p>
                <p className="card-text">
                  MoTrPAC is a community research project; the goal is to make data available
                  rapidly after generation for community research use. MoTrPAC consortium
                  members have plans for several publications and to avoid duplicate efforts and
                  promote collaborations between MoTrPAC internal and external investigators, external
                  researchers are encouraged to coordinate their independent efforts with the
                  MoTrPAC publication schedule.This may be done by contacting MoTrPAC through&nbsp;
                  <a
                    href="https://www.motrpac.org/ancillarystudyguidelines.cfm"
                    className="inline-link-with-icon"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://www.motrpac.org/ancillarystudyguidelines.cfm
                    <i className="material-icons external-linkout-icon">open_in_new</i>
                  </a>
                  &nbsp;or&nbsp;
                  <a href="mailto:MoTrPAC-ACC@aging.ufl.edu" className="inline-link-with-icon">
                    MoTrPAC-ACC@aging.ufl.edu
                    <i className="material-icons email-icon">mail</i>
                  </a>
                </p>
                <p className="card-text">
                  MoTrPAC data is available for exploration by external researchers
                  agreeing to the terms of this DUA. The terms for use of MoTrPAC
                  data include:
                </p>
                <div className="form-row user-agreement-item">
                  <div className="form-group col-md-12">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="dataUseAgreement1"
                        required
                        onChange={e => handleCheckboxClick(e.currentTarget.checked, e)}
                        checked={formValues.dataUseAgreement1}
                      />
                      <label className="form-check-label" htmlFor="dataUseAgreement1">
                        Data&nbsp;
                        <strong>CANNOT</strong>
                        &nbsp;be used for&nbsp;
                        <strong>submission</strong>
                        &nbsp;of abstracts, manuscripts, preprints or
                        presentations before the embargo deadline.
                      </label>
                    </div>
                  </div>
                </div>
                <div className="form-row user-agreement-item">
                  <div className="form-group col-md-12">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="dataUseAgreement2"
                        required
                        onChange={e => handleCheckboxClick(e.currentTarget.checked, e)}
                        checked={formValues.dataUseAgreement2}
                      />
                      <label className="form-check-label" htmlFor="dataUseAgreement2">
                        Data&nbsp;
                        <strong>CANNOT</strong>
                        &nbsp;be publicly hosted or disseminated before the embargo deadline.
                      </label>
                    </div>
                  </div>
                </div>
                <div className="form-row user-agreement-item">
                  <div className="form-group col-md-12">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="dataUseAgreement3"
                        required
                        onChange={e => handleCheckboxClick(e.currentTarget.checked, e)}
                        checked={formValues.dataUseAgreement3}
                      />
                      <label className="form-check-label" htmlFor="dataUseAgreement3">
                        The embargo period for any type of publication of MoTrPAC
                        External Release 1 data is 15 months after external release 1: through&nbsp;
                        <strong>January 15, 2021</strong>
                        .
                      </label>
                    </div>
                  </div>
                </div>
                <div className="form-row user-agreement-item">
                  <div className="form-group col-md-12">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="dataUseAgreement4"
                        required
                        onChange={e => handleCheckboxClick(e.currentTarget.checked, e)}
                        checked={formValues.dataUseAgreement4}
                      />
                      <label className="form-check-label" htmlFor="dataUseAgreement4">
                        Data&nbsp;
                        <strong>CAN</strong>
                        &nbsp;be used for analyses supporting grant submissions prior
                        to the embargo deadline.
                      </label>
                    </div>
                  </div>
                </div>
                <div className="form-row user-agreement-item">
                  <div className="form-group col-md-12">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="dataUseAgreement5"
                        required
                        onChange={e => handleCheckboxClick(e.currentTarget.checked, e)}
                        checked={formValues.dataUseAgreement5}
                      />
                      <label className="form-check-label" htmlFor="dataUseAgreement5">
                        After the embargo period, Recipients and their Agents agree
                        that in publications using&nbsp;
                        <strong>any</strong>
                        &nbsp;data from MoTrPAC public use data sets they will
                        acknowledge MoTrPAC as the source of data, including the
                        version number of the data sets used.
                        <ul>
                          <li>
                            Data used in the preparation of this article were
                            obtained from the Molecular Transducers of Physical
                            Activity Consortium (MoTrPAC) database, which is
                            available for public access at motrpac-data.org. Specific
                            datasets used are [version numbers].
                          </li>
                        </ul>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="form-row user-agreement-item">
                  <div className="form-group col-md-12">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="dataUseAgreement6"
                        required
                        onChange={e => handleCheckboxClick(e.currentTarget.checked, e)}
                        checked={formValues.dataUseAgreement6}
                      />
                      <label className="form-check-label" htmlFor="dataUseAgreement6">
                        Recipients agree to notify MoTrPAC of articles published
                        using MoTrPAC data so that publications can be tracked
                        and referenced on the MoTrPAC public website. Please
                        contact MoTrPAC at&nbsp;
                        <a href="mailto:MoTrPAC-ACC@aging.ufl.edu" className="inline-link-with-icon">
                          MoTrPAC-ACC@aging.ufl.edu
                          <i className="material-icons email-icon">mail</i>
                        </a>
                      </label>
                    </div>
                  </div>
                </div>
                <p className="card-text">
                  <span className="subhead">Citing MoTrPAC data in publications example:</span>
                  The Molecular Transducers of Physical Activity Consortium (MoTrPAC). External
                  Data Release.&nbsp;
                  <em>MoTrPAC Data Hub</em>
                  . MoTrPAC Bioinformatics Center. October 15, 2019. Version 1.0.&nbsp;
                  motrpac-data.org/data-access
                </p>
                <p className="card-text">
                  <em>Optional:</em>
                  &nbsp;MoTrPAC investigators welcome collaboration with external
                  investigators. To be able to identify common analysis interests,
                  please provide an outline of your plans for the data.
                </p>
                <p className="card-text">
                  If you have questions, please contact&nbsp;
                  <a href="mailto:motrpac-helpdesk@lists.stanford.edu" className="inline-link-with-icon">
                    motrpac-helpdesk@lists.stanford.edu
                    <i className="material-icons email-icon">mail</i>
                  </a>
                </p>
                <div className={`d-flex align-items-center alert-missing-checkbox text-danger ${checkboxAlert ? 'visible' : ''}`}>
                  <i className="material-icons error-icon">error</i>
                  <span>Please indicate that you agree to all terms above.</span>
                </div>
                <div className="card mb-4 w-50 e-signature">
                  <div className="card-body">
                    <label htmlFor="eSignature" className="e-signature-label">E-Signature:</label>
                    <input
                      type="text"
                      className="form-control e-signature-input"
                      id="eSignature"
                      placeholder="Type full name here"
                      autoComplete="off"
                      required
                      onChange={e => handleFormChange(e.currentTarget.value, e)}
                      value={formValues.eSignature}
                      pattern="^[A-Za-z\,\.\'\- ]{2,80}$"
                      onBlur={validateOnBlur}
                      onFocus={validateAgreementTerms}
                    />
                    <div className="invalid-feedback">
                      A valid e-Signature is required
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              {/* Registration form section */}
              <h5 className="card-title pt-1 pb-2">Data Access Registration</h5>
              <div className="data-access-content">
                <div className="registration-form-container">
                  <div className="personal-info-content">
                    <div className="section-title mb-2">
                      <h6>
                        Personal Information
                        <span className="required-flag">
                          (
                          <span className="required-flag-text">* Required</span>
                          )
                        </span>
                      </h6>
                    </div>
                    <div className="form-row mx-lg-n5">
                      <div className="form-group col-md-6 px-lg-5">
                        <label htmlFor="firstName" className="required-field">First Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="firstName"
                          autoComplete="off"
                          required
                          onChange={e => handleFormChange(e.currentTarget.value, e)}
                          value={formValues.firstName}
                          pattern="^[A-Za-z\,\.\'\- ]{2,30}$"
                          onBlur={validateOnBlur}
                        />
                        <div className="invalid-feedback">
                          A valid first name is required
                        </div>
                      </div>
                      <div className="form-group col-md-6 px-lg-5">
                        <label htmlFor="lastName" className="required-field">Last Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="lastName"
                          autoComplete="off"
                          required
                          onChange={e => handleFormChange(e.currentTarget.value, e)}
                          value={formValues.lastName}
                          pattern="^[A-Za-z\,\.\'\- ]{2,30}$"
                          onBlur={validateOnBlur}
                        />
                        <div className="invalid-feedback">
                          A valid last name is required
                        </div>
                      </div>
                    </div>
                    <div className="form-row mx-lg-n5">
                      <div className="form-group col-md-6 px-lg-5">
                        <label htmlFor="emailAddress" className="required-field">Email Address</label>
                        <input
                          type="email"
                          className="form-control"
                          id="emailAddress"
                          autoComplete="off"
                          required
                          onChange={e => handleFormChange(e.currentTarget.value, e)}
                          value={formValues.emailAddress}
                          onBlur={validateEmailOnBlur}
                        />
                        <div className="invalid-feedback">
                          A valid email address is required
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="affiliation-info-content">
                    <div className="section-title mt-3 mb-2">
                      <h6>
                        Affiliation Information
                        <span className="required-flag">
                          (
                          <span className="required-flag-text">* Required</span>
                          )
                        </span>
                      </h6>
                    </div>
                    <div className="form-row mx-lg-n5">
                      <div className="form-group col-md-6 px-lg-5">
                        <label htmlFor="institution" className="required-field">Institution</label>
                        <input
                          type="text"
                          className="form-control"
                          id="institution"
                          autoComplete="off"
                          required
                          onChange={e => handleFormChange(e.currentTarget.value, e)}
                          value={formValues.institution}
                          pattern="^[A-Za-z\,\.\'\- ]{2,80}$"
                          onBlur={validateOnBlur}
                        />
                        <div className="invalid-feedback">
                          A valid institution name is required
                        </div>
                      </div>
                      <div className="form-group col-md-6 px-lg-5">
                        <label htmlFor="PIName">Name of PI</label>
                        <input
                          type="text"
                          className="form-control"
                          id="PIName"
                          autoComplete="off"
                          onChange={e => handleFormChange(e.currentTarget.value, e)}
                          value={formValues.PIName}
                          pattern="^[A-Za-z\,\.\'\- ]{2,80}$"
                          disabled={formValues.isPrincipalInvestigator}
                        />
                      </div>
                    </div>
                    <div className="form-row mx-lg-n5">
                      <div className="form-group col-md-6 px-lg-5">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="isPrincipalInvestigator"
                            onChange={e => handleCheckboxClick(e.currentTarget.checked, e)}
                            checked={formValues.isPrincipalInvestigator}
                          />
                          <label className="form-check-label" htmlFor="isPrincipalInvestigator">
                            I am a principal investigator
                          </label>
                        </div>
                      </div>
                      <div className="form-group col-md-6 px-lg-5">
                        <label htmlFor="dataUseIntent">Intent of data use (optional)</label>
                        <textarea
                          className="form-control"
                          id="dataUseIntent"
                          row="3"
                          onChange={e => handleFormChange(e.currentTarget.value, e)}
                          value={formValues.dataUseIntent}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 d-flex justify-content-between align-items-end">
                  <div className="reCAPTCHA-container">
                    <ReCAPTCHA
                      sitekey="6Lf8oboUAAAAAB6SoflqfgfHvwHrV62gaPaL2-BL"
                      onChange={handleReCAPTCHA}
                    />
                  </div>
                  <div className="registration-button-group">
                    <button
                      type="button"
                      className="btn btn-outline-primary registration-reset"
                      onClick={handleReset}
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary registration-submit ml-3"
                      onClick={(e) => { e.preventDefault(); handleSubmit(); }}
                      disabled={!formValidated || requestPending}
                    >
                      {requestPending
                        ? (
                          <img src={IconSet.Sync} className="in-progress-spinner" alt="Request in progress" />
                        )
                        : 'Submit'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

DataAccessPage.propTypes = {
  profile: PropTypes.shape({
    user_metadata: PropTypes.object,
  }),
  isAuthenticated: PropTypes.bool,
};

DataAccessPage.defaultProps = {
  profile: {},
  isAuthenticated: false,
};

const mapStateToProps = state => ({
  profile: state.auth.profile,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(DataAccessPage);
