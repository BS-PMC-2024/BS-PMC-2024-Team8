import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import Login from './Login';
import { toast } from 'react-toastify';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';

jest.mock('axios');

jest.mock('react-toastify', () => ({
  toast: {
    warn: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => null,
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const theme = createTheme();

const customRender = (ui, options) =>
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    </ThemeProvider>,
    options
  );

describe('Login Component', () => {
  beforeEach(() => {
    axios.post.mockClear();
    jest.clearAllMocks();
  });

  test('handles email change', () => {
    customRender(<Login />);

    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    expect(emailInput).toHaveValue('test@example.com');
  });

  test('handles password change', () => {
    customRender(<Login />);

    const passwordInput = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(passwordInput).toHaveValue('password123');
  });

  test('handles form submission successfully', async () => {
    axios.post.mockResolvedValueOnce({ data: { success: true, premission: 'admin' } });
    const navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);
    
    customRender(<Login />);

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'ahkcht98@gmail.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'Ahkcht#98' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:6500/login', { email: 'ahkcht98@gmail.com', password: 'Ahkcht#98' });
    });
  });

  test('handles invalid credentials', async () => {
    axios.post.mockResolvedValueOnce({ data: { success: false } });

    customRender(<Login />);

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'invalid@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongpassword' } });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:6500/login', { email: 'invalid@example.com', password: 'wrongpassword' });
      expect(toast.error);
    });
  });

  test('navigates to forgot password page', () => {
    const navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);

    customRender(<Login />);

    fireEvent.click(screen.getByText('click here'));

    expect(navigateMock).toHaveBeenCalledWith('/forgotpassword', { replace: true });
  });
});