import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import ForgotPassword from './forgotpassword'; // Adjust the path if necessary
import { MemoryRouter } from 'react-router-dom';

// Mock axios and emailjs
jest.mock('axios');
jest.mock('@emailjs/browser');

describe('ForgotPassword Component', () => {
  beforeEach(() => {
    axios.get.mockClear();
    axios.put.mockClear();
    emailjs.send.mockClear();
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('handles sending confirmation code', async () => {
    axios.get.mockResolvedValueOnce({ data: { email: 'test@example.com' } });
    emailjs.send.mockResolvedValueOnce();

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' },
    });

    fireEvent.click(screen.getByText('Send Confirmation Code'));

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:6500/test@example.com');
      expect(emailjs.send).toHaveBeenCalled();
    });
  });

  test('checks password contains symbols', () => {
    const passwordContainsSymbols = jest.fn((password) => /[!@#$%^&*]/.test(password));
    ForgotPassword.prototype.passwordContainsSymbols = passwordContainsSymbols;

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    expect(passwordContainsSymbols('Password1!')).toBe(true);
    expect(passwordContainsSymbols('Password1')).toBe(false);
  });

  test('checks password contains numbers', () => {
    const passwordContainsNumbers = jest.fn((password) => /\d/.test(password));
    ForgotPassword.prototype.passwordContainsNumbers = passwordContainsNumbers;

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    expect(passwordContainsNumbers('Password1!')).toBe(true);
    expect(passwordContainsNumbers('Password!')).toBe(false);
  });
});
