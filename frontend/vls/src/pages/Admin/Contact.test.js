import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Contact from './Contact';
import axios from 'axios';
import Cookies from 'js-cookie';
import { BrowserRouter } from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);
describe('Contact Component', () => {
  beforeEach(() => {
    // Mock cookies
    

    mock.onPost('http://localhost:6500/check-permission').reply(200, {
      data: { premission: 'admin' }
    });
    mock.onGet('http://localhost:6500/allusers').reply(200, {
      users: [{ id: 1 }, { id: 2 }]
    });
    mock.onGet('http://localhost:6500/test@example.com').reply(200, {
      data: { full_name: 'jon' }
    });

    Cookies.set('email', 'test@example.com');
  });


  afterEach(() => {
    mock.reset();
    Cookies.remove('email');
  });

  test('renders Contact component', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Contact />
        </BrowserRouter>
      );
    });

    expect(screen.getByTestId('contact')).toBeInTheDocument();
    expect(screen.getByText('Send Email')).toBeInTheDocument();
  });

  test('redirects to login if no admin permission', async () => {
    // Mock check-permission to return non-admin
    mock.onPost('http://localhost:6500/check-permission').reply(200, {
      data: { premission: 'user' }
    });

    // Render component
    await act(async () => {
      render(
        <BrowserRouter>
          <Contact />
        </BrowserRouter>
      );
    });

    // Check redirection (for example, you might need to mock useNavigate)
    await waitFor(() => {
      expect(window.location.pathname).toBe('/');
    });
  });



  test('shows an error when form is invalid', async () => {

    await act(async () => {
      render(
        <BrowserRouter>
          <Contact />
        </BrowserRouter>
      );
    });

    fireEvent.change(screen.getByLabelText(/Your Phone/i), { target: { value: '1' } });

    await act(async () => {
      fireEvent.click(screen.getByTestId('button'));
    });

    expect(screen.getByText(/Invalid. enter 10 digit number starting with 05/i)).toBeInTheDocument();
  });
});
