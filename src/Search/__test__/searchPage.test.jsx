import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { shallow, mount } from 'enzyme';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleWare from 'redux-thunk';
import { defaultSearchState } from '../searchReducer';
import rootReducer, { defaultRootState } from '../../App/reducers';
import SearchPageConnected, { SearchPage } from '../searchPage';

Enzyme.configure({ adapter: new Adapter() });

const params = [
  { term: 'biospecimenid', value: '901', operator: '' },
  { term: 'tissue', value: 'liver', operator: 'AND' },
  { term: 'site', value: 'stanford', operator: 'AND' },
];

const searchFormState = {
  auth: {
    ...defaultRootState.auth,
    isAuthenticated: true,
  },
  search: {
    ...defaultSearchState,
    advSearchParams: [...params],
  },
};

const screenActions = {
  handleSearchFormChange: jest.fn(),
  addSearchParam: jest.fn(),
  removeSearchParam: jest.fn(),
  handleSearchFormSubmit: jest.fn(),
  resetSearchForm: jest.fn(),
  getSearchForm: jest.fn(),
};

describe('Default Advanced Search Page', () => {
  test('Renders required componenents', () => {
    const shallowScreen = shallow(
      <SearchPage {...defaultSearchState} isAuthenticated {...screenActions} />,
    );
    expect(shallowScreen.find('SearchForm')).toHaveLength(1);
    expect(shallowScreen.find('SearchResults')).toHaveLength(1);
  });
});

const loggedInRootState = {
  ...defaultRootState,
  auth: {
    ...defaultRootState.auth,
    isAuthenticated: true,
  },
};

describe('Connected Advanced Search Page', () => {
  let mountedUploadScreen = mount((
    <Provider store={createStore(rootReducer, loggedInRootState, applyMiddleware(thunkMiddleWare))}>
      <SearchPageConnected />
    </Provider>
  ));
  beforeAll(() => {
    mountedUploadScreen = mount((
      <Provider store={createStore(rootReducer, loggedInRootState, applyMiddleware(thunkMiddleWare))}>
        <SearchPageConnected />
      </Provider>
    ));
  });
  afterAll(() => {
    mountedUploadScreen.unmount();
  });

  test('Renders Required Components in correct state', () => {
    expect(mountedUploadScreen.find('SearchForm')).toHaveLength(1);
    expect(mountedUploadScreen.find('SearchResults')).toHaveLength(1);
    expect(mountedUploadScreen.find('SearchForm').find('.adv-search-submit')).toHaveLength(1);
    expect(mountedUploadScreen.find('SearchForm').find('.adv-search-reset')).toHaveLength(1);
    expect(mountedUploadScreen.find('SearchForm').find('SearchTermList')).toHaveLength(1);
    expect(mountedUploadScreen.find('SearchForm').find('SearchTermList').find('SearchTermRow')).toHaveLength(1);
  });

  test('Clear Form, makes form empty and available to enter again', () => {
    mountedUploadScreen = mount((
      <Provider store={createStore(rootReducer, searchFormState, applyMiddleware(thunkMiddleWare))}>
        <SearchPageConnected />
      </Provider>
    ));

    mountedUploadScreen.find('SearchForm').find('.adv-search-reset').simulate('click');
    mountedUploadScreen.update();
    /*
    expect(mountedUploadScreen.find('SearchForm').find('select').forEach((formComponent) => {
      expect(formComponent.prop('disabled')).toBeFalsy();
      expect(formComponent.prop('value')).toEqual(defaultUploadState.formValues[formComponent.prop('id')]);
    }));
    expect(mountedUploadScreen.find('SearchForm').find('input').forEach((formComponent) => {
      if (formComponent.prop('type') !== 'submit') {
        expect(formComponent.prop('disabled')).toBeFalsy();
        if (formComponent.prop('type') === 'text') {
          expect(formComponent.prop('value')).toEqual(defaultUploadState.formValues[formComponent.prop('id')]);
        }
        if (formComponent.prop('type') === 'checkbox') {
          expect(formComponent.prop('checked')).toEqual(defaultUploadState.formValues[formComponent.prop('id')]);
        }
      }
    }));
    */
  });
});
