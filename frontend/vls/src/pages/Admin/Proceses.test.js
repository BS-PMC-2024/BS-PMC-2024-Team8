// // Customers.test.jsx
// import React from "react";
// import { render, screen, waitFor } from "@testing-library/react";
// import { MemoryRouter } from "react-router-dom";
// import axios from "axios";
// import MockAdapter from "axios-mock-adapter";
// import Proceses from "./Proceses";

// describe("Proceses Component", () => {
//   let mock;

//   beforeAll(() => {
//     mock = new MockAdapter(axios);
//   });

//   afterAll(() => {
//     mock.restore();
//   });

//   test("renders without crashing", () => {
//     render(
//       <MemoryRouter>
//         <Proceses />
//       </MemoryRouter>
//     );
//     const element = screen.getByText("Processes"); // Adjust the text to match your component
//     expect(element).toBeInTheDocument();
//   });

// });

import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Proceses from './Proceses';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Cookies from 'js-cookie'; // Use js-cookie

// Set up mock axios
const mock = new MockAdapter(axios);

const renderWithProviders = (ui) => {
  return render(
    <Router>
      <Routes>
        <Route path="/" element={ui} />
        <Route path="/EditProceses" element={<div>EditProceses</div>} />
      </Routes>
    </Router>
  );
};

describe('Proceses Component', () => {
  beforeEach(() => {
    mock.reset();
    // Mock permission check
    mock.onPost('http://localhost:6500/check-permission').reply(200, { data: { premission: 'admin' } });
    mock.onGet('http://localhost:6500/allprocesses').reply(200, {
      processes: [
        { _id: '1', cname: 'Company A', moneyC: 1000, peopleC: 10, peopleR: 5, status: 'Active', date: '01/01/2023', sector: 'Tech' },
        { _id: '2', cname: 'Company B', moneyC: 2000, peopleC: 20, peopleR: 10, status: 'Inactive', date: '02/01/2023', sector: 'Finance' },
      ],
    });
    
    // Set up cookies to simulate logged-in user
    Cookies.set('email', 'user@example.com');
  });

  it('renders the Proceses component and fetches processes correctly', async () => {

    await act(async () => {
      renderWithProviders(<Proceses />);
    });

    // Assert that the component renders and fetches data correctly
    await waitFor(() => {
      expect(screen.getByText('Company A')).toBeInTheDocument();
      expect(screen.getByText('Company B')).toBeInTheDocument();
    });
  });


  it('redirects to home if user is not an admin', async () => {
    // Mock permission check to simulate non-admin access
    mock.onPost('http://localhost:6500/check-permission').reply(200, { data: { premission: 'user' } });

    // Set up cookies to simulate logged-in user
    Cookies.set('email', 'user@example.com');

    await act(async () => {
      renderWithProviders(<Proceses />);
    });

    // Wait for redirection
    await waitFor(() => {
      expect(window.location.pathname).toBe('/');
    });
  });

  it('handles delete process correctly', async () => {
    // Mock API responses
    mock.onGet('http://localhost:6500/allprocesses').reply(200, {
      processes: [
        { _id: '1', cname: 'Company A', moneyC: 1000, peopleC: 10, peopleR: 5, status: 'Active', date: '01/01/2023', sector: 'Tech' },
      ],
    });

    mock.onDelete('http://localhost:6500/deleteprocess/1').reply(200, { message: 'Process deleted successfully' });

    // Mock permission check
    mock.onPost('http://localhost:6500/check-permission').reply(200, { data: { premission: 'admin' } });

    // Set up cookies to simulate logged-in user
    Cookies.set('email', 'user@example.com');

    await act(async () => {
      renderWithProviders(<Proceses />);
    });

    // Trigger delete action
    await waitFor(() => {
      fireEvent.click(screen.getByText('Delete'));
    });

    // Confirm deletion and assert results
    await waitFor(() => {
      expect(screen.queryByText('1')).not.toBeInTheDocument();
    });
  });

  it('displays error message if fetch processes fails', async () => {
    // Mock API responses
    mock.onGet('http://localhost:6500/allprocesses').reply(500);

    await act(async () => {
      renderWithProviders(<Proceses />);
    });

    // Assert error toast message
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch processes')).toBeInTheDocument();
    });
  });
});
