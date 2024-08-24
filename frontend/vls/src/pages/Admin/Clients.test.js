// Customers.test.jsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import Clients from "./Clients";

describe("Clients Component", () => {
  let mock;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterAll(() => {
    mock.restore();
  });

  test("renders without crashing", () => {
    render(
      <MemoryRouter>
        <Clients />
      </MemoryRouter>
    );
    const element = screen.getByText("Clients"); // Adjust the text to match your component
    expect(element).toBeInTheDocument();
  });
});
