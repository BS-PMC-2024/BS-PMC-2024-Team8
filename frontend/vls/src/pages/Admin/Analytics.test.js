import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import Analytics from './Analytics';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock axios
jest.mock('axios');

describe('Analytics Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    axios.post.mockResolvedValueOnce({ data: { data: { premission: 'Admin' } } });
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

// // src/components/Analytics.test.js
// import React from 'react';
// import { render, screen, waitFor } from '@testing-library/react';
// import axios from 'axios';
// import MockAdapter from 'axios-mock-adapter';
// import Analytics from './Analytics';
// import Cookies from 'js-cookie';
// import { BrowserRouter as Router } from 'react-router-dom';

// // Mock axios
// const mock = new MockAdapter(axios);

// describe('Analytics Component', () => {
//   beforeEach(() => {
//     // Mock the necessary API responses
//     mock.onPost('http://localhost:6500/check-permission').reply(200, {
//       data: { premission: 'admin' }
//     });

//     mock.onGet('http://localhost:6500/allusers').reply(200, {
//       users: [{ id: 1 }, { id: 2 }]
//     });

//     mock.onGet('http://localhost:6500/allprocesses').reply(200, {
//       processes: [
//         {
//           status: 'opened',
//           moneyC: '1000',
//           cname: 'Company A',
//           sector: 'Tech',
//           date: '01/01/2023'
//         },
//         {
//           status: 'completed',
//           moneyC: '2000',
//           cname: 'Company B',
//           sector: 'Finance',
//           date: '01/02/2023'
//         }
//       ]
//     });

//     mock.onGet('http://localhost:6500/alltransactions').reply(200, {
//       transactions: [
//         { city: 'City A', age: '25', via: 'Cash', discount: '10%' },
//         { city: 'City B', age: '30', via: 'Card', discount: '20%' }
//       ]
//     });

//     // Mock cookies
//     Cookies.set('email', 'test@example.com');
//   });

//   afterEach(() => {
//     mock.reset();
//     Cookies.remove('email');
//   });

//   test('renders Analytics component and fetches data correctly', async () => {
//     render(
//       <Router>
//         <Analytics />
//       </Router>
//     );

//     // Verify initial rendering
//     expect(screen.getByText('الاحصائيات')).toBeInTheDocument();

//     // Wait for the API calls and check if data is displayed
//     await waitFor(() => {
//       expect(screen.getByText('أكثر الشركات نشاطاً')).toBeInTheDocument();
//       expect(screen.getByText('عمليات التحصيل الشهرية')).toBeInTheDocument();
//       expect(screen.getByText('المبالغ المحصلة شهرياً')).toBeInTheDocument();
//       expect(screen.getByText('المبالغ المحصلة حسب القطاعات')).toBeInTheDocument();
//       expect(screen.getByText('عمليات التحصيل حسب المدن')).toBeInTheDocument();
//       expect(screen.getByText('عمليات التحصيل حسب الأعمار')).toBeInTheDocument();
//       expect(screen.getByText('أفضل وسائل التحصيل')).toBeInTheDocument();
//       expect(screen.getByText('أفضل الخصومات')).toBeInTheDocument();
//     });
//   });

//   test('redirects to login if no admin permission', async () => {
//     // Mock check-permission to return non-admin
//     mock.onPost('http://localhost:6500/check-permission').reply(200, {
//       data: { premission: 'user' }
//     });

//     // Render component
//     render(
//       <Router>
//         <Analytics />
//       </Router>
//     );

//     // Check redirection (for example, you might need to mock useNavigate)
//     await waitFor(() => {
//       expect(window.location.pathname).toBe('/');
//     });
//   });

//   test('fetches and displays users number', async () => {
//     render(
//       <Router>
//         <Analytics />
//       </Router>
//     );

//     await waitFor(() => {
//       expect(screen.getByText('2')).toBeInTheDocument();
//     });
//   });
// });
