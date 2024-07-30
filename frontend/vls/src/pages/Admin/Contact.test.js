// Contact.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Contact from './Contact';
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

  axios.get.mockResolvedValueOnce({ data: { users: [{ company: 'vls', email: 'ahkcht98@gmail.com' }, { company: 'otherCompany', email: 'otherEmail' }] } });
  Cookies.get.mockReturnValue('ahkcht98@gmail.com');
  //axios.post.mockResolvedValueOnce({ data: { permission: 'admin' } });
  axios.post.mockResolvedValueOnce({ data: { data: { premission: 'admin' } } });
  axios.get.mockResolvedValueOnce({ data: { data: { full_name: 'Test User' } } });

  emailjs.init.mockReturnValueOnce();
});

test('renders the Contact component', async () => {
  render(
    <Router>
      <Contact />
    </Router>
  );

  await waitFor(() => expect(screen.getByTestId('contact')).toBeInTheDocument());

  expect(screen.getByLabelText(/Your Name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Your Phone/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Company/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Description message/i)).toBeInTheDocument();
  expect(screen.getByTestId('button')).toBeInTheDocument();
});

