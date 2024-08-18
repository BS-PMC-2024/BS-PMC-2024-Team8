import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useLocation, useNavigate } from "react-router-dom";
import DeleteCustomerC from "./DeleteCustomerC";
import emailjs from "@emailjs/browser";

jest.mock("axios");
jest.mock("react-router-dom", () => ({
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));
jest.mock("@emailjs/browser");

describe("DeleteCustomerC Component", () => {
  const mockNavigate = jest.fn();
  const mockPerson = {
    Name: "Test Person",
    company: "Test Company",
    Mail: "test@example.com",
  };

  beforeEach(() => {
    // Mock alert function
    global.alert = jest.fn();

    useLocation.mockReturnValue({ state: { person: mockPerson } });
    useNavigate.mockReturnValue(mockNavigate);
    
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders DeleteCustomerC component", () => {
    render(<DeleteCustomerC />);
    expect(screen.getByText("Delete Debtor")).toBeInTheDocument();
  });

  test("handles input change", () => {
    render(<DeleteCustomerC />);
    const textField = screen.getByLabelText(/Message/i);
    fireEvent.change(textField, { target: { value: "Test message" } });
    expect(textField.value).toBe("Test message");
  });

  test("handles cancel button click", () => {
    render(<DeleteCustomerC />);
    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);
    expect(mockNavigate).toHaveBeenCalledWith("/customersCompany");
  });

  test("handles submit button click", async () => {
    emailjs.send.mockResolvedValueOnce({ status: 200 });

    render(<DeleteCustomerC />);
    const textField = screen.getByLabelText(/Message/i);
    fireEvent.change(textField, { target: { value: "Test message" } });

    const submitButton = screen.getByText("Save");
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(emailjs.send).toHaveBeenCalledWith(
        "service_0x2l75s",
        "template_wbo9ytj",
        {
          mes: "Test message",
          name: mockPerson.Name,
          cname: mockPerson.company,
          email: mockPerson.Mail,
        }
      )
    );

    await waitFor(() =>
      expect(global.alert).toHaveBeenCalledWith("Email successfully sent. Check your inbox.")
    );
  });

  test("displays error message on email send failure", async () => {
    emailjs.send.mockRejectedValueOnce(new Error("Failed to send email"));

    render(<DeleteCustomerC />);
    const textField = screen.getByLabelText(/Message/i);
    fireEvent.change(textField, { target: { value: "Test message" } });

    const submitButton = screen.getByText("Save");
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(global.alert).toHaveBeenCalledWith("Failed to send email. Please try again.")
    );
  });
});
