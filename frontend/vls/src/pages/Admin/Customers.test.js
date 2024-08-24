// Customers.test.jsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import Customers from "./Customers";

describe("Customers Component", () => {
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
        <Customers />
      </MemoryRouter>
    );
    const element = screen.getByText("Customers"); // Adjust the text to match your component
    expect(element).toBeInTheDocument();
  });
});
