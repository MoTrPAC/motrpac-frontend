import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { shallow, mount } from 'enzyme';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer, { defaultRootState } from '../../reducers/index';
import { defaultDownloadState } from '../../reducers/downloadReducer';
import DownloadPageConnected, { DownloadPage } from '../../components/downloadPage';

Enzyme.configure({ adapter: new Adapter() });


const loggedInRootState = {
  ...defaultRootState,
  auth: {
    ...defaultRootState.auth,
    loggedIn: true,
  },
};
const downloadActions = {
  onDownload: jest.fn(),
  onChangeSort: jest.fn(),
};

const testPreviousUploads = require('../../testData/testPreviousUploads');

describe('Pure Download Page', () => {
  test('Redirects to home if not logged in', () => {
    const shallowDownload = shallow(
      <DownloadPage
        {...defaultDownloadState}
        {...downloadActions}
        allUploads={testPreviousUploads}
      />,
    );
    expect(shallowDownload.find('Redirect')).toHaveLength(1);
  });
  test('Has required components', () => {
    const shallowDownload = shallow(
      <DownloadPage
        {...defaultDownloadState}
        {...downloadActions}
        allUploads={testPreviousUploads}
        loggedIn
      />,
    );
    expect(shallowDownload.find('DownloadDataTable')).toHaveLength(1);
  });
});

describe('Connected Download Page', () => {
  let mountedDownload = mount((
    <Provider store={createStore(rootReducer, loggedInRootState)}>
      <DownloadPageConnected />
    </Provider>
  ));
  beforeAll(() => {
    mountedDownload = mount((
      <Provider store={createStore(rootReducer, loggedInRootState)}>
        <DownloadPageConnected />
      </Provider>
    ));
  });
  afterAll(() => {
    mountedDownload.unmount();
  });
});
