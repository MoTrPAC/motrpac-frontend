import React from 'react';

// Element for handling file staging before uploading using drag and drop or file select
function UploadAreaDnD({
  dragging, files, fileAdded, dragEnter, dragLeave, dragDrop, removeFile,
}) {
  const uploadArea = (
    <div className={`uploadAreaDnD ${dragging ? 'dragging' : ''}`} onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }} onDragEnter={dragEnter} onDragLeave={dragLeave} onDrop={(e) => { e.preventDefault(); e.stopPropagation(); dragDrop(e); }}>
      <div className="row fileArea">
        <FileArea files={files} removeFile={removeFile} />
      </div>
      <div className="selectArea">
        <label htmlFor="fileUpload" id="fileUploadLabel" className="btn btn-primary">
          Select Files
          <input type="file" name="fileUpload" id="fileUpload" onChange={fileAdded} multiple />
        </label>
      </div>
    </div>
  );
  return uploadArea;
}

// Div populated with staged files, instructions displayed if no files
function FileArea({ files = [], removeFile }) {
  if (!files.length) {
    return (
      <div className="centered noFiles">
        <span className="oi oi-cloud-upload" />
        <h3>
          Drag and drop files here
          <br />
          Or
        </h3>
      </div>
    );
  }
  return files.map(file => (
    <div key={file.name} id={file.name} className="col-3 fileCont">
      <div className="file">
        <button className="btn xBtn btn-light" type="button" onClick={() => removeFile(file.name)}>x</button>
        <p>{file.name}</p>
      </div>
    </div>
  ));
}

export default UploadAreaDnD;
