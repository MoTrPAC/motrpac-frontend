import DownloadReducer, { defaultDownloadState } from '../../reducers/downloadReducer';

const testPreviousUploads = require('../../testData/testPreviousUploads');

const shortTestUploads = [
  {
    identifier: 'A',
    subject: 'Human',
    phase: '1B',
    type: 'ATAC-Seq',
    date: '09/05/2018',
    availability: 'Publicly Available',
    site: 'Stanford CAS',
  },
  {
    identifier: 'B',
    subject: 'Human',
    phase: '1A',
    type: 'ATAC-Seq',
    date: '09/05/2018',
    availability: 'Publicly Available',
    site: 'Stanford CAS',
  },
  {
    identifier: 'C',
    subject: 'Human',
    phase: '1C',
    type: 'ATAC-Seq',
    date: '09/05/2018',
    availability: 'Publicly Available',
    site: 'Stanford CAS',
  },
];
const defaultWithUploadsState = {
  ...defaultDownloadState,
  allUploads: testPreviousUploads,
};

describe('Download Reducer Tests', () => {
  test('Return initial state if no action or state', () => {
    expect(DownloadReducer(undefined, {}))
      .toEqual({ ...defaultDownloadState });
  });

  test('Returns state given if no action', () => {
    expect(DownloadReducer({ ...defaultDownloadState, files: ['fileName.fileExt'] }, {}))
      .toEqual({ ...defaultDownloadState, files: ['fileName.fileExt'] });
  });

  const updateListAction = {
    type: 'UPDATE_LIST',
    uploads: shortTestUploads,
  };
  const updateListActionLong = {
    type: 'UPDATE_LIST',
    uploads: testPreviousUploads,
  };

  test('Update uploads action changes listed files', () => {
    const shortTestUploadsState = DownloadReducer(defaultDownloadState, updateListAction);

    expect(DownloadReducer(defaultDownloadState, updateListAction).allUploads)
      .toEqual(shortTestUploads);

    expect(DownloadReducer(shortTestUploadsState, updateListActionLong).allUploads)
      .toEqual(testPreviousUploads);
  });
  const addToCartAction = {
    type: 'ADD_TO_CART',
    cartItem: testPreviousUploads[1],
  };

  test('Adding to cart updates inCart status of item', () => {
    expect(DownloadReducer(defaultWithUploadsState, addToCartAction).cartItems[0])
      .toBe(addToCartAction.cartItem);
  });
  test('Adding already added item, removes item from cart ', () => {
    const addedState = DownloadReducer(defaultWithUploadsState, addToCartAction);
    const secondAddToCart = {
      type: 'ADD_TO_CART',
      cartItem: addedState.allUploads[1],
    };
    expect(DownloadReducer(addedState, secondAddToCart).cartItems[0])
      .toBeFalsy();
  });
  test('Adding to cart does not create new entries', () => {
    expect(DownloadReducer(defaultWithUploadsState, addToCartAction).allUploads)
      .toHaveLength(testPreviousUploads.length);
  });
  const addFilterAction = {
    type: 'CHANGE_FILTER',
    filter: 'RNA-Seq',
    category: 'type',
  };
  test('Adding filter updates activeFilter list', () => {
    expect(DownloadReducer(defaultWithUploadsState, addFilterAction).activeFilters[addFilterAction.category])
      .toHaveLength(1);
    expect(DownloadReducer(defaultWithUploadsState, addFilterAction).activeFilters[addFilterAction.category])
      .toEqual([addFilterAction.filter]);
  });
  test('Changing previously added filter, clears filter', () => {
    const filterAddedState = DownloadReducer(defaultWithUploadsState, addFilterAction);
    expect(DownloadReducer(filterAddedState, addFilterAction).activeFilters[addFilterAction.category])
      .toHaveLength(0);
  });
});
