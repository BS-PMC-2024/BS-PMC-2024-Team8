import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import Cookies from 'js-cookie';
import { BrowserRouter as Router } from 'react-router-dom';
import HomeC from './HomeC';

jest.mock('axios');
jest.mock('js-cookie');

describe('HomeC component', () => {
  beforeEach(() => {
    Cookies.get = jest.fn();
    axios.get = jest.fn();
    axios.post = jest.fn();
  });

  test('renders without crashing', async () => {
    Cookies.get.mockImplementation((key) => {
      switch (key) {
        case 'email':
          return 'test@example.com';
        case 'company':
          return 'testCompany';
        default:
          return null;
      }
    });

    axios.post.mockResolvedValueOnce({ data: { permission: 'company' } });
    axios.get.mockResolvedValueOnce({ data: { users: [] } });
    axios.get.mockResolvedValueOnce({ data: { filteredProcesses: [] } });
    axios.get.mockResolvedValueOnce({ data: { filteredTransactions: [] } });

    render(
      <Router>
        <HomeC />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });

  test('displays the correct amount of money collected', async () => {
    Cookies.get.mockReturnValue('test@example.com');
    axios.post.mockResolvedValueOnce({ data: { permission: 'company' } });
    axios.get.mockResolvedValueOnce({ data: { users: [] } });
    axios.get.mockResolvedValueOnce({
      data: {
        filteredProcesses: [
          { status: 'opened', moneyC: '100', date: '01/01/2023' },
          { status: 'completed', moneyC: '200', date: '01/02/2023' },
        ],
      },
    });
    axios.get.mockResolvedValueOnce({ data: { filteredTransactions: [] } });

    render(
      <Router>
        <HomeC />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('MONEY COLLECTED')).toBeInTheDocument();
    });
  });
});
