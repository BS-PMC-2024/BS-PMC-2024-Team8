import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import Analytics from './Analytics';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock axios
jest.mock('axios');

describe('Analytics Component', () => {
  beforeEach(() => {
    axios.get.mockClear();
  });

  test('renders without crashing', () => {
    render(
      <Router>
        <Analytics />
      </Router>
    );
    expect(screen.getByText('Top Active Companies')).toBeInTheDocument();
  });

  test('fetches and displays user count', async () => {
    axios.get.mockResolvedValueOnce({ data: { users: Array(10).fill({}) } });

    render(
      <Router>
        <Analytics />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Top Active Companies')).toBeInTheDocument();
    });

    expect(axios.get).toHaveBeenCalledWith('http://localhost:6500/allusers');
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

    expect(axios.get).toHaveBeenCalledWith('http://localhost:6500/allprocesses');
    expect(axios.get).toHaveBeenCalledWith('http://localhost:6500/alltransactions');
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
      expect(screen.getByText('Top Active Companies')).toBeInTheDocument();
    });

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
