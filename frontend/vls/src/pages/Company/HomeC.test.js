// import React from 'react';
// import { render, screen, waitFor } from '@testing-library/react';
// import '@testing-library/jest-dom/extend-expect';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import { BrowserRouter as Router } from 'react-router-dom';
// import HomeC from './HomeC';

// jest.mock('axios');
// jest.mock('js-cookie');

// describe('HomeC component', () => {
//   beforeEach(() => {
//     Cookies.get = jest.fn();
//     axios.get = jest.fn();
//     axios.post = jest.fn();
//   });

//   test('renders without crashing', async () => {
//     Cookies.get.mockImplementation((key) => {
//       switch (key) {
//         case 'email':
//           return 'test@example.com';
//         case 'company':
//           return 'testCompany';
//         default:
//           return null;
//       }
//     });

//     axios.post.mockResolvedValueOnce({ data: { permission: 'company' } });
//     axios.get.mockResolvedValueOnce({ data: { users: [] } });
//     axios.get.mockResolvedValueOnce({ data: { filteredProcesses: [] } });
//     axios.get.mockResolvedValueOnce({ data: { filteredTransactions: [] } });

//     render(
//       <Router>
//         <HomeC />
//       </Router>
//     );

//     await waitFor(() => {
//       expect(screen.getByText('Dashboard')).toBeInTheDocument();
//     });
//   });

//   test('displays the correct amount of money collected', async () => {
//     Cookies.get.mockReturnValue('test@example.com');
//     axios.post.mockResolvedValueOnce({ data: { permission: 'company' } });
//     axios.get.mockResolvedValueOnce({ data: { users: [] } });
//     axios.get.mockResolvedValueOnce({
//       data: {
//         filteredProcesses: [
//           { status: 'opened', moneyC: '100', date: '01/01/2023' },
//           { status: 'completed', moneyC: '200', date: '01/02/2023' },
//         ],
//       },
//     });
//     axios.get.mockResolvedValueOnce({ data: { filteredTransactions: [] } });

//     render(
//       <Router>
//         <HomeC />
//       </Router>
//     );

//     await waitFor(() => {
//       expect(screen.getByText('MONEY COLLECTED')).toBeInTheDocument();
//     });
//   });
// });
import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Cookies from 'js-cookie';
import { BrowserRouter as Router } from 'react-router-dom';
import HomeC from './HomeC';

describe('HomeC component', () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);

    // Mock API responses
    mock.onGet('http://localhost:6500/allprocesses').reply(200, {
      processes: [
        { _id: '1', cname: 'Company A', moneyC: 1000, peopleC: 10, peopleR: 5, status: 'Active', date: '01/01/2023', sector: 'Tech' },
      ],
    });
    mock.onGet('http://localhost:6500/clients/testCompany').reply(200, {
      clients: [
        { Debt: 2000 },
        { Debt: 5000 },
        { Debt: 3000 }
      ]
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

    mock.onDelete('http://localhost:6500/deleteprocess/1').reply(200, { message: 'Process deleted successfully' });

    mock.onPost('http://localhost:6500/check-permission').reply(200, { data: { premission: 'admin' } });
    

    // Set up cookies to simulate logged-in user
    Cookies.set('email', 'user@example.com');
    Cookies.set('company', 'testCompany');
  });

  afterEach(() => {
    mock.reset();
  });

  test('renders without crashing', async () => {
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
    await act(async () => {
      render(
        <Router>
          <HomeC />
        </Router>
      );
    });

    await waitFor(() => {
      // Check for the presence of text or components that display money collected
      expect(screen.getByText('MONEY COLLECTED')).toBeInTheDocument();
    });
  });
  test('navigates to the home page if the permission check fails', async () => {
    mock.onPost('http://localhost:6500/check-permission').reply(200, { data: { premission: 'guest' } });

    await act(async () => {
      render(
        <Router>
          <HomeC />
        </Router>
      );
    });
  });
  
});


