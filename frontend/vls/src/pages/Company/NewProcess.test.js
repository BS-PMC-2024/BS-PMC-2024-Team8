// import React from 'react';
// import { render, fireEvent, screen, waitFor } from '@testing-library/react';
// import '@testing-library/jest-dom/extend-expect';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import { MemoryRouter } from 'react-router-dom';
// import NewProcess from './NewProcess';

// jest.mock('axios');
// jest.mock('js-cookie');

// describe('NewProcess Component', () => {
//   beforeEach(() => {
//     Cookies.get = jest.fn();
//   });

//   test('renders the component and checks elements', async () => {
//     Cookies.get.mockReturnValue('test@example.com');
//     axios.post.mockResolvedValue({ data: { premission: 'company', data: { company: 'Test Company'} } });

//     render(
//       <MemoryRouter>
//         <NewProcess />
//       </MemoryRouter>
//     );

//     await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(2));

//     expect(screen.getByText('NewProcess')).toBeInTheDocument();
//     expect(screen.getByText('Dropbox File Upload')).toBeInTheDocument();
//     expect(screen.getByText('Discount Preferences')).toBeInTheDocument();
//     expect(screen.getByText('Communication Preferences')).toBeInTheDocument();
//     expect(screen.getByText('Strategies')).toBeInTheDocument();
//   });

//   test('shows alert when file is not selected', async () => {
//     Cookies.get.mockReturnValue('test@example.com');
//     axios.post.mockResolvedValue({ data: { premission: 'company', data: { company: 'Test Company' } } });

//     render(
//       <MemoryRouter>
//         <NewProcess />
//       </MemoryRouter>
//     );

//     await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(4));

//     fireEvent.click(screen.getByText('Submit'));

//     await waitFor(() => {
//       expect(window.alert);
//     });
//   });

// });

import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import NewProcess from './NewProcess';
import Cookies from 'js-cookie';
import { MemoryRouter } from 'react-router-dom';

// Set up axios-mock-adapter
const mock = new MockAdapter(axios);

describe('NewProcess Component', () => {
  beforeEach(() => {
    // Reset mock adapter and cookies before each test
    mock.reset();
    Cookies.get = jest.fn();
  });
  test('redirects to login if no company permission', async () => {
    // Mock check-permission to return non-admin
    mock.onPost('http://localhost:6500/check-permission').reply(200, {
      data: { premission: 'user' }
    });

    // Render component
    await act(async () => {
      render(
        <MemoryRouter>
          <NewProcess />
        </MemoryRouter>
      );
    });

    // Check redirection (for example, you might need to mock useNavigate)
    await waitFor(() => {
      expect(window.location.pathname).toBe('/');
    });
  });

  test('renders the component with initial state', async () => {
    Cookies.get.mockReturnValue('test@example.com');
    mock.onPost('http://localhost:6500/check-permission').reply(200, {
      data: { premission: 'company', company: 'Test Company', sector: 'Tech' }
    });

    await act(async () => {
      render(
        <MemoryRouter>
          <NewProcess />
        </MemoryRouter>
      );
    });

    expect(screen.getByText('NewProcess')).toBeInTheDocument();
    expect(screen.getByText('Dropbox File Upload')).toBeInTheDocument();
    expect(screen.getByText('Discount Preferences')).toBeInTheDocument();
    expect(screen.getByText('Communication Preferences')).toBeInTheDocument();
    expect(screen.getByText('Strategies')).toBeInTheDocument();
  });

  test('shows error when no file is selected on submit', async () => {
    Cookies.get.mockReturnValue('test@example.com');
    mock.onPost('http://localhost:6500/check-permission').reply(200, {
      data: { premission: 'company', company: 'Test Company', sector: 'Tech' }
    });

    await act(async () => {
      render(
        <MemoryRouter>
          <NewProcess />
        </MemoryRouter>
      );
    });

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Please select a file');
    });
  });


  test('shows and closes video dialog', async () => {
    Cookies.get.mockReturnValue('test@example.com');
    mock.onPost('http://localhost:6500/check-permission').reply(200, {
      data: { premission: 'company', company: 'Test Company', sector: 'Tech' }
    });

    await act(async () => {
      render(
        <MemoryRouter>
          <NewProcess />
        </MemoryRouter>
      );
    });

    fireEvent.click(screen.getByText('Instruction Video'));

    expect(screen.getByRole('dialog')).toBeVisible();

    fireEvent.click(screen.getByText('Close'));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeVisible();
    });
  });
});

