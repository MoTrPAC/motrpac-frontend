import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { mount, shallow } from 'enzyme';
import { defaultUploadState } from '../uploadReducer';
import UploadForm from '../uploadForm';

Enzyme.configure({ adapter: new Adapter() });


const formFilledState = {
  ...defaultUploadState,
  formValues: {
    dataType: 'ATAC-Seq',
    biospecimenID: '1',
    collectionDate: '10/21/18',
    subjectType: 'Animal',
    studyPhase: '1',
    descript: 'description',
    rawData: true,
    processedData: false,
  },
};
const formActions = {
  handleSubmit: jest.fn(),
  handleFormChange: jest.fn(),
};
const mountDefaultForm = mount(<UploadForm {...defaultUploadState} {...formActions} />);
const shallowFilledForm = shallow(<UploadForm {...formFilledState} {...formActions} />);

describe('Upload Form', () => {
  test('Submitting calls handleSubmit', () => {
    mountDefaultForm.find('form').simulate('submit');
    expect(formActions.handleSubmit.mock.calls.length).toBe(1);
  });
  test('Form values correctly populate fields', () => {
    expect(shallowFilledForm.find('#dataType').props().value).toBe(formFilledState.formValues.dataType);
    expect(shallowFilledForm.find('#biospecimenID').props().value).toBe(formFilledState.formValues.biospecimenID);
    expect(shallowFilledForm.find('#collectionDate').props().value).toBe(formFilledState.formValues.collectionDate);
    expect(shallowFilledForm.find('#subjectType').props().value).toBe(formFilledState.formValues.subjectType);
    expect(shallowFilledForm.find('#studyPhase').props().value).toBe(formFilledState.formValues.studyPhase);
    expect(shallowFilledForm.find('#description').props().value).toBe(formFilledState.formValues.descript);
    expect(shallowFilledForm.find('#rawData').props().checked).toBeTruthy();
    expect(shallowFilledForm.find('#processedData').props().checked).toBeFalsy();
  });
});
