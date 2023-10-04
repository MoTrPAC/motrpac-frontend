import React, { useState } from 'react';
import PropTypes from 'prop-types';
import BootstrapSpinner from '../../lib/ui/spinner';

function OpenAccessFileDownloadModal({
  downloadRequestResponse,
  waitingForResponse,
  handleDownloadRequest,
  selectedFiles,
}) {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  function handleSubmit() {
    // validate email and name input
    const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!email || !email.match(pattern)) {
      console.log(email);
      return false;
    }
    if (!name || !name.match(/^[a-zA-Z\s]{2,}$/)) {
      console.log(name);
      return false;
    }
    // submit download request
    handleDownloadRequest(email, name, null, selectedFiles);
    // set submission status
    setSubmitted(true);
  }

  // render download request form
  function renderForm() {
    return (
      <div className="form-file-download-request mb-4">
        <p className="mt-2">
          Please provide your email address and name. We will notify you when
          the the download is ready.
        </p>
        <div className="form-group">
          <label htmlFor="requester-email">Email address</label>
          <input
            type="email"
            className="form-control w-100 mt-1"
            id="requester-email"
            onChange={(e) => {
              e.preventDefault();
              setEmail(e.target.value);
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="requester-name">Name</label>
          <input
            type="text"
            className="form-control w-100 mt-1"
            id="requester-name"
            onChange={(e) => {
              e.preventDefault();
              setName(e.target.value);
            }}
          />
        </div>
        <div className="mt-4 d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    );
  }

  // reset state upon modal close event
  function handleModalClose() {
    setName('');
    setEmail('');
    setTimeout(() => {
      setSubmitted(false);
    }, 500);
  }

  return (
    <div
      className="modal fade data-download-modal"
      id="dataDownloadModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="dataDownloadModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">File Download Request</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={handleModalClose}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {!submitted ? renderForm() : null}
            {submitted ? (
              <div>
                {downloadRequestResponse.length > 0 && !waitingForResponse ? (
                  <div className="modal-message my-3">
                    <span className="file-download-request-response">
                      Your download request has been submitted. Processing time
                      may vary depending on the total file size. We will notify
                      you by email when the download is ready. You may now close
                      this dialog box and continue exploring our data.
                    </span>
                  </div>
                ) : (
                  <BootstrapSpinner isFetching={waitingForResponse} />
                )}
              </div>
            ) : null}
          </div>
          {submitted ? (
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                onClick={handleModalClose}
              >
                Close
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

OpenAccessFileDownloadModal.propTypes = {
  waitingForResponse: PropTypes.bool.isRequired,
  downloadRequestResponse: PropTypes.string.isRequired,
  handleDownloadRequest: PropTypes.func.isRequired,
  selectedFiles: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default OpenAccessFileDownloadModal;
