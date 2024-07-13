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
import axios from 'axios';
import Cookies from 'js-cookie';

jest.mock('react-icons/bs', () => ({
  BsGrid1X2Fill: () => <div data-testid="icon-dashboard">DashboardIcon</div>,
  BsFillPlusCircleFill: () => <div data-testid="icon-new-process">NewProcessIcon</div>,
  BsXDiamondFill: () => <div data-testid="icon-process">ProcessIcon</div>,
  BsGraphUp: () => <div data-testid="icon-analytics">AnalyticsIcon</div>,
  BsPeopleFill: () => <div data-testid="icon-customers">CustomersIcon</div>,
  BsEnvelopeFill: () => <div data-testid="icon-contact">ContactIcon</div>,
}));

jest.mock('axios');
jest.mock('js-cookie');

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

describe('Sidebar component', () => {
  beforeEach(() => {
    Cookies.get.mockImplementation(() => 'test@example.com');
    axios.post.mockResolvedValue({ data: { data: { premission: 'admin' } } });
  });

  test('renders admin menu items', async () => {
    renderWithRouter(<Sidebar openSidebarToggle={true} OpenSidebar={mockOpenSidebar} />);
    expect(await screen.findByTestId('icon-dashboard')).toBeInTheDocument();
    expect(await screen.findByTestId('icon-process')).toBeInTheDocument();
    expect(await screen.findByTestId('icon-analytics')).toBeInTheDocument();
    expect(await screen.findByTestId('icon-customers')).toBeInTheDocument();
    expect(await screen.findByTestId('icon-contact')).toBeInTheDocument();
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
