import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { shallow, mount } from 'enzyme';
import UploadList from '../uploadList';

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

  test('Clicking cancel, calls cancelUpload once with id of file', () => {
    const cancelUploadCallback = jest.fn(id => id);
    const mount3RowList = mount(<UploadList uploadFiles={threeUploads} cancelUpload={cancelUploadCallback} />);
    mount3RowList.find('.cancelUploadConfirm').at(0).simulate('click');
    expect(cancelUploadCallback.mock.calls.length).toBe(1);
    expect(cancelUploadCallback.mock.results[0].value).toBe(testUploads[0].id);
    mount3RowList.find('.cancelUploadConfirm').at(1).simulate('click');
    expect(cancelUploadCallback.mock.calls.length).toBe(2);
    expect(cancelUploadCallback.mock.results[1].value).toBe(testUploads[1].id);
    mount3RowList.find('.cancelUploadConfirm').at(2).simulate('click');
    expect(cancelUploadCallback.mock.calls.length).toBe(3);
    expect(cancelUploadCallback.mock.results[2].value).toBe(testUploads[2].id);
  });
});
