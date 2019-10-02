import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import RegistrationResponse from './response';

/**
 * Renders the data access page
 *
 * @param {Boolean} isAuthenticated Redux state for user's authentication status.
 * @param {Object}  profile         Redux state for authenticated user's info.
 *
 * @returns {object} JSX representation of the data access page
 */
export function DataAccessPage({ isAuthenticated, profile }) {
  const [principalInvestigator, setPrincipalInvestigator] = useState(false);
  const [reCaptcha, setReCaptcha] = useState('');
  const [auth0Status, setAuth0Status] = useState();
  const [formValidated, setFormValidated] = useState(false);
  const [formValues, setFormValues] = useState({
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
  });

  useEffect(() => {
    // validate form values by subscribing to changes
    // in the 'formValues' and 'reCaptcha' states
    // and determine whether user can submit registration form
    const newObj = { ...formValues };
    newObj.reCaptcha = reCaptcha;
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
          <RegistrationResponse status={auth0Status} />
        </div>
      </div>
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

  // Handler for 'isPrincipalInvestigator' checkbox click event
  function handlePIClick() {
    setPrincipalInvestigator(!principalInvestigator);
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

  return (
    <div className={`col-md-9 ${isAuthenticated ? 'ml-sm-auto' : ''} col-lg-10 px-4 dataAccessPage`}>
      <div className={`${!isAuthenticated ? 'container' : ''}`}>
        <form id="dataAccessRegistration" name="dataAccessRegistration" noValidate>
          <div className="page-title pt-3 pb-2 border-bottom">
            <h3>MoTrPAC Data External Release 1.0</h3>
          </div>
          <div className="data-access-content">
            <p>
              Some language about the MoTrPAC data in principal and methodologies in producing these data.
              ut labore et dolore magna aliqua. Ut enim ad minim veniam, quiepakis nostrud exercitation
              ullamco laboris nsi ut aliquip ex ea comepmodo consetquat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cfgillum dolore eutpe fugiat nulla pariatur. Excepteur
              sint occaecat cupidatat non proident, sunt inpeku culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
          <div className="section-title mt-4 mb-2">
            <h5>Accessing the MoTrPAC data</h5>
          </div>
          <div className="data-access-content">
            <p>
              Some language describing the process of obtaining the MoTrPAC data through the data hub portal, such
              as starting with the registration and signing the user agreement, etc. ut labore et dolore magna.
              ullamco laboris nsi ut aliquip ex ea comepmodo consetquat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cfgillum dolore eutpe fugiat nulla pariatur. Excepteur
              sint occaecat cupidatat non proident, sunt inpeku culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
          <div className="section-title mt-4 mb-2">
            <h5>Data included in the release</h5>
          </div>
          <div className="data-access-content">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt
              ut labore et dolore magna aliqua. Ut enim ad minim veniam, quiepakis nostrud exercitation
              ullamco laboris nsi ut aliquip ex ea comepmodo consetquat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cfgillum dolore eutpe fugiat nulla pariatur. Excepteur
              sint occaecat cupidatat non proident, sunt inpeku culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
          <div className="data-access-content">
            <p>
              <strong>
                MoTrPAC consortium members are not required to fill out the following data use agreement
                and registration. Consortium members who already have registered accounts may access the
                released data upon login. Consortium members who don't have registered accounts and wish
                to access the released, please contact&nbsp;
                <a href="mailto:motrpac-helpdesk@lists.stanford.edu" className="inline-link-with-icon">
                  motrpac-helpdesk@lists.stanford.edu
                  <i className="material-icons email-icon">mail</i>
                </a>
              </strong>
            </p>
          </div>
          <div className="card mb-3">
            <div className="card-header">Data Use Agreement and Registration</div>
            <div className="card-body">
              {/* Data use agreement section */}
              <h5 className="card-title pt-1 pb-2">Data Use Agreement</h5>
              <div className="data-access-content data-use-agreement-container">
                <p className="card-text">
                  Use of MotrPAC external release data is subject to the terms specified in this
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
                <div className="form-row user-agreement-item">
                  <div className="form-group col-md-12">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="dataUseAgreement1"
                        onChange={e => handleCheckboxClick(e.currentTarget.checked, e)}
                        checked={formValues.dataUseAgreement1}
                      />
                      <label className="form-check-label" htmlFor="dataUseAgreement1">
                        Data <strong>CANNOT</strong> be used for <strong>submission</strong> of
                        abstracts, manuscripts, preprints or presentations before the embargo deadline.
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
                        onChange={e => handleCheckboxClick(e.currentTarget.checked, e)}
                        checked={formValues.dataUseAgreement2}
                      />
                      <label className="form-check-label" htmlFor="dataUseAgreement2">
                        Data <strong>CANNOT</strong> be publicly hosted or disseminated before the embargo deadline.
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
                        onChange={e => handleCheckboxClick(e.currentTarget.checked, e)}
                        checked={formValues.dataUseAgreement3}
                      />
                      <label className="form-check-label" htmlFor="dataUseAgreement3">
                        The embargo period for any type of publication of MoTrPAC external release 1 data is 15
                        months after external release 1: <strong>January 15, 2021</strong>.
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
                        onChange={e => handleCheckboxClick(e.currentTarget.checked, e)}
                        checked={formValues.dataUseAgreement4}
                      />
                      <label className="form-check-label" htmlFor="dataUseAgreement4">
                        Data <strong>CAN</strong> be used for analyses supporting grant submissions prior to the embargo deadline.
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
                        onChange={e => handleCheckboxClick(e.currentTarget.checked, e)}
                        checked={formValues.dataUseAgreement5}
                      />
                      <label className="form-check-label" htmlFor="dataUseAgreement5">
                        After the embargo period, Recipients and their Agents agree that in publications using&nbsp;
                        <strong>any</strong> data from MoTrPAC public use data sets they will acknowledge MoTrPAC as the source
                        of data, including the version number of the data sets used.
                          <ul>
                            <li>
                              Data used in the preparation of this article were obtained from the Molecular Transducers
                              of Physical Activity Consortium (MoTrPAC) database, which is available for public access
                              at motrpac-datahub.org. Specific datasets usedare [version numbers].
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
                        onChange={e => handleCheckboxClick(e.currentTarget.checked, e)}
                        checked={formValues.dataUseAgreement6}
                      />
                      <label className="form-check-label" htmlFor="dataUseAgreement6">
                        Recipients agree to notify MoTrPAC of articles published using MoTrPAC data so that
                        publications can be tracked and referenced on the MoTrPAC public website. Please
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
                  <span className="subhead">Citing MoTrPAC data in publications:</span>
                  The Molecular Transducers of Physical Activity Consortium (MoTrPAC). External
                  Data Release X.X. MoTrPAC DataHub. MoTrPAC Bioinformatics Center. Version
                  release date. Version number. motrpac-data.org/releases/ [###path.html]
                </p>
                <p className="card-text">
                  <em>Optional:</em>
                  &nbsp;MoTrPAC investigators welcome collaboration with external investigators. To be
                  able to identify common analysis interests, please provide an outline of your
                  plans for the data.
                </p>
                <p className="card-text">
                  If you have questions, please contact&nbsp;
                  <a href="mailto:motrpac-helpdesk@lists.stanford.edu" className="inline-link-with-icon">
                    motrpac-helpdesk@lists.stanford.edu
                    <i className="material-icons email-icon">mail</i>
                  </a>
                </p>
                <div className="card mb-4 w-50 e-signature">
                  <div className="card-body">
                    <label htmlFor="eSignature" className="e-signature-label">E-Signature:</label>
                    <input
                      type="text"
                      className="form-control e-signature-input"
                      id="eSignature"
                      placeholder="Type full name here"
                      required
                      onChange={e => handleFormChange(e.currentTarget.value, e)}
                      value={formValues.eSignature}
                      pattern="^[A-Za-z]{2,60}$"
                      onBlur={validateOnBlur}
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
                        <label htmlFor="lastName" className="required-field">Last Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="lastName"
                          required
                          onChange={e => handleFormChange(e.currentTarget.value, e)}
                          value={formValues.lastName}
                          pattern="^[A-Za-z]{2,30}$"
                          onBlur={validateOnBlur}
                        />
                        <div className="invalid-feedback">
                          A valid last name is required
                        </div>
                      </div>
                      <div className="form-group col-md-6 px-lg-5">
                        <label htmlFor="firstName" className="required-field">First Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="firstName"
                          required
                          onChange={e => handleFormChange(e.currentTarget.value, e)}
                          value={formValues.firstName}
                          pattern="^[A-Za-z]{2,30}$"
                          onBlur={validateOnBlur}
                        />
                        <div className="invalid-feedback">
                          A valid first name is required
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
                          required
                          onChange={e => handleFormChange(e.currentTarget.value, e)}
                          value={formValues.institution}
                          pattern="^[A-Za-z]{2,50}$"
                          onBlur={validateOnBlur}
                        />
                        <div className="invalid-feedback">
                          A valid institution name is required
                        </div>
                      </div>
                      <div className="form-group col-md-6 px-lg-5">
                        <label htmlFor="PIName">Name of PI</label>
                        <input type="text" className="form-control" id="PIName" disabled={principalInvestigator} />
                      </div>
                    </div>
                    <div className="form-row mx-lg-n5">
                      <div className="form-group col-md-6 px-lg-5">
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" id="isPrincipalInvestigator" onClick={handlePIClick.bind(this)} />
                          <label className="form-check-label" htmlFor="isPrincipalInvestigator">
                            I am a principal investigator
                          </label>
                        </div>
                      </div>
                      <div className="form-group col-md-6 px-lg-5">
                        <label htmlFor="dataUseIntent">Intent of data use (optional)</label>
                        <textarea className="form-control" id="dataUseIntent" row="3" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 d-flex justify-content-between align-items-end">
                  <div className="reCAPTCHA-container">
                    <ReCAPTCHA
                      sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                      onChange={handleReCAPTCHA}
                    />
                  </div>
                  <div className="registration-button-group">
                    <button
                      type="button"
                      className="btn btn-outline-primary registration-reset"
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary registration-submit ml-3"
                      onClick={(e) => { e.preventDefault(); }}
                      disabled={!formValidated}
                    >
                      Submit
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
