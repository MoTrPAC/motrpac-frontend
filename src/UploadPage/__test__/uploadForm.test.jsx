import React from 'react';
import { mount, shallow } from 'enzyme';
import { defaultUploadState } from '../uploadReducer';
import UploadForm from '../uploadForm';

const formFilledState = {
  ...defaultUploadState,
  formValues: {
    dataType: 'ATAC-Seq',
    biospecimenBarcode: '1000112345',
    collectionDate: '10/21/18',
    subjectType: 'Animal',
    studyPhase: '1',
    description: 'description',
    rawData: true,
    processedData: false,
  },
};
const humanFormState = {
  ...formFilledState,
  formValues: {
    ...formFilledState.formValues,
    subjectType: 'Human',
  },
};

const formActions = {
  handleSubmit: jest.fn(),
  handleFormChange: jest.fn(),
};
const mountDefaultForm = mount(<UploadForm {...defaultUploadState} {...formActions} />);
const shallowFilledForm = shallow(<UploadForm {...formFilledState} {...formActions} />);
const shallowHumanFilledForm = shallow(<UploadForm {...humanFormState} {...formActions} />);

describe('Upload Form', () => {
  test('No invalid feedback shows initialliy', () => {
    expect(mountDefaultForm.find('form').hasClass('needs-validation'))
      .toBeTruthy();
    expect(mountDefaultForm.find('form').hasClass('was-validated'))
      .toBeFalsy();
  });
  test('Submitting calls handleSubmit', () => {
    mountDefaultForm.find('form').simulate('submit');
    expect(formActions.handleSubmit.mock.calls.length).toBe(1);
  });
  test('onBlur triggers form validation', () => {
    // Not entirely sure why, but the tests only work if done on the DOMNode of the input field. When testing the wrapper alone,
    // the className property does not update, but on the DOMNode the classList property does update.
    mountDefaultForm.find('#collectionDate').simulate('blur', { target: mountDefaultForm.find('#collectionDate').getDOMNode() });
    expect(mountDefaultForm.find('#collectionDate').getDOMNode().classList).toContain('is-invalid');
    expect(mountDefaultForm.find('#collectionDate').getDOMNode().classList).not.toContain('is-valid');

    mountDefaultForm.find('#biospecimenBarcode').simulate('blur', { target: mountDefaultForm.find('#biospecimenBarcode').getDOMNode() });
    expect(mountDefaultForm.find('#biospecimenBarcode').getDOMNode().classList).toContain('is-invalid');
    expect(mountDefaultForm.find('#biospecimenBarcode').getDOMNode().classList).not.toContain('is-valid');
  });
  test('Form values correctly populate fields', () => {
    expect(shallowFilledForm.find('#dataType').props().value).toBe(formFilledState.formValues.dataType);
    expect(shallowFilledForm.find('#biospecimenBarcode').props().value).toBe(formFilledState.formValues.biospecimenBarcode);
    expect(shallowFilledForm.find('#collectionDate').props().value).toBe(formFilledState.formValues.collectionDate);
    expect(shallowFilledForm.find('#subjectType').props().value).toBe(formFilledState.formValues.subjectType);
    expect(shallowFilledForm.find('#studyPhase').props().value).toBe(formFilledState.formValues.studyPhase);
    expect(shallowFilledForm.find('#description').props().value).toBe(formFilledState.formValues.description);
    expect(shallowFilledForm.find('#rawData').props().checked).toBeTruthy();
    expect(shallowFilledForm.find('#processedData').props().checked).toBeFalsy();
  });
  test('Collection Date not shown if Human', () => {
    expect(shallowHumanFilledForm.find('#collectionDate')).toHaveLength(0);
  });
});
