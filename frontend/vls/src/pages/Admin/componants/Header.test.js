import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';
import Cookies from 'js-cookie';
import { confirmAlert } from 'react-confirm-alert';

jest.mock('js-cookie');
jest.mock('react-confirm-alert', () => ({
  confirmAlert: jest.fn(),
}));

describe('Header Component', () => {
  const mockOpenSidebar = jest.fn();

  beforeEach(() => {
    Cookies.remove.mockClear();
    confirmAlert.mockClear();
  });

  test('renders the Header component with icons', () => {
    render(<Header OpenSidebar={mockOpenSidebar} />);
    
    const menuIcon = screen.getByTestId('menu-icon');
    const powerIcon = screen.getByTestId('power-icon');

    expect(menuIcon).toBeInTheDocument();
    expect(powerIcon).toBeInTheDocument();
  });

  test('triggers logout confirmation when power icon is clicked', () => {
    render(<Header OpenSidebar={mockOpenSidebar} />);
    
    const powerIcon = screen.getByTestId('power-icon');
    fireEvent.click(powerIcon.querySelector('.icon'));

    expect(confirmAlert).toHaveBeenCalledTimes(1);
  });

  test('removes cookie and redirects on logout confirmation', () => {
    const mockOnClose = jest.fn();
    confirmAlert.mockImplementation(({ customUI }) => {
      const Wrapper = customUI({ onClose: mockOnClose });
      render(Wrapper);
    });

    render(<Header OpenSidebar={mockOpenSidebar} />);
    
    const powerIcon = screen.getByTestId('power-icon');
    fireEvent.click(powerIcon.querySelector('.icon'));

    // Ensure the confirm dialog appears
    expect(confirmAlert).toHaveBeenCalledTimes(1);

    const yesButton = screen.getByTestId('yes');
    fireEvent.click(yesButton);

    expect(Cookies.remove).toHaveBeenCalledWith('email');
    expect(window.location.href).toBe('http://localhost/');
  });

  test('closes confirmation dialog when No is clicked', () => {
    const mockOnClose = jest.fn();
    confirmAlert.mockImplementation(({ customUI }) => {
      const Wrapper = customUI({ onClose: mockOnClose });
      render(Wrapper);
    });

    render(<Header OpenSidebar={mockOpenSidebar} />);
    
    const powerIcon = screen.getByTestId('power-icon');
    fireEvent.click(powerIcon.querySelector('.icon'));

    expect(confirmAlert).toHaveBeenCalledTimes(1);

    const noButton = screen.getByTestId('no');
    fireEvent.click(noButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(Cookies.remove).not.toHaveBeenCalled();
    expect(window.location.href).not.toBe('/');
  });
});
