import React from 'react';
import { storiesOf } from '@storybook/react';
import AnimalPhenotypeData from '../animalPhenotypeData';

storiesOf('Animal Data Analysis', module)
  .addDecorator(story => (
    <div className="container-fluid">{story()}</div>
  ))
  .add('Phenotype Data Plots', () => <AnimalPhenotypeData />);
