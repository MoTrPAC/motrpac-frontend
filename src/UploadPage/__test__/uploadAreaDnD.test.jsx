import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { shallow } from 'enzyme';
import UploadAreaDnD from '../uploadAreaDnD';
import { defaultUploadState } from '../uploadReducer';

Enzyme.configure({ adapter: new Adapter() });
const draggingState = {
  ...defaultUploadState,
  dragging: 1,
};
const shallowUploadArea = shallow(<UploadAreaDnD {...defaultUploadState} />);
const shallowDraggingUploadArea = shallow(<UploadAreaDnD {...draggingState} />);

describe('Upload Area DnD', () => {
  test('No dragging class in default state', () => {
    expect(shallowUploadArea.hasClass('dragging')).toBe(false);
  });
  test('Dragging class in dragging state', () => {
    expect(shallowDraggingUploadArea.hasClass('dragging')).toBe(true);
  });
});
