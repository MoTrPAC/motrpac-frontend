import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

configure({ adapter: new Adapter() });

require('jest-canvas-mock');

jest.mock('react-chartjs-2', () => ({
  Bar: () => null,
  Pie: () => null,
  Doughnut: () => null
}));
