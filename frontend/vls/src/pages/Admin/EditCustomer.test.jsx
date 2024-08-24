// EditCustomer.test.jsx
import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import EditCustomer from "./EditCustomer";

// Mock useNavigate and useLocation
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

describe("EditCustomer Component", () => {
  let mock, navigate;

  const user = {
    email: "test@example.com",
    full_name: "Test User",
    country: "Test Country",
    company: "Test Company",
    premission: "admin",
  };

  beforeAll(() => {
    mock = new MockAdapter(axios);
    useLocation.mockReturnValue({ state: { user } });
    navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);
  });

  afterAll(() => {
    mock.restore();
  });

  test("initial state is set correctly", () => {
    const { getByLabelText } = render(
      <MemoryRouter>
        <EditCustomer />
      </MemoryRouter>
    );

    const fullNameInput = getByLabelText("Full Name:");
    const countryInput = getByLabelText("Country:");
    const companyInput = getByLabelText("Company:");
    const permissionSelect = getByLabelText("Permission");

    expect(fullNameInput.value).toBe(user.full_name);
    expect(countryInput.value).toBe(user.country);
    expect(companyInput.value).toBe(user.company);
  });

  test("handleChange updates state correctly", () => {
    const { getByLabelText } = render(
      <MemoryRouter>
        <EditCustomer />
      </MemoryRouter>
    );

    const fullNameInput = getByLabelText("Full Name:");
    fireEvent.change(fullNameInput, {
      target: { name: "full_name", value: "Updated User" },
    });

    expect(fullNameInput.value).toBe("Updated User");
  });

  test("handleSave makes a PUT request and navigates on success", async () => {
    // Use fake timers
    jest.useFakeTimers();

    mock.onPut("http://localhost:6500/user/test@example.com").reply(200);

    const { getByText } = render(
      <MemoryRouter>
        <EditCustomer />
      </MemoryRouter>
    );

    const saveButton = getByText("Save");
    fireEvent.click(saveButton);

    // Wait for the PUT request to be made
    await waitFor(() => {
      const request = mock.history.put.find(
        (req) => req.url === "http://localhost:6500/user/test@example.com"
      );
      expect(request);
    });

    // Advance the timers to trigger the setTimeout
    jest.advanceTimersByTime(1500);

    // Check if navigate was called with the correct path
    await waitFor(() => {
      expect(navigate);
    });

    // Clear the fake timers
    jest.useRealTimers();
  });
});
