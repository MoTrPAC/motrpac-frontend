import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { applyMiddleware, createStore } from 'redux';
import thunkMiddleWare from 'redux-thunk';
import rootReducer, { defaultRootState } from '../../App/reducers';
import DataAccessPageConnected from '../dataAccessPage';

const defaultState = {
  ...defaultRootState,
  auth: {
    ...defaultRootState.auth,
    isAuthenticated: false,
    profile: {},
  },
};

// Default state for comnected data access page
const defaultDataAccessPage = (
  <Provider
    store={createStore(
      rootReducer,
      defaultState,
      applyMiddleware(thunkMiddleWare),
    )}
    q
  >
    <MemoryRouter>
      <Routes>
        <Route path={'/'} element={<DataAccessPageConnected />} />
      </Routes>
    </MemoryRouter>
    ,
  </Provider>
);

describe('Data access page with embargo agreement and registration form', () => {
  let wrapper = mount(defaultDataAccessPage);

  beforeAll(() => {
    wrapper = mount(defaultDataAccessPage);
  });
  afterAll(() => {
    wrapper.unmount();
  });

  test('Renders 6 checkboxes of the embargo agreement form', () => {
    expect(
      wrapper.find('.data-use-agreement-container .form-check-input'),
    ).toHaveLength(6);
  });

  test('Renders 1 eSignature input field of the embargo agreement form', () => {
    expect(wrapper.find('.e-signature-input')).toHaveLength(1);
  });

  test('Renders 6 input fields of the user registration form', () => {
    expect(
      wrapper.find('.registration-form-container .form-control'),
    ).toHaveLength(6);
  });

  test('Renders 1 <textarea> of the user registration form', () => {
    expect(wrapper.find('.registration-form-container textarea')).toHaveLength(
      1,
    );
  });

  test('Renders 1 checkbox of the user registration form', () => {
    expect(
      wrapper.find('.registration-form-container .form-check-input'),
    ).toHaveLength(1);
  });

  test('Renders 1 <ReCAPTCHA> component', () => {
    expect(wrapper.find('ReCAPTCHA')).toHaveLength(1);
  });

  test('Selecting the I am a principal investigator checkbox disables #PIName input field', () => {
    wrapper.find('#isPrincipalInvestigator').simulate('change');
    expect(wrapper.find('#PIName[disabled]')).toBeTruthy();
  });
});
