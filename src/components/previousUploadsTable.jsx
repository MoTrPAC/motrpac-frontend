import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


export function PreviousUploadsTable({ previousUploads, expandRow }) {
  function UploadHistoryRow({ historyItem }) {
    return (
      <div className="row historyItem">
        <div className="col">
          <p>
            <strong>{historyItem.fileName}</strong>
          </p>
          <p>
            {`Uploaded at: ${new Date(historyItem.timeStamp).toString()}`}
          </p>
        </div>
      </div>
    );
  }
  function Caret({ upload }) {
    const direction = upload.expanded ? 'oi-caret-bottom' : 'oi-caret-right';
    const visible = upload.history ? '' : 'hiddenCaret';
    return (
      <span role="button" tabIndex={0} onClick={() => { expandRow(upload); }} onKeyPress={() => { expandRow(upload); }} className={`oi ${direction} ${visible}`} />
    );
  }
  function UploadRow({ upload }) {
    let uploadHistory;
    if (upload.history) {
      uploadHistory = (
        <div className="col-12 history">
          {
            upload.history
              .map(hist => <UploadHistoryRow historyItem={hist} key={Math.random()} />)
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
        <div className="col-2">{upload.date}</div>
        {upload.expanded && uploadHistory}
      </div>
    );
  }
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
  previousUploads: PropTypes.arrayOf(PropTypes.shape({
    biospecimenID: PropTypes.string.isRequired,
  })).isRequired,
  expandRow: PropTypes.func.isRequired,
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
