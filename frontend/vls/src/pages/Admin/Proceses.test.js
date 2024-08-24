// Customers.test.jsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import Proceses from "./Proceses";

describe("Proceses Component", () => {
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
        <Proceses />
      </MemoryRouter>
    );
    const element = screen.getByText("Processes"); // Adjust the text to match your component
    expect(element).toBeInTheDocument();
  });

});