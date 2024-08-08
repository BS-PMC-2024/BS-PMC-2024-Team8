// EditCustomerC.test.jsx
import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import EditCustomerC from "./EditCustomerC";

// Mock useNavigate and useLocation
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

describe("EditCustomerC Component", () => {
  let mock, navigate;

  const person = {
    _id: "1",
    Name: "John Doe",
    Mail: "john.doe@example.com",
    City: "New York",
    Phone: "123-456-7890",
  };

  beforeAll(() => {
    mock = new MockAdapter(axios);
    useLocation.mockReturnValue({ state: { person } });
    navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);
  });

  afterAll(() => {
    mock.restore();
  });

  test("initial state is set correctly", () => {
    const { getByLabelText } = render(
      <MemoryRouter>
        <EditCustomerC />
      </MemoryRouter>
    );

    const nameInput = getByLabelText("Name:");
    const mailInput = getByLabelText("Mail:");
    const cityInput = getByLabelText("City:");
    const phoneInput = getByLabelText("Phone:");

    expect(nameInput.value).toBe(person.Name);
    expect(mailInput.value).toBe(person.Mail);
    expect(cityInput.value).toBe(person.City);
    expect(phoneInput.value).toBe(person.Phone);
  });

  test("handleChange updates state correctly", () => {
    const { getByLabelText } = render(
      <MemoryRouter>
        <EditCustomerC />
      </MemoryRouter>
    );

    const nameInput = getByLabelText("Name:");
    fireEvent.change(nameInput, {
      target: { name: "Name", value: "Updated Name" },
    });

    expect(nameInput.value).toBe("Updated Name");
  });

  test("handleSave makes a PUT request and navigates on success", async () => {
    mock.onPut("http://localhost:6500/person/1").reply(200);

    const { getByText } = render(
      <MemoryRouter>
        <EditCustomerC />
      </MemoryRouter>
    );

    const saveButton = getByText("Save");
    fireEvent.click(saveButton);

    await waitFor(() => {
      const request = mock.history.put.find(
        (req) => req.url === "http://localhost:6500/person/1"
      );
      expect(request).toBeTruthy();
    });

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith("/customersCompany");
    });
  });

  test("handles cancel button click", () => {
    const { getByText } = render(
      <MemoryRouter>
        <EditCustomerC />
      </MemoryRouter>
    );

    const cancelButton = getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(navigate).toHaveBeenCalledWith("/customersCompany");
  });
});
