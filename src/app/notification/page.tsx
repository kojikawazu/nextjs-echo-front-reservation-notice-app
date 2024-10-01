'use client';

import React from 'react';
import { useAuth } from '@/app/context/auth-provider';
import Header from '@/app/components/layout/header';
import NotificationList from '@/app/components/notification/notification-list';

/**
 * 予約通知一覧ページ
 * @returns JSX
 */
const NotificationListPage = () => {
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
                <NotificationList /> 
            </main>
        </>
        
    );
}

export default NotificationListPage;