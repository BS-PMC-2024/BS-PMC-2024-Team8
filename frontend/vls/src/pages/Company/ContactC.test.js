import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ContactC from './ContactC';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import Cookies from 'js-cookie';
import { BrowserRouter as Router } from 'react-router-dom';
import { toast } from 'react-toastify';

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
  axios.get.mockResolvedValueOnce({ data: { admin: [{ full_name: 'Test User', email: 'ahkcht98@gmail.com' }] } });
  axios.post.mockResolvedValueOnce({ data: { data: { premission: 'company' } } });

  // Mock the Cookies.get to return a specific email
  Cookies.get.mockReturnValue('test@example.com');

  // Mock emailjs methods
  emailjs.init.mockReturnValueOnce();
  emailjs.send.mockResolvedValueOnce({});
  jest.mock('react-toastify', () => ({
    toast: {
      success: jest.fn(),
      error: jest.fn(),
    },
  }));
});
test('shows an error when form is invalid', async () => {

  await act(async () => {
    render(
      <Router>
        <ContactC />
      </Router>
    );
  });

  fireEvent.change(screen.getByLabelText(/Your Phone/i), { target: { value: '1' } });

  await act(async () => {
    fireEvent.click(screen.getByTestId('button'));
  });

  expect(screen.getByText(/Invalid. enter 10 digit number starting with 05/i)).toBeInTheDocument();
});

test('renders the Contact component', async () => {
  await act(async () => {
    render(
      <Router>
        <ContactC />
      </Router>
    );
  });

  // Check that the component renders
  await waitFor(() => expect(screen.getByTestId('ContactC')).toBeInTheDocument());

  // Check form fields
  expect(screen.getByLabelText(/Your Name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Your Phone/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Admin name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Message/i)).toBeInTheDocument();
  expect(screen.getByTestId('button')).toBeInTheDocument();
});

test('submits form and sends email', async () => {
  await act(async () => {
    render(
      <Router>
        <ContactC />
      </Router>
    );
  });

  // Fill out the form
  fireEvent.change(screen.getByLabelText(/Your Name/i), { target: { value: 'Test Company' } });
  fireEvent.change(screen.getByLabelText(/Your Phone/i), { target: { value: '0501234567' } });
  fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'Test description' } });

  // Submit the form
  fireEvent.click(screen.getByTestId('button'));

  // Wait for the emailjs.send call
  await waitFor(() => expect(emailjs.send).toHaveBeenCalled());

  // Check for success alert
  await waitFor(() => expect(toast.success));
});
