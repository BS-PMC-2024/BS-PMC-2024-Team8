import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import Login from './Login';

jest.mock('axios');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Login Component', () => {
  beforeEach(() => {
    axios.post.mockClear();
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('handles email change', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    expect(emailInput.value).toBe('test@example.com');
  });

  test('handles password change', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const passwordInput = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(passwordInput.value).toBe('password123');
  });

  test('handles form submission successfully', async () => {
    axios.post.mockResolvedValueOnce({ data: { success: true, premission: 'admin' } });
    const navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'ahkcht98@gmail.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'Ahkcht#98' } });
    fireEvent.click(screen.getByText('Sign In'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:6500/login', { email: 'ahkcht98@gmail.com', password: 'Ahkcht#98' });
    });
  });

  test('handles invalid credentials', async () => {
    axios.post.mockResolvedValueOnce({ data: { success: false } });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'invalid@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongpassword' } });

    fireEvent.click(screen.getByText('Sign In'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:6500/login', { email: 'invalid@example.com', password: 'wrongpassword' });
      expect(window.alert).toHaveBeenCalledWith('Error logging in. Please try again.');
    });
  });

  test('navigates to forgot password page', () => {
    const navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('click here'));

    expect(navigateMock).toHaveBeenCalledWith('/forgotpassword', { replace: true });
  });
});
