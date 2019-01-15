import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import dayjs from 'dayjs';

const timeFormat = 'MMM D, YYYY - h:m A'; //  Jan 31, 2019 - 2:34 PM
const timeFormatCondensed = 'M/D/YYYY'; //  1/31/2019

const historyPropType = {
  fileName: PropTypes.string,
  timeStamp: PropTypes.number,
  uuid: PropTypes.string,
};
const uploadPropType = {
  history: PropTypes.arrayOf(PropTypes.shape({ ...historyPropType })),
  expanded: PropTypes.bool,
  biospecimenID: PropTypes.string,
  subject: PropTypes.string,
  phase: PropTypes.string,
  dataType: PropTypes.string,
  lastUpdated: PropTypes.number,
};

// Table that is displayed on dashboard, meant to show user/site/grant specific information
// and act as a log of uploads done by that group.
export function PreviousUploadsTable({ previousUploads, expandRow }) {
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
  function UploadRow({ upload }) {
    let uploadHistory;
    if (upload.history) {
      uploadHistory = (
        <div className="col-12 history">
          {
            upload.history
              .map(hist => <UploadHistoryRow historyItem={hist} key={hist.uuid} />)
          }
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
      <div className="row uploadRow">
        <div className="col-auto caretCol">
          <Caret upload={upload} />
        </div>
        <div className="col-2">{upload.biospecimenID}</div>
        <div className="col-2">{upload.subject}</div>
        <div className="col-2">{upload.phase}</div>
        <div className="col-3">{upload.dataType}</div>
        <div className="col-2">{dayjs(upload.lastUpdated).format(timeFormatCondensed)}</div>
        {upload.expanded && uploadHistory}
      </div>
    );
  }
  UploadRow.propTypes = {
    upload: PropTypes.shape({ ...uploadPropType }).isRequired,
  };
  Caret.propTypes = {
    upload: PropTypes.shape({ ...uploadPropType }).isRequired,
  };

  // creating an upload row for each unique experiment
  const uploadRows = previousUploads
    .map(upload => (
      <UploadRow upload={upload} key={upload.biospecimenID + upload.dataType} />
    ));
  return (
    <div className="col-12 col-md-7 previousUploadsTable">
      <div className="row uploadHeader uploadRow">
        <div className="col-auto caretCol">
          <span className="oi oi-caret-right hiddenCaret" />
        </div>
        <div className="col-2">BID</div>
        <div className="col-2">Subject</div>
        <div className="col-2">Phase</div>
        <div className="col-3">Type</div>
        <div className="col-2">Updated</div>
      </div>
      {uploadRows}
    </div>
  );
}

PreviousUploadsTable.propTypes = {
  previousUploads: PropTypes.arrayOf(PropTypes.shape({ ...uploadPropType })),
  expandRow: PropTypes.func.isRequired,
};
PreviousUploadsTable.defaultProps = {
  previousUploads: [],
};

const mapStateToProps = state => ({
  previousUploads: state.upload.previousUploads,
});
const mapDispatchToProps = dispatch => ({
  expandRow: up => dispatch({
    type: 'EXPAND_UPLOAD_HISTORY',
    upload: up,
  }),
});
export default connect(mapStateToProps, mapDispatchToProps)(PreviousUploadsTable);
