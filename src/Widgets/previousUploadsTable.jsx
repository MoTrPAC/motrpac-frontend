import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import dayjs from 'dayjs';
import { getStatusIcon } from '../DownloadPage/downloadRow';
import actions from '../UploadPage/uploadActions';
import history from '../App/history';
import downloadFilters from '../lib/downloadFilters';

// Dictionary mapping availability status to icons
const statusOptions = downloadFilters[1];

const timeFormat = 'MMM D, YYYY - h:m A'; //  Jan 31, 2019 - 2:34 PM
const timeFormatCondensed = 'M/D/YY'; //  1/31/2019

const historyPropType = {
  fileName: PropTypes.string,
  timeStamp: PropTypes.number,
  uuid: PropTypes.string,
};
const uploadPropType = {
  history: PropTypes.arrayOf(PropTypes.shape({ ...historyPropType })),
  expanded: PropTypes.bool,
  biospecimenBarcode: PropTypes.string,
  subject: PropTypes.string,
  phase: PropTypes.string,
  dataType: PropTypes.string,
  lastUpdated: PropTypes.number,
};

/**
 * Dashboard Widget intended to display experiments uploaded in the past, allows for rows
 * to be expanded to view individual file upoads
 *
 * @param {Array} previousUploads Array of files uploaded in the past by a user group
 * @param {Function} expandRow Function which handles the logic of expanding specific 
 * uploads to view upload history
 * @param {Function} onViewMore Function which handles the logic of viewing more history items
 * for uploads with more than the 'MaxLength' of visible history. 
 */
export function PreviousUploadsTable({ previousUploads, expandRow, onViewMoreHistory, editUpload }) {
  // Component to display the granular information of an individual file upload.
  function UploadHistoryRow({ historyItem }) {
    return (
      <div className="row historyItem">
        <div className="col">
          <p>
            <strong>{historyItem.fileName}</strong>
          </p>
          <p>
            {`Uploaded at: ${dayjs(historyItem.timeStamp).format(timeFormat)}`}
          </p>
        </div>
      </div>
    );
  }
  UploadHistoryRow.propTypes = {
    historyItem: PropTypes.shape({ ...historyPropType }).isRequired,
  };

  // Button to allow for expanding the row corresponding to an experiment and
  // display the UploadHistoryRow (upload history). Is transparent if no history.
  function Caret({ upload }) {
    const direction = upload.expanded ? 'oi-caret-bottom' : 'oi-caret-right';
    const visible = upload.history ? '' : 'hiddenCaret';
    return (
      <span role="button" tabIndex={0} onClick={() => { expandRow(upload); }} onKeyPress={() => { expandRow(upload); }} className={`oi ${direction} ${visible}`} />
    );
  }

  // The row on the table corresponding to one experiment.
  function UploadRow({ upload, viewMore }) {
    let uploadHistory;
    const maxLength = 5;

    // TODO: Replace viewMore function with a hook?

    const [availClass, availIcon] = getStatusIcon(upload.availability, true);
    if (upload.history) {
      const displayViewMoreBtn = upload.history.length > maxLength;
      const historyItems = (viewMore || !displayViewMoreBtn) ? upload.history : upload.history.slice(0, 5);

      uploadHistory = (
        <div className="col-12 history">
          {
            historyItems
              .map(hist => <UploadHistoryRow historyItem={hist} key={hist.uuid} />)
          }
          {
            displayViewMoreBtn ? <button type="button" onClick={() => onViewMoreHistory(upload)} className="btn btn-default viewMoreBtn">{viewMore ? 'View Less' : 'View More'}</button> : ''
          }
          <button type="button" onClick={() => { editUpload(upload); history.replace('/upload'); }} className="editUploadBtn btn btn-default">
            <span className="oi oi-plus addUploadIcon" />
            &nbsp;Add Uploads
          </button>
        </div>
      );
    } else {
      uploadHistory = (
        <div className="col-12 history noHistory">
          <p>
            No Files Uploaded
          </p>
        </div>
      );
    }

    return (
      <div className={`row py-1 uploadRow ${availClass}`}>
        <div className="col-1 caretCol">
          <Caret upload={upload} />
        </div>
        <div className="col-2"><p className="uploadRowP">{upload.biospecimenBarcode}</p></div>
        <div className="col-2"><p className="uploadRowP">{upload.subject}</p></div>
        <div className="col-2"><p className="uploadRowP">{upload.phase}</p></div>
        <div className="col-2"><p className="uploadRowP">{upload.dataType}</p></div>
        <div className="col-2"><p className="uploadRowP">{dayjs(upload.lastUpdated).format(timeFormatCondensed)}</p></div>
        <div className="col-1">
          {availIcon}
        </div>
        {upload.expanded && uploadHistory}
      </div>
    );
  }
  UploadRow.propTypes = {
    upload: PropTypes.shape({ ...uploadPropType }).isRequired,
    viewMore: PropTypes.bool,
  };
  UploadRow.defaultProps = {
    viewMore: false,
  };
  Caret.propTypes = {
    upload: PropTypes.shape({ ...uploadPropType }).isRequired,
  };

  function Legend() {
    return (
      <div className="row legend">
        <div className="col-auto legendItem">
          <p>
            <strong>Status Legend: </strong>
          </p>
        </div>
        <div className="col-auto legendItem">
          <p>
            {statusOptions.filters[0]}
            &nbsp;-
            &nbsp;
            <span className={statusOptions.icons[0]} />
          </p>
        </div>
        <div className="col-auto legendItem">
          <p>
            {statusOptions.filters[1]}
            &nbsp;-
            &nbsp;
            <span className={statusOptions.icons[1]} />
          </p>
        </div>
        <div className="col-auto legendItem">
          <p>
            {statusOptions.filters[2]}
            &nbsp;-
            &nbsp;
            <span className={statusOptions.icons[2]} />
          </p>
        </div>
      </div>
    );
  }

  // creating an upload row for each unique experiment
  const uploadRows = previousUploads
    .map(upload => (
      <UploadRow upload={upload} viewMore={upload.viewMoreHistory} key={upload.biospecimenBarcode + upload.dataType} />
    ));
  return (
    <div className="col-12 previousUploadsTable">
      <Legend />
      <div className="row uploadHeader uploadRow">
        <div className="col-1 caretCol">
          <span className="oi oi-caret-right hiddenCaret" />
        </div>
        <div className="col-2">BID</div>
        <div className="col-2">Subject</div>
        <div className="col-2">Phase</div>
        <div className="col-2">Type</div>
        <div className="col-2">Updated</div>
        <div className="col-1">Status</div>
      </div>
      {uploadRows}
    </div>
  );
}

PreviousUploadsTable.propTypes = {
  previousUploads: PropTypes.arrayOf(PropTypes.shape({ ...uploadPropType })),
  expandRow: PropTypes.func.isRequired,
  onViewMoreHistory: PropTypes.func.isRequired,
  editUpload: PropTypes.func.isRequired,
};
PreviousUploadsTable.defaultProps = {
  previousUploads: [],
};

const mapStateToProps = state => ({
  previousUploads: state.upload.previousUploads,
});
const mapDispatchToProps = dispatch => ({
  expandRow: up => dispatch(actions.expandRow(up)),
  editUpload: up => dispatch(actions.editUpload(up)),
  onViewMoreHistory: up => dispatch(actions.viewMoreHistory(up)),
});
export default connect(mapStateToProps, mapDispatchToProps)(PreviousUploadsTable);
