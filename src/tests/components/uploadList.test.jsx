import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { shallow } from 'enzyme';
import UploadList from '../../components/uploadList';

Enzyme.configure({ adapter: new Adapter() });
const uploadListActions = {
  cancelUpload: jest.fn(),
};
const testUploads = require('../../testData/testUploads');

const threeUploads = testUploads.slice(0, 3);
const shallowEmptyList = shallow(<UploadList uploadFiles={[]} {...uploadListActions} />);
const shallow3RowList = shallow(<UploadList uploadFiles={threeUploads} {...uploadListActions} />);

describe('Upload List', () => {
  test('No upload list table if no uploads', () => {
    expect(shallowEmptyList.hasClass('noListItems')).toBeTruthy();
    expect(shallowEmptyList.find('table').exists()).toBe(false);
  });

  test('3 uploading files creates 3 rows', () => {
    expect(shallow3RowList.find('UploadListRow')).toHaveLength(3);
  });
});
