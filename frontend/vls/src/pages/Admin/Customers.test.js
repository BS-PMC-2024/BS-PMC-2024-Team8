import React from "react";
import { render, waitFor, fireEvent, act } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import Customers from "./Customers";
import { MemoryRouter } from "react-router-dom";

import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
// Mocking dependencies
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("js-cookie", () => ({
  get: jest.fn(),
}));

describe("Customers Component", () => {
  let mock;
  const mockNavigate = jest.fn();

  const mockUsers = [
    {
      _id: "1",
      full_name: "John Doe",
      email: "john.doe@example.com",
      country: "USA",
      company: "ABC Corp",
      premission: "user",
    },
    {
      _id: "2",
      full_name: "Jane Smith",
      email: "jane.smith@example.com",
      country: "Canada",
      company: "XYZ Inc",
      premission: "admin",
    },
  ];

  beforeAll(() => {
    mock = new MockAdapter(axios);
    useNavigate.mockReturnValue(mockNavigate);
    mock.onPost('http://localhost:6500/check-permission').reply(200, {
      data: { premission: 'admin' }
    });
  });

  afterAll(() => {
    mock.restore();
    jest.resetAllMocks();
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
          <Customers />
        </MemoryRouter>
      );
    });

    // Wait for the component to perform the redirect
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
    });
  });

  test("fetches and displays users", async () => {
    Cookies.get.mockReturnValue("admin@example.com");

    // Mock API responses
    mock.onPost("http://localhost:6500/check-permission").reply(200, {
      data: { premission: "admin" },
    });

    mock.onGet("http://localhost:6500/allusers").reply(200, {
      users: mockUsers,
    });

    let getByText;
    await act(async () => {
      const component = render(
        <MemoryRouter>
          <Customers />
        </MemoryRouter>
      );
      getByText = component.getByText;
    });

    await waitFor(() => {
      expect(getByText("John Doe")).toBeInTheDocument();
      expect(getByText("jane.smith@example.com")).toBeInTheDocument();
    });
  });

  test("handles delete user", async () => {
    Cookies.get.mockReturnValue("admin@example.com");

    mock.onGet("http://localhost:6500/allusers").reply(200, {
      users: mockUsers,
    });

    mock.onDelete("http://localhost:6500/user/john.doe@example.com").reply(200);

    let getByText, getAllByText;
    await act(async () => {
      const component = render(
        <MemoryRouter>
          <Customers />
        </MemoryRouter>
      );
      getByText = component.getByText;
      getAllByText = component.getAllByText;
    });

    // Wait for users to be displayed
    await waitFor(() => {
      expect(getByText("John Doe")).toBeInTheDocument();
    });

    // Click delete button
    await act(async () => {
      fireEvent.click(getAllByText("Delete")[0]);
    });

    // Simulate confirmation
    await act(async () => {
      const confirmButton = getByText("Yes, Delete");
      fireEvent.click(confirmButton);
    });

    // Wait for user deletion to be processed
    await waitFor(() => {
      expect(mock.history.delete.length).toBe(1);
    });
  });

});
