// EditCustomer.test.jsx
import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import EditProceses from "./EditProceses";

// Mock useNavigate and useLocation
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

describe("EditProceses Component", () => {
  let mock, navigate;
 
 
  const user = {
    cname: "Yes",
    moneyC: "20",
    peopleC: "8",
    peopleR: "4",
    status: "opened",
    date:"20/05/2024",
    sector:"insurance"	
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
        <EditProceses />
      </MemoryRouter>
    );


    const cname = getByLabelText("Company Name:");
    const moneyC = getByLabelText("Money Collected:");
    const peopleC = getByLabelText("People Collected:");
    const peopleR = getByLabelText("People Remaining:");
    const status = getByLabelText("Status:");
    const date = getByLabelText("Date:");
    const sector = getByLabelText("Sector:");



    expect(cname.value).toBe(user.cname);
    expect(moneyC.value).toBe(user.moneyC);
    expect(peopleC.value).toBe(user.peopleC);
    expect(peopleR.value).toBe(user.peopleR);
    expect(status.value).toBe(user.status);
    expect(date.value).toBe(user.date);
    expect(sector.value).toBe(user.sector);


  });

  test("handleChange updates state correctly", () => {
    const { getByLabelText } = render(
      <MemoryRouter>
        <EditProceses />
      </MemoryRouter>
    );

    const fullCompanyName = getByLabelText("Company Name:");
    fireEvent.change(fullCompanyName, {
      target: { name: "cname", value: "Updated User" },
    });

    expect(fullCompanyName.value).toBe("Updated User");
  });

  test("handleSave makes a PUT request and navigates on success", async () => {
    mock.onPut("http://localhost:6500/proceses/667df09d72b1250e677f0e89").reply(200);

    const { getByText } = render(
      <MemoryRouter>
        <EditProceses />
      </MemoryRouter>
    );

    const saveButton = getByText("Save");
    fireEvent.click(saveButton);

    await waitFor(() => {
      const request = mock.history.put.find(
        (req) => req.url === "http://localhost:6500/proceses/667df09d72b1250e677f0e89"
      );
      expect(request).toBeTruthy();
    });

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith("/processAdmin");
    });
  });
});