import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { shallow } from 'enzyme';
import DownloadRow from '../../components/downloadRow';

Enzyme.configure({ adapter: new Adapter() });

const testAllUploads = require('../../testData/testAllUploads');

const downloadActions = {
  onCartClick: jest.fn(),
};
const defaultRowState = {
  upload: testAllUploads[0],
  inCart: false,
  siteName: 'Stanford CAS',
};

const pendingUpload = {
  ...defaultRowState.upload,
  availability: 'Pending Q.C.',
  site: 'Stanford CAS',
};
const pendingUnavailableUpload = {
  ...defaultRowState.upload,
  availability: 'Pending Q.C.',
  site: 'Not Stanford CAS',
};
const internalUpload = {
  ...defaultRowState.upload,
  availability: 'Internally Available',
  site: 'Stanford CAS',
};
const publicUpload = {
  ...defaultRowState.upload,
  availability: 'Publicly Available',
  site: 'Stanford CAS',
};

describe('Download Row', () => {
  test('Renders required components', () => {
    const shallowRow = shallow(
      <DownloadRow {...defaultRowState} {...downloadActions} />,
    );
    expect(shallowRow.find('DownloadBtn')).toHaveLength(1);
  });
});
