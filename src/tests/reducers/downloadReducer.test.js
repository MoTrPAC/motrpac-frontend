import DownloadReducer, { defaultDownloadState } from '../../reducers/downloadReducer';

const testPreviousUploads = require('../../testData/testPreviousUploads');

const shortTestUploads = [
  {
    identifier: 'A',
    subject: 'Human',
    phase: '1B',
    type: 'ATAC-Seq',
    date: '09/05/2018',
    availability: 'Publicly Available',
    site: 'Stanford CAS',
  },
  {
    identifier: 'B',
    subject: 'Human',
    phase: '1A',
    type: 'ATAC-Seq',
    date: '09/05/2018',
    availability: 'Publicly Available',
    site: 'Stanford CAS',
  },
  {
    identifier: 'C',
    subject: 'Human',
    phase: '1C',
    type: 'ATAC-Seq',
    date: '09/05/2018',
    availability: 'Publicly Available',
    site: 'Stanford CAS',
  },
];

describe('Download Reducer Tests', () => {
  test('Return initial state if no action or state', () => {
    expect(DownloadReducer(undefined, {})).toEqual({ ...defaultDownloadState });
  });

  test('Returns state given if no action', () => {
    expect(DownloadReducer({ ...defaultDownloadState, files: ['fileName.fileExt'] }, {})).toEqual({ ...defaultDownloadState, files: ['fileName.fileExt'] });
  });

  const sortChangeAction = {
    type: 'SORT_CHANGE',
    column: 'phase',
  };

  test('Sort Change action changes sortBy', () => {
    expect(DownloadReducer(defaultDownloadState, sortChangeAction).sortBy).toEqual(sortChangeAction.column);
  });

  const updateListAction = {
    type: 'UPDATE_LIST',
    uploads: shortTestUploads,
  };
  const updateListActionLong = {
    type: 'UPDATE_LIST',
    uploads: testPreviousUploads,
  };

  test('Update uploads action changes listed files', () => {
    const shortTestUploadsState = DownloadReducer(defaultDownloadState, updateListAction);

    expect(DownloadReducer(defaultDownloadState, updateListAction).allUploads)
      .toEqual(shortTestUploads);

    expect(DownloadReducer(shortTestUploadsState, updateListActionLong).allUploads)
      .toEqual(testPreviousUploads);
  });

  test('Sort Change Action results in sorted list', () => {
    const shortTestUploadsState = DownloadReducer(defaultDownloadState, updateListAction);
    expect(shortTestUploadsState.allUploads)
      .toEqual(shortTestUploads);
    expect(DownloadReducer(shortTestUploadsState, sortChangeAction).allUploads[0].phase)
      .toEqual('1A');
  });
});
