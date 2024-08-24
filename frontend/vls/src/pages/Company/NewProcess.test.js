import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import Cookies from 'js-cookie';
import { MemoryRouter } from 'react-router-dom';
import NewProcess from './NewProcess';

jest.mock('axios');
jest.mock('js-cookie');

describe('NewProcess Component', () => {
  beforeEach(() => {
    Cookies.get = jest.fn();
  });

  test('renders the component and checks elements', async () => {
    Cookies.get.mockReturnValue('test@example.com');
    axios.post.mockResolvedValue({ data: { premission: 'company', data: { company: 'Test Company'} } });

    render(
      <MemoryRouter>
        <NewProcess />
      </MemoryRouter>
    );

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(2));

    expect(screen.getByText('NewProcess')).toBeInTheDocument();
    expect(screen.getByText('Dropbox File Upload')).toBeInTheDocument();
    expect(screen.getByText('Discount Preferences')).toBeInTheDocument();
    expect(screen.getByText('Communication Preferences')).toBeInTheDocument();
    expect(screen.getByText('Strategies')).toBeInTheDocument();
  });

  test('shows alert when file is not selected', async () => {
    Cookies.get.mockReturnValue('test@example.com');
    axios.post.mockResolvedValue({ data: { premission: 'company', data: { company: 'Test Company' } } });

    render(
      <MemoryRouter>
        <NewProcess />
      </MemoryRouter>
    );

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(4));

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(window.alert);
    });
  });

});
