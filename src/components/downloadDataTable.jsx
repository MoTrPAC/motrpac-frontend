import React from 'react';

export function DownloadDataTable({ allUploads }) {
  function DownloadRow({ upload }) {
    return (
      <tr className="downloadRow">
        <td>{upload.identifier}</td>
      </tr>
    );
  }
  const uploadList = allUploads
    .map(upload => <DownloadRow key={upload.identifier} upload={upload} />);

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Identifier</th>
        </tr>
      </thead>
      <tbody>
        {uploadList}
      </tbody>
    </table>
  );
}

export default DownloadDataTable;
