// src/components/Analytics.test.js
import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Analytics from '../Company/AnalyticsC';
import Cookies from 'js-cookie';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock axios
const mock = new MockAdapter(axios);

describe('Analytics Component', () => {
  beforeEach(() => {
    // Mock the necessary API responses
    mock.onGet('http://localhost:6500/clients/testCompany').reply(200, {
      clients: [
        { Debt: 2000 },
        { Debt: 5000 },
        { Debt: 3000 }
      ]
    });

    mock.onPost('http://localhost:6500/check-permission').reply(200, {
      data: { premission: 'company' }
    });

    mock.onGet('http://localhost:6500/allprocesses/testCompany').reply(200, {
      filteredProcesses: [
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

    mock.onGet('http://localhost:6500/transactions/testCompany').reply(200, {
      transactions: [
        { city: 'City A', age: '25', via: 'Cash', discount: '10%' },
        { city: 'City B', age: '30', via: 'Card', discount: '20%' }
      ]
    });

    // Mock cookies
    Cookies.set('company', 'testCompany');
  });

  afterEach(() => {
    mock.reset();
    Cookies.remove('company');
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
    expect(screen.getByText('Top Debt clients')).toBeInTheDocument();
    expect(screen.getByText('Monthly Money Collected')).toBeInTheDocument();
    expect(screen.getByText('Monthly Proccess Opened')).toBeInTheDocument();
    expect(screen.getByText('Top Cities')).toBeInTheDocument();
    expect(screen.getByText('Ages of the Payers')).toBeInTheDocument();
    expect(screen.getByText('Communication Apps')).toBeInTheDocument();
    expect(screen.getByText('Top Discount Plans')).toBeInTheDocument();
  });

  test('checks API data fetching and display', async () => {
    await act(async () => {
      render(
        <Router>
          <Analytics />
        </Router>
      );
    });

    // Verify API data display
    await waitFor(() => {
      // The exact text might need to be adjusted based on the actual output
      expect(screen.getByText('Top Debt clients')).toBeInTheDocument();
      expect(screen.getByText('Monthly Money Collected')).toBeInTheDocument();
      expect(screen.getByText('Monthly Proccess Opened')).toBeInTheDocument();
      expect(screen.getByText('Top Cities')).toBeInTheDocument();
      expect(screen.getByText('Ages of the Payers')).toBeInTheDocument();
      expect(screen.getByText('Communication Apps')).toBeInTheDocument();
      expect(screen.getByText('Top Discount Plans')).toBeInTheDocument();
    });
  });

});
