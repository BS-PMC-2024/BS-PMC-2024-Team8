import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Home from '../../Admin/Home';
import Proceses from '../../Admin/Proceses';
import Contact from '../../Admin/Contact';
import Customers from '../../Admin/Customers';
import Analytics from '../../Admin/Analytics';
import Sidebar from './sideBar';
import '@testing-library/jest-dom/extend-expect';

jest.mock('react-icons/bs', () => ({
  BsGrid1X2Fill: () => <div data-testid="icon-dashboard">DashboardIcon</div>,
  BsXDiamondFill: () => <div data-testid="icon-process">ProcessIcon</div>,
  BsGraphUp: () => <div data-testid="icon-analytics">AnalyticsIcon</div>,
  BsPeopleFill: () => <div data-testid="icon-customers">CustomersIcon</div>,
  BsEnvelopeFill: () => <div data-testid="icon-contact">ContactIcon</div>,
}));

const mockOpenSidebar = jest.fn();

const renderWithRouter = (component, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);

  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/" element={component} />
        <Route path="/homeAdmin" element={<Home />} />
        <Route path="/processAdmin" element={<Proceses />} />
        <Route path="/contactAdmin" element={<Contact />} />
        <Route path="/customersAdmin" element={<Customers />} />
        <Route path="/analyticsAdmin" element={<Analytics />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('Sidebar Component', () => {
  test('renders sidebar with correct items', () => {
    renderWithRouter(<Sidebar openSidebarToggle={false} OpenSidebar={mockOpenSidebar} />);

    expect(screen.getByText('Nicer Debt')).toBeInTheDocument();
    expect(screen.getByTestId('icon-dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('icon-process')).toBeInTheDocument();
    expect(screen.getByTestId('icon-analytics')).toBeInTheDocument();
    expect(screen.getByTestId('icon-customers')).toBeInTheDocument();
    expect(screen.getByTestId('icon-contact')).toBeInTheDocument();
  });

  test('toggles sidebar responsiveness', () => {
    const { container } = renderWithRouter(<Sidebar openSidebarToggle={true} OpenSidebar={mockOpenSidebar} />);
    expect(container.querySelector('#sidebar')).toHaveClass('sidebar-responsive');
  });

  test('calls OpenSidebar when close icon is clicked', () => {
    renderWithRouter(<Sidebar openSidebarToggle={false} OpenSidebar={mockOpenSidebar} />);
    fireEvent.click(screen.getByTestId('close-icon'));
    expect(mockOpenSidebar).toHaveBeenCalled();
  });
});
