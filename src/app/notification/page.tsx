'use client';

import React from 'react';
import { useAuth } from '../context/auth-provider';
import NotificationList from '../components/notification/notification-list';

/**
 * 予約通知一覧ページ
 * @returns JSX
 */
const NotificationListPage = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <div>ログインが必要です。</div>;
    }

    return (
        <NotificationList /> 
    );
}

export default NotificationListPage;