import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

const crypto = require('crypto');

configure({ adapter: new Adapter() });

require('jest-canvas-mock');

jest.mock('react-chartjs-2', () => ({
  Bar: () => null,
  Pie: () => null,
  Doughnut: () => null,
}));

// fix for 'crypto.getRandomValues() not supported' error
Object.defineProperty(globalThis, 'crypto', {
  value: {
    getRandomValues: (arr) => crypto.randomBytes(arr.length),
  },
});

// fix for 'unstable_flushDiscreteUpdates: Cannot flush updates when React is already rendering' error
// when <video> is used in a component
// (https://github.com/testing-library/react-testing-library/issues/470#issuecomment-761821103)
Object.defineProperty(HTMLMediaElement.prototype, 'muted', {
  set: () => {},
});
