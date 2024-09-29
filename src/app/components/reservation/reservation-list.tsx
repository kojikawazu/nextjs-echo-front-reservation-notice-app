'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { ReservationData } from '@/app/types/types';

/**
 * 予約情報リストコンポーネント
 * @returns JSX
 */
const ReservationList = () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const [reservations, setReservations] = useState<ReservationData[]>([]);

    // 予約情報を取得するための関数
    const fetchReservations = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/reservations`);
            const data: ReservationData[] = response.data;
            setReservations(data);
        } catch (error) {
            console.error('予約情報の取得に失敗しました', error);
        }
    };

    // コンポーネントがマウントされた時に予約情報を取得
    useEffect(() => {
        fetchReservations();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-3xl font-bold mb-4">予約リスト</h1>
            <ul>
                {reservations.map((reservation, index) => (
                    <li key={index} className="border p-4 mb-4">
                        <p>ユーザーID: ***</p>
                        <p>予約日: {reservation.reservation_date}</p>
                        <p>人数: {reservation.num_people}</p>
                        <p>特別リクエスト: {reservation.special_request}</p>
                        <p>ステータス: {reservation.status}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ReservationList;