import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';
import { Tooltip } from 'react-tooltip';
import IconSet from '../lib/iconSet';

function ContactForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [name, setName] = useState('');
  const [reCaptcha, setReCaptcha] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [formValidated, setFormValidated] = useState(false);
  const [requestPending, setRequestPending] = useState(false);
  const recaptchaRef = useRef(null);

  // Set up environment variables
  const api = import.meta.env.DEV
    ? import.meta.env.VITE_API_SERVICE_ADDRESS_DEV
    : import.meta.env.VITE_API_SERVICE_ADDRESS;
  const endpoint = import.meta.env.VITE_SEND_EMAIL_ENDPOINT;
  const key = import.meta.env.DEV
    ? import.meta.env.VITE_API_SERVICE_KEY_DEV
    : import.meta.env.VITE_API_SERVICE_KEY;
  const recaptchaKey = import.meta.env.VITE_reCAPTCHA_SITE_KEY;

  useEffect(() => {
    // validate REQUIRED form values by subscribing to changes in the states
    // and determine whether user can submit the contact form
    const newObj = {
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
      reCaptcha,
    };

    // invalidate form if this array is non-zero length
    const invalidValues = [];

    Object.entries(newObj).forEach(([key, value]) => {
      if (typeof value === 'string' && !value.length) {
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
  }, [name, email, subject, message, reCaptcha]);

  // Helper functions to validate form
  function setValidClass(e) {
    e.target.classList.remove('is-invalid');
    e.target.classList.add('is-valid');
  }

  function setInvalidClass(e) {
    e.target.classList.remove('is-valid');
    e.target.classList.add('is-invalid');
  }

  // Handler to validate form values on blur event
  function validateOnBlur(e) {
    if (e.target.value && e.target.value.match(/^[A-Za-z\,\.\'\- ]{2,}$/)) {
      setValidClass(e);
    } else {
      setInvalidClass(e);
    }
  }

  // Handler to validate email on blur event
  function validateEmailOnBlur(e) {
    if (e.target.validity.valid) {
      setValidClass(e);
    } else {
      setInvalidClass(e);
    }
  }

  // Handler to validate email on blur event
  function validateMessagelOnBlur(e) {
    if (e.target.value.trim().length > 2) {
      setValidClass(e);
    } else {
      setInvalidClass(e);
    }
  }

  // Handler for reCAPTCHA click event
  const handleReCAPTCHA = (value) => {
    setReCaptcha(value);
  };

  // Handler to reset form
  function handleReset() {
    const fields = ['name', 'email', 'subject', 'message'];
    setEmail('');
    setMessage('');
    setSubject('');
    setName('');
    setFormValidated(false);
    setRequestPending(false);
    setReCaptcha('');
    setSuccess(false);
    setError(false);
    recaptchaRef.current.reset();

    // Reset form validation classes on DOM elenments
    fields.forEach((field) => {
      document
        .querySelector(`#${field}`)
        .classList.remove('is-valid', 'is-invalid');
    });
  }

  // Handler to submit form
  const handleSubmit = async () => {
    // activate spinner UI in submit button
    // while submit button is disabled
    setRequestPending(true);
    setReCaptcha('');

    // regex pattern to replace new line characters with <br> tags
    const pattern = /[\r\n]+/g;

    const formData = {
      email,
      name,
      subject,
      message: message.replace(pattern, '<br>'),
    };

    // post request configs
    const serviceUrl = `${api}${endpoint}?key=${key}`;
    const timeOutConfig = { timeout: 5000 };
    const headers = { 'Content-Type': 'application/json' };

    await axios
      .post(serviceUrl, formData, headers, timeOutConfig)
      .then((response) => {
        setSuccess(true);
        setError(false);
        console.log(response.data);
        // revert submit button to default state
        setRequestPending(false);
      })
      .catch((err) => {
        setSuccess(false);
        setError(true);
        console.error(err.data);
        // revert submit button to default state
        setRequestPending(false);
      });
  };

  return (
    <div className="card mb-5 border-secondary">
      <h5 className="card-header bg-secondary text-light">
        Questions and Inquiries
      </h5>
      <div className="card-body contact-form-container">
        <form>
          <h6 className="mb-3">
            Fill out all fields below
            <span className="required-flag">
              (<span className="required-flag-text">* Required</span>)
            </span>
          </h6>
          <div className="form-group">
            <label htmlFor="name" className="required-field">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              autoComplete="off"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={validateOnBlur}
              disabled={requestPending || success}
            />
            <div className="invalid-feedback">A valid name is required</div>
          </div>
          <div className="form-group">
            <label htmlFor="email" className="required-field">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              autoComplete="off"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={validateEmailOnBlur}
              disabled={requestPending || success}
            />
            <div className="invalid-feedback">
              A valid email address is required
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="subject" className="required-field">
              Subject
            </label>
            <select
              className="form-control"
              id="subject"
              value={subject}
              autoComplete="off"
              required
              onChange={(e) => setSubject(e.target.value)}
              onBlur={validateOnBlur}
              disabled={requestPending || success}
            >
              <option value="">--- Please select a subject ---</option>
              <option value="Account Access">Account Access</option>
              <option value="Data Access">Data Access</option>
              <option value="Data Usage/Analysis">Data Usage/Analysis</option>
              <option value="Animal Study Design">Animal Study Design</option>
              <option value="Human Study Design">Human Study Design</option>
              <option value="Technical Support">Technical Support</option>
              <option value="Other">Other</option>
            </select>
            <div className="invalid-feedback">A valid subject is required</div>
          </div>
          <div className="form-group">
            <label htmlFor="message" className="required-field">
              Message
            </label>
            <textarea
              className="form-control"
              id="message"
              rows="4"
              value={message}
              autoComplete="off"
              required
              minLength={3}
              onChange={(e) => setMessage(e.target.value)}
              onBlur={validateMessagelOnBlur}
              disabled={requestPending || success}
            />
            <div className="invalid-feedback">A valid message is required</div>
          </div>
          <div className="mt-4 d-flex justify-content-between align-items-end form-footer">
            <div className="reCAPTCHA-container">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={recaptchaKey}
                onChange={handleReCAPTCHA}
              />
            </div>
            <div className="contact-form-button-group">
              <button
                type="button"
                className="btn btn-outline-primary contact-form-reset"
                onClick={handleReset}
              >
                Reset
              </button>
              {success && (
                <Tooltip
                  anchorSelect=".contact-form-reset"
                  place="top"
                  isOpen
                  delayShow={5000}
                >
                  Reset form to start over
                </Tooltip>
              )}
              <button
                type="button"
                className="btn btn-primary ml-3 contact-form-submit"
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                disabled={!formValidated || requestPending || success}
              >
                {requestPending ? (
                  <img
                    src={IconSet.Sync}
                    className="in-progress-spinner"
                    alt="Request in progress"
                  />
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </div>
        </form>
        {success && (
          <div
            className="alert alert-success mt-3 d-flex align-items-center"
            role="alert"
          >
            <span className="material-icons text-success mr-2">
              check_circle
            </span>
            <span>
              Thank you for your inquiry. Your message was successfully sent.
            </span>
          </div>
        )}
        {error && (
          <div
            className="alert alert-danger mt-3 d-flex align-items-center"
            role="alert"
          >
            <span className="material-icons text-danger mr-2">error</span>
            <span>Something went wrong, please try again.</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContactForm;
