// src/components/Analytics.test.js
import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Analytics from './Analytics';
import Cookies from 'js-cookie';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock axios
const mock = new MockAdapter(axios);

describe('Analytics Component', () => {
  beforeEach(() => {
    // Mock the necessary API responses
    mock.onPost('http://localhost:6500/check-permission').reply(200, {
      data: { premission: 'admin' }
    });

    mock.onGet('http://localhost:6500/allusers').reply(200, {
      users: [{ id: 1 }, { id: 2 }]
    });

    mock.onGet('http://localhost:6500/allprocesses').reply(200, {
      processes: [
        {
          status: 'opened',
          moneyC: '1000',
          cname: 'Company A',
          sector: 'Tech',
          date: '01/01/2023'
        },
        {
          status: 'completed',
          moneyC: '2000',
          cname: 'Company B',
          sector: 'Finance',
          date: '01/02/2023'
        }
      ]
    });

    mock.onGet('http://localhost:6500/alltransactions').reply(200, {
      transactions: [
        { city: 'City A', age: '25', via: 'Cash', discount: '10%' },
        { city: 'City B', age: '30', via: 'Card', discount: '20%' }
      ]
    });

    // Mock cookies
    Cookies.set('email', 'test@example.com');
  });

  afterEach(() => {
    mock.reset();
    Cookies.remove('email');
  });

  test('renders Analytics component and fetches data correctly', async () => {
    await act(async () => {
      render(
        <Router>
          <Analytics />
        </Router>
      );
    });

    // Verify initial rendering
    expect(screen.getByText('Top Active Companies')).toBeInTheDocument();

    // Wait for the API calls and check if data is displayed
    await waitFor(() => {
      expect(screen.getByText('Top Active Companies')).toBeInTheDocument();
      expect(screen.getByText('Monthly Money Collected')).toBeInTheDocument();
      expect(screen.getByText('Sectors of Clients')).toBeInTheDocument();
      expect(screen.getByText('Monthly Proccess Opened')).toBeInTheDocument();
      expect(screen.getByText('Top Cities')).toBeInTheDocument();
      expect(screen.getByText('Ages of the Payers')).toBeInTheDocument();
      expect(screen.getByText('Communication Apps')).toBeInTheDocument();
      expect(screen.getByText('Top Discount Plans')).toBeInTheDocument();
    });
  });

  test('redirects to login if no admin permission', async () => {
    // Mock check-permission to return non-admin
    mock.onPost('http://localhost:6500/check-permission').reply(200, {
      data: { premission: 'user' }
    });

    // Render component
    await act(async () => {
      render(
        <Router>
          <Analytics />
        </Router>
      );
    });

    await waitFor(() => {
      expect(window.location.pathname).toBe('/');
    });
  });

});

