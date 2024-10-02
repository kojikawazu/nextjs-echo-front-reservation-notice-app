import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import ReservertionForm from '@/app/components/reservation/reservation-form';

jest.mock('axios');

describe('ReservertionForm', () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>;

    it('submits the form successfully and shows success message', async () => {
        mockedAxios.post.mockResolvedValueOnce({ status: 200 });

        render(<ReservertionForm />);

        // 予約日を入力
        const dateInput = screen.getByPlaceholderText('予約日');
        fireEvent.change(dateInput, { target: { value: '2024-10-02T12:00' } });

        // 人数を入力
        const numPeopleInput = screen.getByPlaceholderText('人数');
        fireEvent.change(numPeopleInput, { target: { value: '4' } });

        // 特別リクエストを入力
        const specialRequestInput =
            screen.getByPlaceholderText('特別リクエスト');
        fireEvent.change(specialRequestInput, {
            target: { value: 'ベジタリアンメニューをお願いします' },
        });

        // 送信ボタンをクリック
        const submitButton = screen.getByText('予約を作成');
        fireEvent.click(submitButton);

        // 成功メッセージが表示されるのを確認
        await waitFor(() => {
            expect(
                screen.getByText('予約が正常に作成されました')
            ).toBeInTheDocument();
        });
    });

    it('shows an error message when form submission fails', async () => {
        mockedAxios.post.mockRejectedValueOnce(new Error('Error submitting'));

        render(<ReservertionForm />);

        // 予約日を入力
        const dateInput = screen.getByPlaceholderText('予約日');
        fireEvent.change(dateInput, { target: { value: '2024-10-02T12:00' } });

        // 人数を入力
        const numPeopleInput = screen.getByPlaceholderText('人数');
        fireEvent.change(numPeopleInput, { target: { value: '4' } });

        // 特別リクエストを入力
        const specialRequestInput =
            screen.getByPlaceholderText('特別リクエスト');
        fireEvent.change(specialRequestInput, {
            target: { value: 'ベジタリアンメニューをお願いします' },
        });

        // 送信ボタンをクリック
        const submitButton = screen.getByText('予約を作成');
        fireEvent.click(submitButton);

        // エラーメッセージが表示されるのを確認
        await waitFor(() => {
            expect(
                screen.getByText('予約の作成に失敗しました')
            ).toBeInTheDocument();
        });
    });
});
