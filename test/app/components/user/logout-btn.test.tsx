import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import LogoutButton from '@/app/components/user/logout-btn';

// axios と useRouter をモック化
jest.mock('axios');
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

describe('LogoutButton', () => {
    const mockPush = jest.fn();

    beforeEach(() => {
        // useRouter のモックを設定
        (useRouter as jest.Mock).mockReturnValue({
            push: mockPush,
        });
        // axios.post のモックをリセット
        (axios.post as jest.Mock).mockReset();
        // mockPush をリセット
        mockPush.mockReset();
    });

    it('API is called upon successful logout and redirected to the login page.', async () => {
        // axios.post のモックを成功レスポンスに設定
        (axios.post as jest.Mock).mockResolvedValue({ status: 200 });

        render(<LogoutButton />);

        const button = screen.getByRole('button', { name: /ログアウト/i });
        fireEvent.click(button);

        // axios.post が正しいURLとオプションで呼ばれたか確認
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                `${process.env.NEXT_PUBLIC_API_URL}/api/logout`,
                {},
                { withCredentials: true }
            );
        });

        // router.push が '/user/login' で呼ばれたか確認
        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/user/login');
        });
    });

    it('If the API response is anything other than 200, an error message is displayed.', async () => {
        // axios.post のモックを200以外のステータスに設定
        (axios.post as jest.Mock).mockResolvedValue({ status: 400 });

        // console.error をモック化
        const consoleErrorMock = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        render(<LogoutButton />);

        const button = screen.getByRole('button', { name: /ログアウト/i });
        fireEvent.click(button);

        // axios.post が呼ばれたことを確認
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalled();
        });

        // console.error が適切なメッセージで呼ばれたか確認
        await waitFor(() => {
            expect(consoleErrorMock).toHaveBeenCalledWith(
                'ログアウトに失敗しました。'
            );
        });

        // console.error のモックを復元
        consoleErrorMock.mockRestore();
    });

    it('If an error occurs during an API call, an error message is displayed.', async () => {
        // axios.post のモックをエラーに設定
        const error = new Error('Network Error');
        (axios.post as jest.Mock).mockRejectedValue(error);

        // console.error をモック化
        const consoleErrorMock = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        render(<LogoutButton />);

        const button = screen.getByRole('button', { name: /ログアウト/i });
        fireEvent.click(button);

        // axios.post が呼ばれたことを確認
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalled();
        });

        // console.error が適切なメッセージで呼ばれたか確認
        await waitFor(() => {
            expect(consoleErrorMock).toHaveBeenCalledWith(
                'ログアウト中にエラーが発生しました: ',
                error
            );
        });

        // console.error のモックを復元
        consoleErrorMock.mockRestore();
    });
});
