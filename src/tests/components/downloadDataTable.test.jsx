
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { shallow } from 'enzyme';
import DownloadDataTable from '../../components/downloadDataTable';
import { defaultDownloadState } from '../../reducers/downloadReducer';

Enzyme.configure({ adapter: new Adapter() });

const testPreviousUploads = require('../../testData/testPreviousUploads');

const downloadActions = {
  onCartClick: jest.fn(),
  onChangeSort: jest.fn(),
};


describe('Download Data Table', () => {
  test('Renders correct amount of rows', () => {
    const shallowTable = shallow(
      <DownloadDataTable {...defaultDownloadState} filteredUploads={testPreviousUploads} {...downloadActions} />,
    );
    expect(shallowTable.find('DownloadRow')).toHaveLength(testPreviousUploads.length);
  });
  test('No uploads message loads if nothing uploaded', () => {
    const shallowTable = shallow(
      <DownloadDataTable {...defaultDownloadState} filteredUploads={[]} {...downloadActions} />,
    );
    expect(shallowTable.find('DownloadRow')).toHaveLength(0);
    expect(shallowTable.find('.noData')).toHaveLength(1);
  });
});
