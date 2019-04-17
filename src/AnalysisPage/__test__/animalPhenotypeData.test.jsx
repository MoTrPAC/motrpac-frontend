import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { shallow } from 'enzyme';
import AnimalPhenotypeData from '../animalPhenotypeData';

Enzyme.configure({ adapter: new Adapter() });

// Mock e.preventDefaiult and e.stopPropagation as suggested:
// https://stackoverflow.com/questions/41829301/how-to-mock-e-preventdefault-in-react-components-child
const clickEvent = Object.assign(
  jest.fn(), { preventDefault: () => {}, stopPropagation: () => {} },
);

describe('Animal Phenotype Data Plot', () => {
  const shallowAnimalPhenotypeData = shallow(<AnimalPhenotypeData />);

  test('Has one svg element', () => {
    expect(shallowAnimalPhenotypeData.find('svg')).toHaveLength(1);
  });

  test('Has 3 plot buttons', () => {
    expect(shallowAnimalPhenotypeData.find('.btn-group').children()).toHaveLength(3);
  });

  test('Clicking the Scatterplot button updates plot title', () => {
    shallowAnimalPhenotypeData.find('.btn-group').children().last().simulate('click', clickEvent);
    expect(shallowAnimalPhenotypeData.find('.card-title').text()).toMatch('Weight vs. Fat');
  });
});
