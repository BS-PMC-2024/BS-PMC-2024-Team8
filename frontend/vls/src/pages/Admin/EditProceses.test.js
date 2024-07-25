import React from "react";
import { render, waitFor, fireEvent, screen, within } from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect';
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
 
  const process = {
    _id: "667df09d72b1250e677f0e89",
    cname: "Yes",
    moneyC: "20",
    peopleC: "8",
    peopleR: "4",
    status: "opened",
    date: "20/05/2024",
    sector: "insurance"	
  };

  beforeAll(() => {
    mock = new MockAdapter(axios);
    useLocation.mockReturnValue({ state: { process } });
    navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);
  });

  afterAll(() => {
    mock.restore();
  });

  test("initial state is set correctly", async () => {
    render(
      <MemoryRouter>
        <EditProceses />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Company Name:")).toBeInTheDocument();
    });

    const cname = screen.getByLabelText("Company Name:");
    const moneyC = screen.getByLabelText("Money Collected:");
    const peopleC = screen.getByLabelText("People Collected:");
    const peopleR = screen.getByLabelText("People Remaining:");
    const status = screen.getByLabelText("Status:");
    const date = screen.getByLabelText("Date:");
    const sector = screen.getByLabelText("Sector:");

    expect(cname.value).toBe(process.cname);
    expect(moneyC.value).toBe(process.moneyC);
    expect(peopleC.value).toBe(process.peopleC);
    expect(peopleR.value).toBe(process.peopleR);
    expect(status.value).toBe(process.status);
    expect(date.value).toBe(process.date);
    expect(sector.value).toBe(process.sector);
  });

  test("handleChange updates state correctly", async () => {
    render(
      <MemoryRouter>
        <EditProceses />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Company Name:")).toBeInTheDocument();
    });

    const cnameInput = screen.getByLabelText("Company Name:");
    fireEvent.change(cnameInput, {
      target: { name: "cname", value: "Updated Company" },
    });

    expect(cnameInput.value).toBe("Updated Company");
  });

  test("handleSave makes a PUT request and navigates on success", async () => {
    mock.onPut("http://localhost:6500/Proceses/667df09d72b1250e677f0e89").reply(200);

    render(
      <MemoryRouter>
        <EditProceses />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Save")).toBeInTheDocument();
    });

    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);

    await waitFor(() => {
      const request = mock.history.put.find(
        (req) => req.url === "http://localhost:6500/Proceses/667df09d72b1250e677f0e89"
      );
      expect(request).toBeTruthy();
    });

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith("/processAdmin");
    });
  });

  test("renders no process data message when process data is missing", () => {
    useLocation.mockReturnValue({ state: {} });

    render(
      <MemoryRouter>
        <EditProceses />
      </MemoryRouter>
    );

    expect(screen.getByText("No process data found")).toBeInTheDocument();
  });
});