import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Contact from './Contact';
import emailjs from '@emailjs/browser';
import axios from 'axios';
import Cookies from 'js-cookie';

jest.mock('axios');
jest.mock('js-cookie');
jest.mock('@emailjs/browser', () => ({
    init: jest.fn(),
    send: jest.fn(),
}));

describe('Contact Component', () => {
    const renderWithRouter = (ui, { route = '/' } = {}) => {
        window.history.pushState({}, 'Test page', route);
        return render(ui, { wrapper: MemoryRouter });
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(window, 'alert').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('renders contact form', () => {
        renderWithRouter(<Contact />);
        const contactForm = screen.getByTestId('contact');
        expect(contactForm).toBeInTheDocument();
    });

    test('renders all input fields', () => {
        renderWithRouter(<Contact />);
        const nameInput = screen.getByLabelText(/your name/i);
        const phoneInput = screen.getByLabelText(/your phone/i);
        const companySelect = screen.getByLabelText(/company/i);
        const descriptionTextarea = screen.getByLabelText(/description message/i);
        
        expect(nameInput).toBeInTheDocument();
        expect(phoneInput).toBeInTheDocument();
        expect(companySelect).toBeInTheDocument();
        expect(descriptionTextarea).toBeInTheDocument();
    });

    test('allows input in all fields', () => {
        renderWithRouter(<Contact />);
        const nameInput = screen.getByLabelText(/your name/i);
        const phoneInput = screen.getByLabelText(/your phone/i);
        const companySelect = screen.getByLabelText(/company/i);
        const descriptionTextarea = screen.getByLabelText(/description message/i);

        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        fireEvent.change(phoneInput, { target: { value: '0523456789' } });
        fireEvent.change(companySelect, { target: { value: 'vls' } });
        fireEvent.change(descriptionTextarea, { target: { value: 'This is a test description' } });

        expect(nameInput.value).toBe('John Doe');
        expect(phoneInput.value).toBe('0523456789');
        expect(companySelect.value).toBe('vls');
        expect(descriptionTextarea.value).toBe('This is a test description');
    });

    test('submits the form successfully', async () => {
        emailjs.send.mockResolvedValue({ text: 'Email successfully sent' });

        renderWithRouter(<Contact />);
        const nameInput = screen.getByLabelText(/your name/i);
        const phoneInput = screen.getByLabelText(/your phone/i);
        const companySelect = screen.getByLabelText(/company/i);
        const descriptionTextarea = screen.getByLabelText(/description message/i);
        const submitButton = screen.getByTestId('button');

        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        fireEvent.change(phoneInput, { target: { value: '0523456789' } });
        fireEvent.change(companySelect, { target: { value: 'vls' } });
        fireEvent.change(descriptionTextarea, { target: { value: 'This is a test description' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith("Email successfully sent. Check your inbox.");
        });
    });

    test('handles form submission error', async () => {
        emailjs.send.mockRejectedValue(new Error('Failed to send email'));

        renderWithRouter(<Contact />);
        const nameInput = screen.getByLabelText(/your name/i);
        const phoneInput = screen.getByLabelText(/your phone/i);
        const companySelect = screen.getByLabelText(/company/i);
        const descriptionTextarea = screen.getByLabelText(/description message/i);
        const submitButton = screen.getByTestId('button');

        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        fireEvent.change(phoneInput, { target: { value: '050error' } });
        fireEvent.change(companySelect, { target: { value: 'vls' } });
        fireEvent.change(descriptionTextarea, { target: { value: 'This is a test description' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith("Failed to send email. Please try again.");
        });
    });

    test('redirects to home if no email cookie', async () => {
        Cookies.get.mockReturnValue(null);
        renderWithRouter(<Contact />);

        await waitFor(() => {
            expect(window.location.pathname).toBe('/');
        });
    });

    test('redirects to home if user does not have admin permission', async () => {
        Cookies.get.mockReturnValue('test@example.com');
        axios.post.mockResolvedValue({ data: { permission: 'user' } });
        renderWithRouter(<Contact />);

        await waitFor(() => {
            expect(window.location.pathname).toBe('/');
        });
    });
});