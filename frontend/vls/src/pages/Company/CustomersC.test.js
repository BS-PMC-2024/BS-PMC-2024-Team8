// CustomersC.test.jsx
import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import CustomersC from "./CustomersC";

describe("CustomersC Component", () => {
  let mock;

  beforeAll(() => {
    mock = new MockAdapter(axios);
    mock.onPost('http://localhost:6500/check-permission').reply(200, {
      data: { premission: 'company' }
    });
  });

  afterAll(() => {
    mock.restore();
  });

  test("renders without crashing and displays clients", async () => {
    const clientsData = {
      clients: [
        {
          _id: "1",
          Name: "John Doe",
          Mail: "john@example.com",
          Debt: 500,
          Age: 30,
          City: "New York",
          Date: "2024-08-21",
          Phone: "1234567890",
          Messages: "3",
          Discount: "10%",
        },
        {
          _id: "2",
          Name: "Jane Smith",
          Mail: "jane@example.com",
          Debt: 750,
          Age: 25,
          City: "Los Angeles",
          Date: "2024-08-20",
          Phone: "0987654321",
          Messages: "1",
          Discount: "15%",
        },
      ],
    };

    // Mock the API call
    mock.onGet("http://localhost:6500/clients/null").reply(200, clientsData);
    mock.onPost("http://localhost:6500/check-permission").reply(200, {
      data: { premission: "company" },
    });

    await act(async () => {
      render(
        <MemoryRouter>
          <CustomersC />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      // Check if the client data is rendered
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    });
  });

  test('redirects to login if no admin permission', async () => {
    // Mock check-permission to return non-admin
    mock.onPost('http://localhost:6500/check-permission').reply(200, {
      data: { premission: 'user' }
    });

    // Render component
    await act(async () => {
      render(
        <MemoryRouter>
          <CustomersC />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(window.location.pathname).toBe('/');
    });
  });
});
