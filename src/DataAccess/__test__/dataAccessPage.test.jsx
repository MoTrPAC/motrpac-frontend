import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { renderWithProviders } from '../../testUtils/test-utils';
import DataAccessPageConnected from '../dataAccessPage';

describe('Data access page with embargo agreement and registration form', () => {
  const initialState = {
    auth: {
      isAuthenticated: false,
      profile: {},
    },
  };

  beforeEach(() => {
    renderWithProviders(<DataAccessPageConnected />, {
      preloadedState: initialState,
    });
  });

  test('renders 6 embargo agreement checkboxes and 1 account signup checkbox', () => {
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(7);
  });

  test('renders eSignature input field', () => {
    const eSignatureInput = screen.getByLabelText(/E-Signature/i);
    expect(eSignatureInput).toBeInTheDocument();
  });

  test('renders registration form input fields', () => {
    const requiredInputs = [
      screen.getByLabelText(/First Name/i),
      screen.getByLabelText(/Last Name/i),
      screen.getByLabelText(/Email Address/i),
      screen.getByLabelText(/Institution/i),
      screen.getByLabelText(/Name of PI/i),
    ];

    requiredInputs.forEach((input) => {
      expect(input).toBeInTheDocument();
    });
  });

  test('renders data use intent textarea', () => {
    const textarea = screen.getByLabelText(/Intent of data use/i);
    expect(textarea).toBeInTheDocument();
  });

  test('renders PI checkbox', () => {
    const piCheckbox = screen.getByRole('checkbox', {
      name: /I am a principal investigator/i,
    });
    expect(piCheckbox).toBeInTheDocument();
  });

  test('renders ReCAPTCHA component', () => {
    const recaptcha = screen.getByTestId('recaptcha');
    expect(recaptcha).toBeInTheDocument();
  });

  test('disables PI Name input when principal investigator checkbox is checked', async () => {
    const user = userEvent.setup();
    const piCheckbox = screen.getByRole('checkbox', {
      name: /I am a principal investigator/i,
    });
    const piNameInput = screen.getByLabelText(/Name of PI/i);

    expect(piNameInput).not.toBeDisabled();

    await user.click(piCheckbox);

    expect(piNameInput).toBeDisabled();
  });
});
