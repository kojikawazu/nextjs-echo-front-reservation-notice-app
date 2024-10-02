'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

/**
 * ログアウトボタンコンポーネント
 * @returns JSX
 */
const LogoutButton = () => {
    const router = useRouter();
    const handleLogout = async () => {
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/logout`,
                {},
                {
                    withCredentials: true,
                }
            );

            if (response.status === 200) {
                router.push('/user/login');
            } else {
                console.error('ログアウトに失敗しました。');
            }
        } catch (error) {
            console.error('ログアウト中にエラーが発生しました: ', error);
        }
    };

    return (
        <button onClick={handleLogout} className="text-white hover:underline">
            ログアウト
        </button>
    );
};

export default LogoutButton;
