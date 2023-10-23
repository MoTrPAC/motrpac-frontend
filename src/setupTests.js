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

Object.defineProperty(globalThis, 'crypto', {
  value: {
    getRandomValues: (arr) => crypto.randomBytes(arr.length),
  },
});
