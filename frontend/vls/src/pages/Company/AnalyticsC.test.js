import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import Analytics from '../Company/AnalyticsC';
import { BrowserRouter as Router } from 'react-router-dom';
import Cookies from 'js-cookie';

// Mock axios
jest.mock('axios');

// Mock Cookies
jest.mock('js-cookie', () => ({
    get: jest.fn().mockReturnValue('012'),  // Mock the cookie value
  }));

  const companyID = '012';
describe('Analytics Component', () => {
  beforeEach(() => {
    axios.get.mockClear();
    // Set up the mock to return a specific cookie value
    document.cookie = `company=${companyID}`;
   
    axios.post.mockResolvedValueOnce({ data: { data: { premission: 'company' } } });
  });

  test('renders without crashing', () => {
    render(
      <Router>
        <Analytics />
      </Router>
    );
    expect(screen.getByText('Top Debt clients')).toBeInTheDocument();
  });

  test('fetches and displays user count', async () => {
    axios.get.mockResolvedValueOnce({ data: { users: Array(10).fill({}) } });

    render(
      <Router>
        <Analytics />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Top Debt clients')).toBeInTheDocument();
    });

    expect(axios.get).toHaveBeenCalledWith(`http://localhost:6500/clients/${companyID}`);
  });

  test('fetches and processes data correctly for charts', async () => {
    axios.get
      .mockResolvedValueOnce({ data: { processes: [] } })
      .mockResolvedValueOnce({ data: { transactions: [] } });

    render(
      <Router>
        <Analytics />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Monthly Money Collected')).toBeInTheDocument();
    });

    expect(axios.get).toHaveBeenCalledWith(`http://localhost:6500/allprocesses/${companyID}`);
    expect(axios.get).toHaveBeenCalledWith(`http://localhost:6500/transactions/${companyID}`);
  });

  test('renders charts correctly', async () => {
    axios.get
      .mockResolvedValueOnce({
        data: {
          processes: [
            { status: 'opened', moneyC: '100', cname: 'Company A', sector: 'Tech', date: '01/01/2023' },
            { status: 'completed', moneyC: '200', cname: 'Company B', sector: 'Finance', date: '01/02/2023' },
          ],
        },
      })
      .mockResolvedValueOnce({
        data: {
          transactions: [
            { city: 'New York', age: '30', via: 'Email', discount: '10%' },
            { city: 'Los Angeles', age: '25', via: 'SMS', discount: '15%' },
          ],
        },
      });

    render(
      <Router>
        <Analytics />
      </Router>
    );

    await waitFor(() => {
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
