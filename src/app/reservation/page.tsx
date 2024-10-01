'use client';

import React from 'react';
import { useAuth } from '@/app/context/auth-provider';
import Header from '@/app/components/layout/header';
import ReservationList from '@/app/components/reservation/reservation-list';

/**
 * 予約情報リストページ
 * @returns JSX
 */
const ReservationListPage = () => {
    const { isAuthenticated, loading, username } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <div>ログインが必要です。</div>;
    }

    return (
        <>
            <Header username={username ? username : ""} />
            <main className="container mx-auto p-4">
                <ReservationList />
            </main>
        </>
    );
}

export default ReservationListPage;