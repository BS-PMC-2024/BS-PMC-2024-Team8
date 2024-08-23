import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import Home from './Home';

// Mock the modules
jest.mock('axios');
jest.mock('js-cookie');

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock the components
jest.mock('./componants/Header', () => () => <div data-testid="header">Header</div>);
jest.mock('./componants/sideBar', () => () => <div data-testid="sidebar">Sidebar</div>);

// Mock recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  BarChart: () => <div data-testid="bar-chart">BarChart</div>,
  LineChart: () => <div data-testid="line-chart">LineChart</div>,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
  Line: () => null,
}));

// Mock react-icons
jest.mock('react-icons/bs', () => ({
  BsPeopleFill: () => <div data-testid="icon-people">PeopleIcon</div>,
  BsCheckCircle: () => <div data-testid="icon-check">CheckIcon</div>,
  BsArrowRepeat: () => <div data-testid="icon-arrow">ArrowIcon</div>,
  BsCash: () => <div data-testid="icon-cash">CashIcon</div>,
}));

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    Cookies.get.mockReturnValue('test@example.com');
    axios.post.mockResolvedValue({ data: {data: { premission: 'admin' } } });
    axios.get.mockImplementation((url) => {
      if (url === 'http://localhost:6500/allusers') {
        return Promise.resolve({ data: { users: [{ id: 1 }, { id: 2 }] } });
      }
      if (url === 'http://localhost:6500/allprocesses') {
        return Promise.resolve({
          data: {
            processes: [
              { status: 'opened', cname: 'Company A', moneyC: '100', date: '01/01/2024' },
              { status: 'completed', cname: 'Company B', moneyC: '200', date: '02/01/2024' },
              { status: 'completed', cname: 'Company A', moneyC: '300', date: '03/01/2024' },
            ],
          },
        });
      }
    });
  });

  test('renders dashboard components', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      );
    });

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByText('DASHBOARD')).toBeInTheDocument();
  });

  test('displays correct statistics', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('PROCESS OPENED').closest('.card').querySelector('h1')).toHaveTextContent('1');
      expect(screen.getByText('PROCESS COMPLETED').closest('.card').querySelector('h1')).toHaveTextContent('2');
      expect(screen.getByText('CUSTOMERS').closest('.card').querySelector('h1')).toHaveTextContent('2');
      expect(screen.getByText('MONEY COLLECTED').closest('.card').querySelector('h1')).toHaveTextContent('500');
    });
  });

  test('renders charts', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      );
    });

    expect(screen.getByText('Top Active Companies')).toBeInTheDocument();
    expect(screen.getByText('Monthly Money Collected')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  test('navigates to home if there is no email in cookies', async () => {
    mockNavigate.mockClear();
    Cookies.get.mockReturnValueOnce(null);

    await act(async () => {
      render(
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });

  test('handles API errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    axios.get.mockRejectedValueOnce(new Error('API Error'));

    await act(async () => {
      render(
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching users:', expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });
});
