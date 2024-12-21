import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Page from '../page';

describe('Page Component', () => {
    it('renders the main elements correctly', () => {
        render(<Page />);

        // Check for the title
        expect(screen.getByText('Verify your email')).toBeInTheDocument();

        // Check for the description
        expect(screen.getByText(/We ve sent you a verification link/i)).toBeInTheDocument();

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
        global.window = Object.create(window);
        const mockHref = jest.fn();
        Object.defineProperty(window, 'location', {
            value: { href: '', assign: mockHref },
            writable: true,
        });

        render(<Page />);
        const loginButton = screen.getByRole('button', { name: /Continue to Login/i });
        fireEvent.click(loginButton);

        Object.defineProperty(window.location, 'href', {
            set: mockHref,
        });

    });

    it('redirects to home when "Return to Home" button is clicked', () => {
        global.window = Object.create(window);
        const mockHref = jest.fn();
        Object.defineProperty(window, 'location', {
            value: { href: '', assign: mockHref },
            writable: true,
        });

        render(<Page />);
        const homeButton = screen.getByRole('button', { name: /Return to Home/i });
        fireEvent.click(homeButton);

        expect(mockHref).toHaveBeenCalledWith('/');
    });
});
