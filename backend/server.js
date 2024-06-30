import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Register from './Register';

// Mock axios
jest.mock('axios');

describe('Register Component', () => {
  beforeEach(() => {
    axios.get.mockClear();
    axios.post.mockClear();
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('handles input change', () => {
    render(<Register />);

    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'John Doe' } });
    expect(screen.getByPlaceholderText('Name').value).toBe('John Doe');

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john@example.com' } });
    expect(screen.getByPlaceholderText('Email').value).toBe('john@example.com');

    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'Password1!' } });
    expect(screen.getByPlaceholderText('Password').value).toBe('Password1!');

    fireEvent.change(screen.getByPlaceholderText('Country'), { target: { value: 'USA' } });
    expect(screen.getByPlaceholderText('Country').value).toBe('USA');

    fireEvent.change(screen.getByPlaceholderText('Company'), { target: { value: 'ABC Corp' } });
    expect(screen.getByPlaceholderText('Company').value).toBe('ABC Corp');
  });

  test('validates form submission', async () => {
    render(<Register />);

    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: '' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: '' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '' } });
    fireEvent.change(screen.getByPlaceholderText('Country'), { target: { value: '' } });
    fireEvent.change(screen.getByPlaceholderText('Company'), { target: { value: '' } });

    fireEvent.click(screen.getByText('Sign Up'));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Please fill in all fields. if you don't have an apartment number, please fill in 0.");
    });
  });

  test('checks password validation for symbols and numbers', async () => {
    render(<Register />);

    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Country'), { target: { value: 'USA' } });
    fireEvent.change(screen.getByPlaceholderText('Company'), { target: { value: 'ABC Corp' } });

    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'pass' } });
    fireEvent.click(screen.getByText('Sign Up'));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Password must be at least 8 characters long.");
    });

    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByText('Sign Up'));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Password must contain at least one symbol.");
    });

    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'Password!' } });
    fireEvent.click(screen.getByText('Sign Up'));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Password must contain numbers.");
    });
  });

  test('handles form submission with valid inputs', async () => {
    axios.get.mockResolvedValueOnce({ data: null });
    axios.post.mockResolvedValueOnce({ data: { success: true } });

    render(<Register />);

    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'Password1!' } });
    fireEvent.change(screen.getByPlaceholderText('Country'), { target: { value: 'USA' } });
    fireEvent.change(screen.getByPlaceholderText('Company'), { target: { value: 'ABC Corp' } });

    fireEvent.click(screen.getByText('Sign Up'));

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:6500/john@example.com');
      expect(axios.post).toHaveBeenCalledWith('http://localhost:6500/register', {
        full_name: 'John Doe',
        email: 'john@example.com',
        password: 'Password1!',
        country: 'USA',
        company: 'ABC Corp'
      });
      expect(window.alert).toHaveBeenCalledWith('User created successfully');
    });
  });

  test('checks for user existence', async () => {
    axios.get.mockResolvedValueOnce({ data: { email: 'john@example.com' } });

    render(<Register />);

    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'Password1!' } });
    fireEvent.change(screen.getByPlaceholderText('Country'), { target: { value: 'USA' } });
    fireEvent.change(screen.getByPlaceholderText('Company'), { target: { value: 'ABC Corp' } });

    fireEvent.click(screen.getByText('Sign Up'));

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:6500/john@example.com');
      expect(window.alert).toHaveBeenCalledWith('User already exists, please log in.');
    });
  });
});
