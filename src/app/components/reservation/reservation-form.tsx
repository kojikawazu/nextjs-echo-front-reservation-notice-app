'use client';

import React, { useState } from 'react';
import axios from 'axios';

/**
 * 予約情報フォームコンポーネント
 * @returns JSX
 */
const ReservertionForm = () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const userId = process.env.NEXT_PUBLIC_USER_ID || ''; // ログインユーザは未実装。その為、ユーザIDは環境変数から取得

    const [reservationDate, setReservationDate] = useState(''); // 予約日
    const [numPeople, setNumPeople] = useState(1); // 人数
    const [specialRequest, setSpecialRequest] = useState(''); // 特別リクエスト
    const [status] = useState('pending'); // ステータス
    const [message, setMessage] = useState(''); // メッセージ表示用

    // フォーム送信ハンドラー
    const handleSubmit = async () => {
        if (!userId) {
            setMessage('ユーザーIDが指定されていません。環境変数を確認してください。');
            return;
        }

        try {
            // 予約日をGoで対応できるフォーマットに変換
            // "YYYY-MM-DDTHH:MM" -> "YYYY-MM-DD HH:MM:SS"
            const formattedDate = reservationDate.replace('T', ' ') + ":00"; 

            // サーバーにPOSTリクエストを送信
            await axios.post(`${API_URL}/api/reservation`, {
                user_id: userId,
                reservation_date: formattedDate,
                num_people: numPeople,
                special_request: specialRequest,
                status,
            });
            setMessage('予約が正常に作成されました');
        } catch (error) {
            setMessage('予約の作成に失敗しました');
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-3xl font-bold mb-4">予約情報を作成</h1>
        
            <input
                className="border-2 border-gray-300 p-2 mb-4"
                type="datetime-local"
                value={reservationDate}
                onChange={(e) => setReservationDate(e.target.value)}
                placeholder="予約日"
            />
            <input
                className="border-2 border-gray-300 p-2 mb-4"
                type="number"
                value={numPeople}
                onChange={(e) => setNumPeople(parseInt(e.target.value))}
                placeholder="人数"
            />
            <input
                className="border-2 border-gray-300 p-2 mb-4"
                type="text"
                value={specialRequest}
                onChange={(e) => setSpecialRequest(e.target.value)}
                placeholder="特別リクエスト"
            />
        
            <button
                className="bg-blue-500 text-white p-2 rounded"
                onClick={handleSubmit}
            >
                予約を作成
            </button>
        
            {/* メッセージ表示 */}
            <div className="mt-4 text-lg">{message}</div>
        </div>
    );
}

export default ReservertionForm;