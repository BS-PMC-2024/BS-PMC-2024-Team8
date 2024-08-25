import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Register from './Register';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { toast } from 'react-toastify';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter

// Mock axios
jest.mock('axios');

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
  ToastContainer: () => null,
}));

// Mock Material-UI components
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  FormControl: ({ children }) => <div data-testid="form-control">{children}</div>,
  InputLabel: ({ children }) => <label>{children}</label>,
  Select: ({ children, ...props }) => <select {...props}>{children}</select>,
  MenuItem: ({ value, children }) => <option value={value}>{children}</option>,
}));

const theme = createTheme();

const customRender = (ui, options) =>
  render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </MemoryRouter>, 
    options
  );

describe('Register Component', () => {
  beforeEach(() => {
    axios.get.mockClear();
    axios.post.mockClear();
    jest.clearAllMocks();
  });

  test('handles input change', () => {
    customRender(<Register />);

    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'John Doe' } });
    expect(screen.getByPlaceholderText('Name')).toHaveValue('John Doe');

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john@example.com' } });
    expect(screen.getByPlaceholderText('Email')).toHaveValue('john@example.com');

    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'Password1!' } });
    expect(screen.getByPlaceholderText('Password')).toHaveValue('Password1!');

    fireEvent.change(screen.getByPlaceholderText('Country'), { target: { value: 'USA' } });
    expect(screen.getByPlaceholderText('Country')).toHaveValue('USA');

    fireEvent.change(screen.getByPlaceholderText('Company'), { target: { value: 'ABC Corp' } });
    expect(screen.getByPlaceholderText('Company')).toHaveValue('ABC Corp');
  });

  test('validates form submission', async () => {
    customRender(<Register />);

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Please fill in all fields. if you don't have an apartment number, please fill in 0.",
        expect.any(Object)
      );
    });
  });

  test('checks password validation for symbols and numbers', async () => {
    customRender(<Register />);

    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Country'), { target: { value: 'USA' } });
    fireEvent.change(screen.getByPlaceholderText('Company'), { target: { value: 'ABC Corp' } });

    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'pass' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Password must be at least 8 characters long.",
        expect.any(Object)
      );
    });

    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Password must contain at least one symbol.",
        expect.any(Object)
      );
    });

    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'Password!' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Password must contain numbers.",
        expect.any(Object)
      );
    });
  });

  test('checks for user existence', async () => {
    axios.get.mockResolvedValueOnce({ data: { email: 'john@example.com' } });

    customRender(<Register />);

    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'Password1!' } });
    fireEvent.change(screen.getByPlaceholderText('Country'), { target: { value: 'USA' } });
    fireEvent.change(screen.getByPlaceholderText('Company'), { target: { value: 'ABC Corp' } });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:6500/john@example.com');
      expect(toast.warn).toHaveBeenCalledWith(
        "User already exists, please log in.",
        expect.any(Object)
      );
    });
  });
});
