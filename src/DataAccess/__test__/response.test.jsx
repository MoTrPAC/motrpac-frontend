import React from 'react';
import { shallow } from 'enzyme';
import RegistrationResponse from '../response';

const successResponse = shallow((
  <RegistrationResponse status="success" />
));

const errorResponse = shallow((
  <RegistrationResponse status="error" />
));

describe('New user registration response', () => {
  test('Renders completion message if succeeded', () => {
    expect(successResponse.find('.page-title').text()).toMatch('Registration Completed');
  });

  test('Renders incompletion message if failed', () => {
    expect(errorResponse.find('.page-title').text()).toMatch('Registration Incomplete');
  });
});
