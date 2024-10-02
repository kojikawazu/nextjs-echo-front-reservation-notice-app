import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import LoginForm from '@/app/components/user/login-form';

// モックの設定
jest.mock('axios');
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

describe('LoginForm', () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    const mockedRouter = useRouter as jest.Mock;

    beforeEach(() => {
        mockedRouter.mockReturnValue({ push: jest.fn() });
    });

    it('renders the login form', () => {
        render(<LoginForm />);

        expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument();
        expect(screen.getByLabelText('パスワード')).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'ログイン' })
        ).toBeInTheDocument();
    });

    it('shows an error message for invalid email format', async () => {
        render(<LoginForm />);

        fireEvent.change(screen.getByLabelText('メールアドレス'), {
            target: { value: 'invalid@example' },
        });
        fireEvent.change(screen.getByLabelText('パスワード'), {
            target: { value: 'password123' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'ログイン' }));

        // エラーメッセージが部分一致するかどうか確認
        expect(
            await screen.findByText((content, element) =>
                content.includes('正しいメールアドレスを入力してください')
            )
        ).toBeInTheDocument();
    });

    it('shows an error message for short password', async () => {
        render(<LoginForm />);

        fireEvent.change(screen.getByLabelText('メールアドレス'), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByLabelText('パスワード'), {
            target: { value: 'short' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'ログイン' }));

        expect(
            await screen.findByText('パスワードは6文字以上にしてください')
        ).toBeInTheDocument();
    });

    it('redirects to /reservation on successful login', async () => {
        mockedAxios.post.mockResolvedValueOnce({ status: 200 });

        render(<LoginForm />);

        fireEvent.change(screen.getByLabelText('メールアドレス'), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByLabelText('パスワード'), {
            target: { value: 'password123' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'ログイン' }));

        await waitFor(() => {
            expect(mockedRouter().push).toHaveBeenCalledWith('/reservation');
        });
    });

    it('shows an error message on failed login', async () => {
        mockedAxios.post.mockRejectedValueOnce(new Error('Login failed'));

        render(<LoginForm />);

        fireEvent.change(screen.getByLabelText('メールアドレス'), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByLabelText('パスワード'), {
            target: { value: 'password123' },
        });
    });
});
