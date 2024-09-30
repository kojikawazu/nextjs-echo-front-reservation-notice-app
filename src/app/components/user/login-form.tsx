'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

/**
 * ログインフォームコンポーネント
 * @returns JSX
 */
const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validatePassword = (password: string) => {
        return password.length >= 6;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!validateEmail(email)) {
            setErrorMessage('正しいメールアドレスを入力してください');
            return;
        }

        if (!validatePassword(password)) {
            setErrorMessage('パスワードは6文字以上にしてください');
            return;
        }

        try {
            // APIにリクエストを送信
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
                email,
                password,
            }, { withCredentials: true });

            if (response.status === 200) {
                // ログイン成功時、ホームページにリダイレクト
                router.push('/');
            } else {
                setErrorMessage('ログインに失敗しました。もう一度お試しください。');
            }
        } catch (error) {
            console.log(error);
            setErrorMessage('ログインに失敗しました。もう一度お試しください。');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-4 bg-white shadow-md rounded">
                <h2 className="text-2xl font-bold text-center">ログイン</h2>

                {errorMessage && (
                    <div className="text-red-500 text-center">{errorMessage}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">メールアドレス</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">パスワード</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600"
                    >
                        ログイン
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;
