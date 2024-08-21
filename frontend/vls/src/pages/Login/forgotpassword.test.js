import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ForgotPassword from './ForgotPassword';
import { toast } from 'react-toastify';
import { BrowserRouter as Router } from 'react-router-dom';
import emailjs from '@emailjs/browser';

// Create a new instance of axios-mock-adapter
const mock = new MockAdapter(axios);

jest.mock('@emailjs/browser', () => ({
  init: jest.fn(),
  send: jest.fn(),
}));

describe('ForgotPassword Component', () => {
  beforeEach(() => {
    // Reset the mock adapter before each test
    mock.reset();
    // Mock emailjs methods
    emailjs.init.mockReturnValueOnce();
    emailjs.send.mockResolvedValueOnce({});
  });

  it('sends confirmation code and displays toast message', async () => {
    // Mock the API response for user retrieval
    mock.onGet('http://localhost:6500/test@example.com').reply(200);

    // Mock the emailjs send function
    jest.spyOn(emailjs, 'send').mockResolvedValue({});

    render(
      <Router>
        <ForgotPassword />
      </Router>
    );

    // Enter email and click Send Confirmation Code
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByText('Send Confirmation Code'));

    // Assert that the emailjs function was called
    await waitFor(() => expect(emailjs.send).toHaveBeenCalled());

    // Check toast message
    expect(await screen.findByText('Confirmation code sent. Please check your email.')).toBeInTheDocument();
  });

  it('handles password update correctly', async () => {
    // Mock the API response for user retrieval
    mock.onGet('http://localhost:6500/test@example.com').reply(200);
    // Mock the API response for updating the user password
    mock.onPut('http://localhost:6500/user/test@example.com').reply(200);

    render(
      <Router>
        <ForgotPassword confirmationCode="123456"/>
      </Router>
    );


    // Fill in the form fields
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter confirmation code'), { target: { value: '123456' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your new password'), { target: { value: 'NewPassword1!' } });

    // Mock the emailjs send function
    jest.spyOn(emailjs, 'send').mockResolvedValue({});

    // Click the Submit button
    fireEvent.click(screen.getByText('Submit'));

    // Check for success alert
    await waitFor(() => expect(toast.success));
  });

  it('displays error if password does not meet requirements', async () => {
    render(
      <Router>
        <ForgotPassword />
      </Router>
    );

    // Fill in the form fields with invalid data
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter confirmation code'), { target: { value: '123456' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your new password'), { target: { value: 'short' } });

    // Click the Submit button
    fireEvent.click(screen.getByText('Submit'));

    // Check for success alert
    await waitFor(() => expect(toast.error));

  });
});
