'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { NotificationData, NotificationWebsocketData } from '@/app/types/types';

/**
 * 予約通常リストコンポーネント
 * @returns JSX
 */
const NotificationList = () => {
    const [notifications, setNotifications] = useState<string[]>([]);
    const wsRef = useRef<WebSocket | null>(null);

    // WebSocketの初期化
    const initWebSocket = () => {
        const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/ws` || 'ws://localhost:8080/ws');
        wsRef.current = ws;

        ws.onopen = () => {
            console.log('WebSocket opened');
        };

        ws.onmessage = (event: MessageEvent) => {
            console.log('WebSocket message:', event.data);
            const messageData: NotificationWebsocketData = JSON.parse(event.data);
            if (messageData && messageData.content) {
                setNotifications((prev) => [...prev, messageData.content]);
            }
        };

        ws.onclose = () => {
            console.log('WebSocket closed');
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            ws.close();
        };
    };

    // 過去の通知を取得
    const fetchNotifications = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications`);
            const pastNotifications: NotificationData[] = response.data;
            setNotifications(pastNotifications.map((notification) => notification.message));
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    // WebSocketの初期化とクリーンアップ
    useEffect(() => {
        // 初回レンダリング時に過去の通知を取得
        fetchNotifications();
        // WebSocketの初期化
        initWebSocket();

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-3xl font-bold mb-4">通知リスト</h1>
            <ul>
                {notifications.map((notification, index) => (
                <li key={index} className="border p-4 mb-4">
                    {notification}
                </li>
                ))}
            </ul>
        </div>
    );
}

export default NotificationList;