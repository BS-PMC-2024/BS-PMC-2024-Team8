import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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

const renderSidebar = (openSidebarToggle) => {
  return render(
    <BrowserRouter>
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={mockOpenSidebar} />
      <Routes>
        <Route path="/homeAdmin" element={<Home />} />
        <Route path="/processAdmin" element={<Proceses />} />
        <Route path="/contactAdmin" element={<Contact />} />
        <Route path="/customersAdmin" element={<Customers />} />
        <Route path="/analyticsAdmin" element={<Analytics />} />
      </Routes>
    </BrowserRouter>
  );
};

describe('Sidebar Component', () => {
  test('renders sidebar with correct items', () => {
    renderSidebar(false);

    console.log(document.body.innerHTML); // Add this line to debug what is being rendered

    expect(screen.getByText('Nicer Debt')).toBeInTheDocument();
    expect(screen.getByTestId('icon-dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('icon-process')).toBeInTheDocument();
    expect(screen.getByTestId('icon-analytics')).toBeInTheDocument();
    expect(screen.getByTestId('icon-customers')).toBeInTheDocument();
    expect(screen.getByTestId('icon-contact')).toBeInTheDocument();
  });

  test('toggles sidebar responsiveness', () => {
    const { container } = renderSidebar(true);
    expect(container.querySelector('#sidebar')).toHaveClass('sidebar-responsive');
  });

  test('navigates to the correct pages', () => {
    renderSidebar(false);

    fireEvent.click(screen.getByTestId('link-dashboard'));
    expect(screen.getByText('HomeAdmin')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('link-process'));
    expect(screen.getByText('ProcessAdmin')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('link-analytics'));
    expect(screen.getByText('AnalyticsAdmin')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('link-customers'));
    expect(screen.getByText('CustomersAdmin')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('link-contact'));
    expect(screen.getByText('ContactAdmin')).toBeInTheDocument();
  });

  test('calls OpenSidebar when close icon is clicked', () => {
    renderSidebar(false);
    fireEvent.click(screen.getByTestId('close-icon'));
    expect(mockOpenSidebar).toHaveBeenCalled();
  });
});
