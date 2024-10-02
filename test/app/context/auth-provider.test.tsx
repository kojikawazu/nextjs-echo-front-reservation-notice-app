import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/app/context/auth-provider';

// axiosをモック
jest.mock('axios');
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    usePathname: jest.fn(() => '/some-other-page'),
}));

const MockComponent = () => {
    const { isAuthenticated, loading, username } = useAuth();
    if (loading) return <div>Loading...</div>;
    return (
        <div>
            <h1>
                {isAuthenticated ? `Welcome, ${username}` : 'Please log in'}
            </h1>
        </div>
    );
};

describe('AuthProvider', () => {
    const mockedRouter = { push: jest.fn() };
    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue(mockedRouter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('shows loading state initially', () => {
        render(
            <AuthProvider>
                <MockComponent />
            </AuthProvider>
        );

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('sets authentication status and username when API call succeeds', async () => {
        (axios.get as jest.Mock).mockResolvedValueOnce({
            status: 200,
            data: { username: '田中' },
        });

        render(
            <AuthProvider>
                <MockComponent />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('Welcome, 田中')).toBeInTheDocument();
        });
    });

    it('redirects to login when authentication fails', async () => {
        (axios.get as jest.Mock).mockRejectedValueOnce(
            new Error('Authentication error')
        );

        render(
            <AuthProvider>
                <MockComponent />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(mockedRouter.push).toHaveBeenCalledWith('/user/login');
        });
    });

    it('redirects to login when not authenticated and in protected route', async () => {
        // モックされたAPI呼び出しの結果を設定
        (axios.get as jest.Mock).mockResolvedValueOnce({
            status: 200,
            data: { username: null },
        });

        render(
            <AuthProvider>
                <MockComponent />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(mockedRouter.push).toHaveBeenCalledWith('/user/login');
        });
    });
});
