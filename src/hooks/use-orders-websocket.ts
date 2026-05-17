import { useEffect, useRef, useState } from 'react';

type TUseOrdersWebSocketParams = {
  enabled?: boolean;
  onClose?: () => void;
  onMessage: (data: string) => void;
  onOpen?: () => void;
  onError?: (error: string) => void;
  reconnectDelay?: number;
  url: string | null;
};

export const useOrdersWebSocket = ({
  url,
  onMessage,
  onOpen,
  onClose,
  onError,
  enabled = true,
  reconnectDelay = 3000
}: TUseOrdersWebSocketParams) => {
  const [reconnectKey, setReconnectKey] = useState(0);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const handlersRef = useRef({
    onClose,
    onError,
    onMessage,
    onOpen
  });

  useEffect(() => {
    handlersRef.current = {
      onClose,
      onError,
      onMessage,
      onOpen
    };
  }, [onClose, onError, onMessage, onOpen]);

  useEffect(() => {
    if (!enabled || !url) {
      return;
    }

    let socket: WebSocket | null = null;
    let shouldReconnect = true;

    const clearReconnectTimeout = () => {
      if (reconnectTimeoutRef.current !== null) {
        window.clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };

    const connect = () => {
      clearReconnectTimeout();
      socket = new WebSocket(url);

      socket.onopen = () => {
        handlersRef.current.onOpen?.();
      };

      socket.onmessage = (event) => {
        handlersRef.current.onMessage(event.data);
      };

      socket.onerror = () => {
        handlersRef.current.onError?.('WebSocket connection error');
      };

      socket.onclose = () => {
        handlersRef.current.onClose?.();

        if (shouldReconnect) {
          reconnectTimeoutRef.current = window.setTimeout(
            connect,
            reconnectDelay
          );
        }
      };
    };

    connect();

    return () => {
      shouldReconnect = false;
      clearReconnectTimeout();
      socket?.close();
    };
  }, [enabled, reconnectDelay, reconnectKey, url]);

  return {
    reconnect: () => setReconnectKey((value) => value + 1)
  };
};
