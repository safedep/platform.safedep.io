import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import Onboard from '../page';


jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@auth0/nextjs-auth0/client', () => ({
  useUser: jest.fn(),
}));

global.fetch = jest.fn();

const placeholderText = {
  name: 'John Doe',
  organization: 'Example Inc',
  domain: 'example.com',
};

describe('Onboard Component', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  const mockUser = {
    name: 'Test User',
    email: 'test@example.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useUser as jest.Mock).mockReturnValue({
      user: mockUser,
      isLoading: false,
    });
  });

  test('renders onboarding form with user name', () => {
    render(<Onboard />);
    expect(screen.getByText(`Welcome, ${mockUser.name}! Please fill in the details to onboard.`)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(placeholderText.name)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(placeholderText.organization)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(placeholderText.domain)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
  });

  test('redirects to home page when no user is logged in', () => {
    (useUser as jest.Mock).mockReturnValue({
      user: null,
      isLoading: false,
    });

    render(<Onboard />);
    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });

  test('handles form submission successfully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({ domain: 'example.com' }),
    });

    render(<Onboard />);

    fireEvent.change(screen.getByPlaceholderText(placeholderText.name), {
      target: { value: placeholderText.name }
    });

    fireEvent.change(screen.getByPlaceholderText(placeholderText.organization), {
      target: { value: placeholderText.organization }
    });

    fireEvent.change(screen.getByPlaceholderText(placeholderText.domain), {
      target: { value: placeholderText.domain }
    });

    fireEvent.click(screen.getByRole('button', { name: 'Create' }));
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/onboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: placeholderText.name,
          organizationName: placeholderText.organization,
          organizationDomain: placeholderText.domain,
        }),
      });
    });
  });

  test('handles form submission error', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValue({ message: 'Error details' }),
    });

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    render(<Onboard />);
    fireEvent.change(screen.getByPlaceholderText(placeholderText.name), {
      target: { value: placeholderText.name }
    });

    fireEvent.change(screen.getByPlaceholderText(placeholderText.organization), {
      target: { value: placeholderText.organization }
    });

    fireEvent.change(screen.getByPlaceholderText(placeholderText.domain), {
      target: { value: placeholderText.domain }
    });

    fireEvent.click(screen.getByRole('button', { name: 'Create' }));
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to onboard'),
        expect.any(String));
    });

    consoleErrorSpy.mockRestore();
  });

  test('handles network error during submission', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    render(<Onboard />);

    fireEvent.change(screen.getByPlaceholderText(placeholderText.name), {
      target: { value: placeholderText.name }
    });

    fireEvent.change(screen.getByPlaceholderText(placeholderText.organization), {
      target: { value: placeholderText.organization }
    });

    fireEvent.change(screen.getByPlaceholderText(placeholderText.domain), {
      target: { value: placeholderText.domain }
    });

    fireEvent.click(screen.getByRole('button', { name: 'Create' }));
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Error occurred while onboarding'),
        expect.any(String));
    });

    consoleErrorSpy.mockRestore();
  });

  test('logout link is present', () => {
    render(<Onboard />);
    expect(screen.getByRole('link', { name: 'Sign out' })).toBeInTheDocument();
  });
});
