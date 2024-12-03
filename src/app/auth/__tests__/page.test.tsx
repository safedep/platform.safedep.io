import '@testing-library/jest-dom';
import { render, screen } from "@testing-library/react";
import { describe } from "node:test";
import Auth from "../page";

describe("AuthPage", () => {
  it("renders welcome text", () => {
    render(<Auth />);

    const heading = screen.getByRole("heading", { name: /welcome to safedep/i });
    expect(heading).toBeInTheDocument();
  })
})
