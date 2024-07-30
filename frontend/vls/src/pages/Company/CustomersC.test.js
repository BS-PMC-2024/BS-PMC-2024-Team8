// CustomersC.test.jsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import CustomersC from "./CustomersC";

describe("CustomersC Component", () => {
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
        <CustomersC />
      </MemoryRouter>
    );
    const element = screen.getByText("PEOPLE");
    expect(element).toBeInTheDocument();
  });

  test("renders without crashing when permission check fails", async () => {
    mock.onPost("http://localhost:6500/check-permission").reply(404);

    render(
      <MemoryRouter>
        <CustomersC />
      </MemoryRouter>
    );

    await waitFor(() => {
      const element = screen.getByText("PEOPLE");
      expect(element).toBeInTheDocument();
    });
  });
});
