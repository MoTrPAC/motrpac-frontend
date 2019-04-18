import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { shallow } from 'enzyme';
import RecentUploadList from '../recentUploadList';

Enzyme.configure({ adapter: new Adapter() });

const testPreviousUploads = require('../../testData/testPreviousUploads');

const shallowEmptyList = shallow(<RecentUploadList />);
const shallowFilledList = shallow(<RecentUploadList previousUploads={testPreviousUploads} />);

describe('Recent Upload Activity', () => {
  test('No upload list table if no upload activity found', () => {
    expect(shallowEmptyList.find('.noUploadActivity')).toHaveLength(1);
    expect(shallowEmptyList.find('table').exists()).toBe(false);
  });

  test('RenderUploadActivity component is called when upload activity found', () => {
    expect(shallowFilledList.find('RenderUploadActivity')).toHaveLength(1);
  });
});
