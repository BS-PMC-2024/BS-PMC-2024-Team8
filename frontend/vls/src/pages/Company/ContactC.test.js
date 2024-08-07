import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ContactC from './ContactC';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import Cookies from 'js-cookie';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('axios');
jest.mock('js-cookie', () => ({
  get: jest.fn(),
}));
jest.mock('@emailjs/browser', () => ({
  init: jest.fn(),
  send: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  window.alert = jest.fn(); // Mock window.alert

  // Mock the axios responses
  axios.get.mockResolvedValueOnce({ data: { data: { company: 'vls' } } });
  axios.get.mockResolvedValueOnce({ data: { admin: [{ full_name: 'Test User', email: 'test@example.com' }] } });
  axios.post.mockResolvedValueOnce({ data: { data: { premission: 'company' } } });

  // Mock the Cookies.get to return a specific email
  Cookies.get.mockReturnValue('test@example.com');

  // Mock emailjs methods
  emailjs.init.mockReturnValueOnce();
  emailjs.send.mockResolvedValueOnce({});
});

test('renders the Contact component', async () => {
  render(
    <Router>
      <ContactC />
    </Router>
  );

  // Check that the component renders
  await waitFor(() => expect(screen.getByTestId('ContactC')).toBeInTheDocument());

  // Check form fields
  expect(screen.getByLabelText(/Your Name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Your Phone/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Admin name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Description message/i)).toBeInTheDocument();
  expect(screen.getByTestId('button')).toBeInTheDocument();
});

test('submits form and sends email', async () => {
  render(
    <Router>
      <ContactC />
    </Router>
  );

  // Fill out the form
  fireEvent.change(screen.getByLabelText(/Your Name/i), { target: { value: 'Test Company' } });
  fireEvent.change(screen.getByLabelText(/Your Phone/i), { target: { value: '0501234567' } });
  fireEvent.change(screen.getByLabelText(/Description message/i), { target: { value: 'Test description' } });

  // Submit the form
  fireEvent.click(screen.getByTestId('button'));

  // Wait for the emailjs.send call
  await waitFor(() => expect(emailjs.send).toHaveBeenCalled());

  // Check for success alert ??
  // Check for success alert
  await waitFor(() => expect(window.alert).toHaveBeenCalledWith("Email successfully sent. Check your inbox."));
});
