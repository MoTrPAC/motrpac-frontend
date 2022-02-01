import React from 'react';
import { shallow, mount } from 'enzyme';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import thunkMiddleWare from 'redux-thunk';
import { defaultSearchState } from '../searchReducer';
import rootReducer, { defaultRootState } from '../../App/reducers';
import SearchPageConnected, { SearchPage } from '../searchPage';
import History from '../../App/history';

const params = [
  { term: 'biospecimenid', value: '901', operator: '' },
  { term: 'tissue', value: 'liver', operator: 'AND' },
  { term: 'site', value: 'stanford', operator: 'AND' },
];

const loggedInRootState = {
  ...defaultRootState,
  auth: {
    ...defaultRootState.auth,
    isAuthenticated: true,
  },
};

const searchFormState = {
  ...defaultRootState,
  auth: {
    ...defaultRootState.auth,
    isAuthenticated: true,
  },
  search: {
    ...defaultSearchState,
    advSearchParams: [...params],
  },
};

const searchActions = {
  handleSearchFormChange: jest.fn(),
  addSearchParam: jest.fn(),
  removeSearchParam: jest.fn(),
  handleSearchFormSubmit: jest.fn(),
  handlePredefinedSearch: jest.fn(),
  resetSearchForm: jest.fn(),
  getSearchForm: jest.fn(),
};

describe('Default Advanced Search Page', () => {
  test('Renders required componenents without crashing', () => {
    const shallowSearchPage = shallow(
      <SearchPage {...defaultSearchState} {...searchActions} />,
    );
    expect(shallowSearchPage.find('SearchForm')).toHaveLength(1);
  });
});

// Default logged-in state for comnected search page
const connectedSearchPageDefaultState = (
  <Provider store={createStore(rootReducer, loggedInRootState, applyMiddleware(thunkMiddleWare))}>
    <Router history={History}>
      <SearchPageConnected {...searchActions} />
    </Router>
  </Provider>
);

// Changed state for comnected search page
const connectedSearchPageChangedState = (
  <Provider store={createStore(rootReducer, searchFormState, applyMiddleware(thunkMiddleWare))}>
    <Router history={History}>
      <SearchPageConnected {...searchActions} />
    </Router>
  </Provider>
);

describe('Connected Advanced Search Page', () => {
  let mountedSearchPage = mount(connectedSearchPageDefaultState);

  beforeAll(() => {
    mountedSearchPage = mount(connectedSearchPageDefaultState);
  });
  afterAll(() => {
    mountedSearchPage.unmount();
  });

  test('Renders Required Components in correct state', () => {
    expect(mountedSearchPage.find('SearchForm')).toHaveLength(1);
    expect(mountedSearchPage.find('SearchForm').find('.adv-search-submit')).toHaveLength(1);
    expect(mountedSearchPage.find('SearchForm').find('.adv-search-reset')).toHaveLength(1);
    expect(mountedSearchPage.find('SearchForm').find('SearchTermList')).toHaveLength(1);
    expect(mountedSearchPage.find('SearchForm').find('SearchTermList').find('SearchTermRow')).toHaveLength(1);
  });

  test('Renders a new row of operator/term/value search params upon clicking Add button', () => {
    mountedSearchPage.find('SearchForm').find('.btn-param-add').simulate('click');

    expect(mountedSearchPage.find('SearchForm').find('.param-list').length).toBeGreaterThan(1);
    expect(mountedSearchPage.find('SearchForm').find('.param-value').length).toBeGreaterThan(1);
    expect(mountedSearchPage.find('SearchForm').find('.btn-param-remove').length).toBeGreaterThanOrEqual(1);
  });

  test('Removes a row of operator/term/value search params upon clicking Remove button', () => {
    mountedSearchPage = mount(connectedSearchPageChangedState);

    mountedSearchPage.find('SearchForm').find('.btn-param-remove').at(2).simulate('click');

    expect(mountedSearchPage.find('SearchForm').find('.param-list').length).toBeGreaterThan(0);
    expect(mountedSearchPage.find('SearchForm').find('.param-value').length).toBeGreaterThan(0);
    expect(mountedSearchPage.find('SearchForm').find('.btn-param-remove').length).toBeGreaterThan(0);
  });

  test('Resets advanced search form upon clicking Reset button', () => {
    mountedSearchPage = mount(connectedSearchPageChangedState);

    mountedSearchPage.find('SearchForm').find('.adv-search-reset').simulate('click');

    expect(mountedSearchPage.find('SearchForm').find('select')).toHaveLength(1);
    expect(mountedSearchPage.find('SearchForm').find('select').props().value).toBe('all');
    expect(mountedSearchPage.find('SearchForm').find('input')).toHaveLength(1);
    expect(mountedSearchPage.find('SearchForm').find('input').props().value).toBe('');
  });

  // TODO: Assertion for 'Search' button click event
});
