import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import AuthError from '../page'

// Mock useSearchParams from next/navigation
jest.mock('next/navigation', () => ({
    useSearchParams: jest.fn(),
}))

describe('AuthError Component', () => {
    it('renders with a default error message when no message is provided', () => {
        (useSearchParams as jest.Mock).mockReturnValue({
            get: jest.fn().mockReturnValue(null),
        })

        render(<AuthError />)

        expect(screen.getByText('Authentication Error')).toBeInTheDocument()
        expect(screen.getByText('An unknown error occurred')).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /Return to Sign In/i })).toBeInTheDocument()
    })

    it('renders with a specific error message from search params', () => {
        (useSearchParams as jest.Mock).mockReturnValue({
            get: jest.fn().mockReturnValue(encodeURIComponent('Invalid credentials')),
        })

        render(<AuthError />)

        expect(screen.getByText('Authentication Error')).toBeInTheDocument()
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /Return to Sign In/i })).toBeInTheDocument()
    })

    it('renders the fallback loading state', () => {
        (useSearchParams as jest.Mock).mockImplementation(() => {
            throw new Promise(() => {}); // Never resolves, forcing Suspense
        });

        const { container } = render(
            <Suspense fallback={<div>Loading...</div>}>
                <AuthError />
            </Suspense>
        )

        expect(container).toHaveTextContent('Loading...')
    })
})
