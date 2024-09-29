'use client';

import { useState, useEffect, useRef } from 'react';

const WebSocketComponent = () => {
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectInterval = useRef<NodeJS.Timeout | null>(null);

  // WebSocketの初期化と再接続処理
  const initWebSocket = () => {
    const ws = new WebSocket('ws://localhost:8080/ws');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connection opened');
      if (reconnectInterval.current) {
        clearInterval(reconnectInterval.current);
        reconnectInterval.current = null;
      }
    };

    ws.onmessage = (event: MessageEvent) => {
      try {
        const messageData = JSON.parse(event.data); // JSONとしてメッセージをパース
        if (messageData && messageData.content) {
          setReceivedMessages((prevMessages) => [...prevMessages, messageData.content]);
        }
        console.log('Received from server:', messageData);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      if (!reconnectInterval.current) {
        reconnectInterval.current = setInterval(initWebSocket, 5000); // 5秒後に再接続
      }
    };

    ws.onerror = () => {
      console.error('WebSocket encountered an error');
      ws.close();
    };
  };

  useEffect(() => {
    initWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectInterval.current) {
        clearInterval(reconnectInterval.current);
      }
    };
  }, []);

  const sendMessage = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
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
      <input
        className="border-2 border-gray-300 p-2 mb-4"
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter a message"
      />
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
