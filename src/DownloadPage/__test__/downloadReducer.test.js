import DownloadReducer, { defaultDownloadState } from '../downloadReducer';
import actions from '../downloadActions';

const testAllUploads = require('../../testData/testAllUploads');

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
  allUploads: testAllUploads,
  filteredUploads: testAllUploads,
  siteName: 'Stanford CAS',
};
const viewCartWithCartItemsState = {
  ...defaultDownloadState,
  allUploads: testAllUploads,
  viewCart: true,
  cartItems: [testAllUploads[0]],
};
const unavailableDownload = {
  ...testAllUploads[0],
  availability: 'Pending Q.C.',
  site: 'Not Stanford CAS',
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

  const updateListAction = actions.recieveUpdateList(3, shortTestUploads);
  const updateListActionLong = actions.recieveUpdateList(11, testAllUploads);

  test('Update uploads action changes listed files', () => {
    const shortTestUploadsState = DownloadReducer(defaultDownloadState, updateListAction);

    expect(DownloadReducer(defaultDownloadState, updateListAction).allUploads)
      .toEqual(shortTestUploads);

    expect(DownloadReducer(shortTestUploadsState, updateListActionLong).allUploads)
      .toEqual(testAllUploads);
  });
  const addToCartAction = actions.addToCart(testAllUploads[1]);

  test('Adding to cart updates cartItems', () => {
    expect(DownloadReducer(defaultWithUploadsState, addToCartAction).cartItems[0])
      .toBe(addToCartAction.cartItem);
  });

  test('Adding already added item, removes item from cart ', () => {
    const addedState = DownloadReducer(defaultWithUploadsState, addToCartAction);
    const secondAddToCart = actions.addToCart(addedState.cartItems[0])
    expect(DownloadReducer(addedState, secondAddToCart).cartItems[0])
      .toBeFalsy();
  });

  test('Adding to cart does not create new entries', () => {
    expect(DownloadReducer(defaultWithUploadsState, addToCartAction).allUploads)
      .toHaveLength(testAllUploads.length);
  });

  const addFilterAction = actions.changeFilter('type', 'RNA-Seq');
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

  test('View cart dispatch toggles viewCart', () => {
    expect(DownloadReducer(defaultDownloadState, actions.viewCart()).viewCart)
      .toBeTruthy();
    expect(DownloadReducer(viewCartWithCartItemsState, actions.viewCart()).viewCart)
      .toBeFalsy();
  });

  test('Adding to cart adds to inCart', () => {
    expect(DownloadReducer(defaultDownloadState, actions.addToCart(testAllUploads[0])).cartItems[0])
      .toBe(testAllUploads[0]);
    expect(DownloadReducer(viewCartWithCartItemsState, actions.addToCart(testAllUploads[0])).cartItems[0])
      .not.toBe(testAllUploads[0]);
  });

  test('Adding to cart pending Q.C and site not user site, does not add to cart', () => {
    expect(DownloadReducer(defaultDownloadState, actions.addToCart(unavailableDownload)).cartItems[0])
      .not.toBe(unavailableDownload);
    expect(DownloadReducer(defaultDownloadState, actions.addToCart(unavailableDownload)).cartItems)
      .toHaveLength(0);
  });

  test('Adding all to cart, does not allow items that are both pending Q.C and not from user site', () => {
    DownloadReducer(defaultWithUploadsState, actions.addAllToCart()).cartItems.forEach((item) => {
      expect((item.availability !== 'Pending Q.C.') || (item.site === defaultWithUploadsState.siteName))
        .toBeTruthy();
    });
  });
});
