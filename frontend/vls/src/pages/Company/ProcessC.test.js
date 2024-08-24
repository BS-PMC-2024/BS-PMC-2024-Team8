// __tests__/ProcessC.test.jsx
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ProcessC from "./ProcessC";
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';

// Create a mock instance
const mock = new MockAdapter(axios);

describe('ProcessC Component', () => {
  beforeEach(() => {
    // Reset the mock before each test
    mock.reset();
    mock.onPost('http://localhost:6500/check-permission').reply(200, {
      data: { premission: 'admin' }
    });
  });

  it('fetches and displays processes', async () => {
    // Mock the API response
    mock.onGet('http://localhost:6500/allprocesses/testCompany').reply(200, {
      filteredProcesses: [
        {
          _id: '1',
          moneyC: 1000,
          peopleC: 10,
          peopleR: 5,
          date: '2023/08/20',
          strategy: '1',
          discount: 10,
          status: 'opened',
        },
      ],
    });

    // Mock cookie
    document.cookie = 'company=testCompany';

    await act(async () => {
      render(
        <Router>
          <ProcessC />
        </Router>
      );
    });

    // Check if the data is rendered
    expect(screen.getByText('1000')).toBeInTheDocument();
    const peopleCollected = screen.queryAllByText('10');
    expect(peopleCollected.length).toBeGreaterThan(0);
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('2023/08/20')).toBeInTheDocument();
    expect(screen.getByText('Focus on the bigger debt')).toBeInTheDocument();
    expect(screen.getByText('opened')).toBeInTheDocument();
  });

  it('handles delete process', async () => {
    // Mock the API responses
    mock.onGet('http://localhost:6500/allprocesses/testCompany').reply(200, {
      filteredProcesses: [
        {
          _id: '1',
          moneyC: 1000,
          peopleC: 10,
          peopleR: 5,
          date: '2023/08/20',
          strategy: '1',
          discount: 15,
          status: 'opened',
        },
      ],
    });
    mock.onDelete('http://localhost:6500/deleteprocess/1').reply(200);

    // Mock cookie
    document.cookie = 'company=testCompany';

    await act(async () => {
      render(
        <Router>
          <ProcessC />
        </Router>
      );
    });

    // Click the delete button to open the confirmation dialog
    const deleteButton = screen.getByText('Delete');
    await act(async () => {
      deleteButton.click();
    });

    // Ensure the confirmation dialog is displayed
    expect(screen.getByText('Warning')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete this process?')).toBeInTheDocument();

    // Click the "Yes, Delete" button in the confirmation dialog
    const yesDeleteButton = screen.getByText('Yes, Delete');
    await act(async () => {
      yesDeleteButton.click();
    });

    // Wait for the delete operation and state updates to complete
    await new Promise(resolve => setTimeout(resolve, 0));

    // Check if the process was deleted
    expect(screen.queryByText('opened')).not.toBeInTheDocument();
  });

});
