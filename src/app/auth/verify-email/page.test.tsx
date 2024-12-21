import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Page from './page';

describe('Page Component', () => {
  it('renders the main elements correctly', () => {
    render(<Page />);

    // Check for the title
    expect(screen.getByText('Verify your email')).toBeInTheDocument();

    // Check for the description
    expect(screen.getByText(/We have sent a verification link/i)).toBeInTheDocument();

    // Check for the steps
    const steps = [
      'Open your email inbox',
      'Click the verification link we sent you',
      'Return here to continue',
    ];
    steps.forEach((step) => {
      expect(screen.getByText(step)).toBeInTheDocument();
    });

    // Check for the buttons
    expect(screen.getByRole('button', { name: /Continue to Login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Return to Home/i })).toBeInTheDocument();

    // Check for the help text
    expect(screen.getByText(/Didnt receive the email/i)).toBeInTheDocument();
  });

  it('redirects to login when "Continue to Login" button is clicked', () => {
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    });

    render(<Page />);

    const loginButton = screen.getByRole('button', { name: /Continue to Login/i });
    expect(loginButton).toBeInTheDocument();

    fireEvent.click(loginButton);
    expect(window.location.href).toBe('/api/auth/login');
  });

  it('redirects to home when "Return to Home" button is clicked', () => {
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    });

    render(<Page />);

    const homeButton = screen.getByRole('button', { name: /Return to Home/i });
    expect(homeButton).toBeInTheDocument();

    fireEvent.click(homeButton);
    expect(window.location.href).toBe('/');
  });
});
