import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Clients from "./Clients";
import axios from 'axios';
import Cookies from 'js-cookie';
import { BrowserRouter as Router } from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';
import { toast } from 'react-toastify';


const mock = new MockAdapter(axios);

describe('Clients Component', () => {
  beforeEach(() => {
    // Set up initial mocks and cookies
    Cookies.set('email', 'test@example.com');

    mock.onPost('http://localhost:6500/check-permission').reply(200, {
      data: { premission: 'admin' }
    });
    mock.onGet('http://localhost:6500/clients').reply(200, {
      clients: [
        { _id: '1', Name: 'John Doe', Mail: 'john@example.com', Debt: 100, Age: 30, City: 'New York', Date: '2024-01-01', Phone: '0500000000', Messages: 'None', Discount: 10, company: 'CompanyA' },
        { _id: '2', Name: 'Jane Doe', Mail: 'jane@example.com', Debt: 200, Age: 25, City: 'Los Angeles', Date: '2024-01-02', Phone: '0500000001', Messages: 'None', Discount: 5, company: 'CompanyB' }
      ]
    });
    mock.onDelete('http://localhost:6500/person/1').reply(200);
  });

  afterEach(() => {
    mock.reset();
    Cookies.remove('email');
    jest.clearAllMocks();
  });

  test('renders Clients component and fetches people data', async () => {
    await act(async () => {
      render(
        <Router>
          <Clients />
        </Router>
      );
    });

    expect(screen.getByPlaceholderText('Search by name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search by company')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });
  });

  test('redirects to login if no admin permission', async () => {
    // Mock check-permission to return non-admin
    mock.onPost('http://localhost:6500/check-permission').reply(200, {
      data: { premission: 'user' }
    });

    await act(async () => {
      render(
        <Router>
          <Clients />
        </Router>
      );
    });

    await waitFor(() => {
      expect(window.location.pathname).toBe('/');
    });
  });
  

  test('shows an error if API call to delete person fails', async () => {
    mock.onDelete('http://localhost:6500/person/1').reply(500);

    await act(async () => {
      render(
        <Router>
          <Clients />
        </Router>
      );
    });

    fireEvent.click(screen.getAllByText('Delete')[0]);

    // Check for success alert
    await waitFor(() => expect(toast.error));
  });
});
