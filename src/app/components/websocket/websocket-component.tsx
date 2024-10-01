'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * WebSocketComponent
 * @returns JSX
 */
const WebSocketComponent = () => {
   // 環境変数からWebSocketのURLを取得
   const WS_URL = `${process.env.NEXT_PUBLIC_WS_URL}/ws` || 'ws://localhost:8080/ws'; // デフォルトURLを設定
  // ユーザーが送信するメッセージを保持するステート
  const [message, setMessage] = useState('');
  // サーバーから受信したメッセージを保持するステート
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);
  // WebSocketの参照。再接続時やクローズ処理に使用
  const wsRef = useRef<WebSocket | null>(null);
  // 再接続のためのタイマーを保持
  const reconnectInterval = useRef<NodeJS.Timeout | null>(null);

  // WebSocketの初期化と再接続処理
  const initWebSocket = () => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    // WebSocket接続が確立したときに呼ばれる
    ws.onopen = () => {
      console.log('WebSocket connection opened');

      // 再接続のタイマーが動作していればクリアする
      if (reconnectInterval.current) {
        clearInterval(reconnectInterval.current);
        reconnectInterval.current = null;
      }
    };

    // サーバーからメッセージを受信したときに呼ばれる
    ws.onmessage = (event: MessageEvent) => {
      try {
        // メッセージをJSON形式としてパース
        const messageData = JSON.parse(event.data);
        // 受信したメッセージのコンテンツがある場合にそれを保存
        if (messageData && messageData.content) {
          setReceivedMessages((prevMessages) => [...prevMessages, messageData.content]);
        }
        console.log('Received from server:', messageData);
      } catch (error) {
        // メッセージがJSON形式でない場合のエラー処理
        console.error('Error parsing message:', error);
      }
    };

    // WebSocket接続が切断されたときに呼ばれる
    ws.onclose = () => {
      console.log('WebSocket connection closed');

      // 再接続処理を開始
      if (!reconnectInterval.current) {
        reconnectInterval.current = setInterval(initWebSocket, 5000); // 5秒後に再接続
      }
    };

    // WebSocketにエラーが発生したときに呼ばれる
    ws.onerror = () => {
      console.error('WebSocket encountered an error');
      ws.close();
    };
  };

  // コンポーネントがマウントされたときにWebSocketを初期化
  useEffect(() => {
    initWebSocket();

    // コンポーネントがアンマウントされたときにWebSocketとタイマーをクリーンアップ
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectInterval.current) {
        clearInterval(reconnectInterval.current);
      }
    };
  }, []);

  // メッセージをサーバーに送信する処理
  const sendMessage = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      // 送信するメッセージのデータをJSON形式で作成
      const messageData = {
        type: 'debug',
        message,
      };
      wsRef.current.send(JSON.stringify(messageData));
      console.log('Sent to server:', message);
    } else {
      console.log('WebSocket is not connected');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">WebSocket Client</h1>

       {/* ユーザーがメッセージを入力するためのテキストボックス */}
      <input
        className="border-2 border-gray-300 p-2 mb-4"
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter a message"
      />

      {/* 送信ボタン */}
      <button
        className="bg-blue-500 text-white p-2 rounded"
        onClick={sendMessage}
      >
        Send Message
      </button>

      {/* 受信したすべてのメッセージを表示 */}
      <div className="mt-4 text-lg">
        <h2 className="font-bold">Received Messages:</h2>
        <ul>
          {receivedMessages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WebSocketComponent;
