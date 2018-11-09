import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { shallow } from 'enzyme';
import { defaultUploadState } from '../../reducers/uploadReducer';
import { UploadScreen } from '../../components/uploadScreen';

Enzyme.configure({ adapter: new Adapter() });
const screenActions = {
  onDragEnter: jest.fn(),
  onDragLeave: jest.fn(),
  onDragDrop: jest.fn(),
  onFileAdded: jest.fn(),
  onRemoveFile: jest.fn(),
  onFormSubmit: jest.fn(),
};

describe('Pure Upload Screen', () => {
  test('Renders required componenents', () => {
    const shallowScreen = shallow(<UploadScreen {...defaultUploadState} {...screenActions} />);
    expect(shallowScreen.find('UploadAreaDnD')).toHaveLength(1);
    expect(shallowScreen.find('UploadList')).toHaveLength(1);
    expect(shallowScreen.find('UploadForm')).toHaveLength(1);
  });
});
