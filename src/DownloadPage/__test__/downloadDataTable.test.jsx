
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { shallow } from 'enzyme';
import DownloadDataTable from '../../components/downloadDataTable';
import { defaultDownloadState } from '../../reducers/downloadReducer';

Enzyme.configure({ adapter: new Adapter() });

const testAllUploads = require('../../testData/testAllUploads');

const downloadActions = {
  onCartClick: jest.fn(),
  onChangeSort: jest.fn(),
};


describe('Download Data Table', () => {
  test('Renders correct amount of rows', () => {
    const shallowTable = shallow(
      <DownloadDataTable siteName="Stanford CAS" {...defaultDownloadState} filteredUploads={testAllUploads} {...downloadActions} />,
    );
    expect(shallowTable.find('DownloadRow')).toHaveLength(testAllUploads.length);
  });
  test('No uploads message loads if nothing uploaded', () => {
    const shallowTable = shallow(
      <DownloadDataTable siteName="Stanford CAS" {...defaultDownloadState} filteredUploads={[]} {...downloadActions} />,
    );
    expect(shallowTable.find('DownloadRow')).toHaveLength(0);
    expect(shallowTable.find('.noData')).toHaveLength(1);
  });
});
