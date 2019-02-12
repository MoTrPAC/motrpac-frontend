import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { shallow } from 'enzyme';
import { PreviousUploadsTable } from '../previousUploadsTable';

Enzyme.configure({ adapter: new Adapter() });

const testUploads = require('../../testData/testPreviousUploads');

const tableActions = {
  expandRow: jest.fn(),
  onViewMoreHistory: jest.fn(),
};

const expandedUploads = testUploads.map(upload => ({
  ...upload,
  expanded: true,
}));

const shallowUploadTable = shallow(
  <PreviousUploadsTable previousUploads={testUploads} {...tableActions} />,
);
const shallowExpandedUploadTable = shallow(
  <PreviousUploadsTable previousUploads={expandedUploads} {...tableActions} />,
);

describe('Previous Uploads Table – Dashboard Widget', () => {
  test('Has row for each upload', () => {
    expect(shallowUploadTable.find('UploadRow')).toHaveLength(testUploads.length);
  });
  test('Each row has appropriate history rows if expanded', () => {
    shallowExpandedUploadTable.find('UploadRow').forEach((row, i) => {
      if (expandedUploads[i].history) {
        expect(row.dive().find('UploadHistoryRow')).toHaveLength(expandedUploads[i].history.length);
      } else {
        expect(row.dive().find('UploadHistoryRow')).toHaveLength(0);
      }
    });
  });
});
