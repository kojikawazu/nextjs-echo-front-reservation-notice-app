// 予約情報の型定義
export interface ReservationData {
    user_id: string;
    reservation_date: string;
    num_people: number;
    special_request: string;
    status: string;
}

// 通知データの型定義
export interface NotificationData {
    message: string;
}

// 通知データの型定義(WebSocket用)
export interface NotificationWebsocketData {
    content: string;
}
