import React from 'react';
import { mount } from 'enzyme';
import { Router } from 'react-router-dom';
import QuickSearchBox from '../quickSearchBox';
import History from '../../App/history';

const quickSearchActions = {
  handleQuickSearchInputChange: jest.fn(),
  handleQuickSearchRequestSubmit: jest.fn(),
  resetQuickSearch: jest.fn(),
  getSearchForm: jest.fn(),
  resetAdvSearch: jest.fn(),
};

const mountQuickSearchBox = mount((
  <Router history={History}>
    <QuickSearchBox {...quickSearchActions} />
  </Router>
));

describe('Quick Search Box', () => {
  test('Renders required componenents without crashing', () => {
    expect(mountQuickSearchBox.find('.quick-search-box-form')).toHaveLength(1);
  });

  test('Changing input value invokes handleQuickSearchInputChange()', () => {
    mountQuickSearchBox.find('.quick-search-box').simulate('change', { target: { value: 'liver' } });
    expect(quickSearchActions.handleQuickSearchInputChange.mock.calls.length).toBe(1);
  });

  test('Submitting form invokes handleQuickSearchRequestSubmit()', () => {
    mountQuickSearchBox.find('.quick-search-box-form').simulate('submit');
    expect(quickSearchActions.handleQuickSearchRequestSubmit.mock.calls.length).toBe(1);
  });

  test('Clicking Advanced link invokes resetQuickSearch() and getSearchForm()', () => {
    mountQuickSearchBox.find('a').simulate('click');
    expect(quickSearchActions.resetQuickSearch.mock.calls.length).toBe(1);
    expect(quickSearchActions.getSearchForm.mock.calls.length).toBe(1);
  });
});
