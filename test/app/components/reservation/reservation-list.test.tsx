import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import ReservationList from '@/app/components/reservation/reservation-list';

// モックの設定
jest.mock('axios');

describe('ReservationList', () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>;

    it('fetches and displays reservation data', async () => {
        // モックデータ
        const mockReservations = [
            {
                reservation_date: '2024-10-02',
                num_people: 4,
                special_request: 'ベジタリアンメニューをお願いします',
                status: 'confirmed',
            },
            {
                reservation_date: '2024-10-05',
                num_people: 2,
                special_request: '静かな席を希望します',
                status: 'pending',
            },
        ];

        // Axiosのモック設定
        mockedAxios.get.mockResolvedValueOnce({ data: mockReservations });

        render(<ReservationList />);

        // データ取得後の予約情報が表示されるのを待機
        await waitFor(() => {
            const userIdElements = screen.getAllByText('ユーザーID: ***');
            expect(userIdElements).toHaveLength(2); // 複数のユーザーIDが表示されることを確認
            expect(screen.getByText('予約日: 2024-10-02')).toBeInTheDocument();
            expect(screen.getByText('人数: 4')).toBeInTheDocument();
            expect(
                screen.getByText(
                    '特別リクエスト: ベジタリアンメニューをお願いします'
                )
            ).toBeInTheDocument();
            expect(
                screen.getByText('ステータス: confirmed')
            ).toBeInTheDocument();

            expect(screen.getByText('予約日: 2024-10-05')).toBeInTheDocument();
            expect(screen.getByText('人数: 2')).toBeInTheDocument();
            expect(
                screen.getByText('特別リクエスト: 静かな席を希望します')
            ).toBeInTheDocument();
            expect(screen.getByText('ステータス: pending')).toBeInTheDocument();
        });
    });

    it('shows an error message when fetching reservations fails', async () => {
        // Axiosのモック設定でエラーを投げる
        mockedAxios.get.mockRejectedValueOnce(new Error('Fetching error'));

        // コンポーネントのレンダリング
        render(<ReservationList />);

        // エラーメッセージが表示されるのを確認
        await waitFor(() => {
            expect(
                screen.getByText('予約情報の取得に失敗しました')
            ).toBeInTheDocument();
        });
    });
});
