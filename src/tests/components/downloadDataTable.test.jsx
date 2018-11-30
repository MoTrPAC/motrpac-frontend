
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { shallow } from 'enzyme';
import DownloadDataTable from '../../components/downloadDataTable';

Enzyme.configure({ adapter: new Adapter() });

const testPreviousUploads = require('../../testData/testPreviousUploads');

const downloadActions = {
  onDownload: jest.fn(),
  onChangeSort: jest.fn(),
};

describe('Download Data Table', () => {
  test('Renders correct amount of rows', () => {
    const shallowTable = shallow(
      <DownloadDataTable allUploads={testPreviousUploads} {...downloadActions} />,
    );
    expect(shallowTable.find('DownloadRow')).toHaveLength(testPreviousUploads.length);
  });
  test('Clicking table header item calls onChangeSort', () => {
    const shallowTable = shallow(
      <DownloadDataTable allUploads={testPreviousUploads} {...downloadActions} />,
    );
    expect(downloadActions.onChangeSort.mock.calls.length).toBe(0);
    shallowTable.find('.sortBtn').first().simulate('click');
    expect(downloadActions.onChangeSort.mock.calls.length).toBe(1);
  });

  test('No uploads message loads if nothing uploaded', () => {
    const shallowTable = shallow(
      <DownloadDataTable allUploads={[]} {...downloadActions} />,
    );
    expect(shallowTable.find('DownloadRow')).toHaveLength(0);
    expect(shallowTable.find('.noData')).toHaveLength(1);
  });
});
