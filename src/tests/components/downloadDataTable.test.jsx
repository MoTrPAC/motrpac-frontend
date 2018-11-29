
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { shallow } from 'enzyme';
import { DownloadDataTable } from '../../components/downloadDataTable';

Enzyme.configure({ adapter: new Adapter() });

const testPreviousUploads = require('../../testData/testPreviousUploads');

describe('Download Data Table', () => {
  test('Renders correct amount of rows', () => {
    const shallowTable = shallow(<DownloadDataTable allUploads={testPreviousUploads} />);
    expect(shallowTable.find('DownloadRow')).toHaveLength(testPreviousUploads.length);
  });
});
