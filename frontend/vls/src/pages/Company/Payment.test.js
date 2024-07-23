import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Payment from './Payment';
import userEvent from '@testing-library/user-event';

jest.mock('axios', () => ({
  post: jest.fn()
}));

describe('Payment Component', () => {
  const setup = () => {
    const params = {
      name: 'John Doe',
      phone: '1234567890',
      mail: 'john@example.com',
      debt: '6000',
      age: '30',
      city: 'New York',
      cname: 'Company Name',
      discount: '10%',
      via: 'email'
    };

    return render(
      <Router>
        <Payment params={params} />
      </Router>
    );
  };

  test('renders the Payment component', () => {
    setup();

    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Debt/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Card Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/CVV/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ID/i)).toBeInTheDocument();
  });

  test('shows validation errors', () => {
    setup();

    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    fireEvent.click(screen.getByText(/Submit Payment/i));

    expect(alertMock).toHaveBeenCalledWith('Please fill in all required fields.');
    alertMock.mockRestore();
  });
});
