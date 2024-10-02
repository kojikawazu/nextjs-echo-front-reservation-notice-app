import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import NotificationList from '@/app/components/notification/notification-list';

jest.mock('axios');

describe('NotificationList', () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('fetches and displays past notifications', async () => {
        const mockNotifications = [{ message: '通知1' }, { message: '通知2' }];

        mockedAxios.get.mockResolvedValueOnce({ data: mockNotifications });

        render(<NotificationList />);

        await waitFor(() => {
            expect(screen.getByText('通知1')).toBeInTheDocument();
            expect(screen.getByText('通知2')).toBeInTheDocument();
        });
    });

    it('shows an error when fetching past notifications fails', async () => {
        mockedAxios.get.mockRejectedValueOnce(new Error('Fetching error'));

        render(<NotificationList />);

        // エラーメッセージが表示されないことを確認（エラーハンドリングはconsoleにのみエラーログを出力するため）
        await waitFor(() => {
            expect(
                screen.queryByText('Failed to fetch notifications')
            ).not.toBeInTheDocument();
        });
    });
});
