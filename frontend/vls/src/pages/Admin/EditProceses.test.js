import React from "react";
import { render, waitFor, fireEvent, screen } from "@testing-library/react";
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

  test("handleSave makes a PUT request and navigates on success", async () => {
    // Use fake timers
    jest.useFakeTimers();

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

    // Wait for the PUT request to be made
    await waitFor(() => {
      const request = mock.history.put.find(
        (req) => req.url === "http://localhost:6500/Proceses/667df09d72b1250e677f0e89"
      );
      expect(request).toBeTruthy();
    });

    // Advance the timers to trigger the setTimeout
    jest.advanceTimersByTime(1500);

    // Check if navigate was called with the correct path
    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith("/processAdmin");
    });

    // Clear the fake timers
    jest.useRealTimers();
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
