import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import io, { Socket } from 'socket.io-client';

const SOCKET_URL = 'https://ai.birliksocket.com';

export type WebSocketEvent = 
  | 'ai-feed'
  | 'xp-update'
  | 'mission-update'
  | 'notification'
  | 'market-update'
  | 'system-status';

export interface WebSocketMessage {
  type: WebSocketEvent;
  message: string;
  data?: any;
  timestamp: string;
}

export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

interface WebSocketContextType {
  socket: Socket | null;
  status: ConnectionStatus;
  messages: Record<WebSocketEvent, WebSocketMessage[]>;
  connect: () => void;
  disconnect: () => void;
  sendMessage: (event: WebSocketEvent, data: any) => void;
  clearMessages: (event?: WebSocketEvent) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

interface WebSocketProviderProps {
  children: ReactNode;
  autoConnect?: boolean;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ 
  children, 
  autoConnect = true 
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [messages, setMessages] = useState<Record<WebSocketEvent, WebSocketMessage[]>>({
    'ai-feed': [],
    'xp-update': [],
    'mission-update': [],
    'notification': [],
    'market-update': [],
    'system-status': []
  });

  const connect = () => {
    if (socket) return;

    setStatus('connecting');
    
    const socketInstance = io(SOCKET_URL, { 
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000
    });

    socketInstance.on('connect', () => {
      setStatus('connected');
      console.log('WebSocket connected');
    });

    socketInstance.on('disconnect', () => {
      setStatus('disconnected');
      console.log('WebSocket disconnected');
    });

    socketInstance.on('connect_error', (error) => {
      setStatus('error');
      console.error('WebSocket connection error:', error);
    });

    const eventTypes: WebSocketEvent[] = [
      'ai-feed', 
      'xp-update', 
      'mission-update', 
      'notification',
      'market-update',
      'system-status'
    ];

    eventTypes.forEach(eventType => {
      socketInstance.on(eventType, (data: any) => {
        const message: WebSocketMessage = {
          type: eventType,
          message: data.message || '',
          data: data,
          timestamp: new Date().toISOString()
        };

        setMessages(prev => ({
          ...prev,
          [eventType]: [...prev[eventType], message].slice(-50) // Keep last 50 messages
        }));
      });
    });

    setSocket(socketInstance);
  };

  const disconnect = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setStatus('disconnected');
    }
  };

  const sendMessage = (event: WebSocketEvent, data: any) => {
    if (socket && status === 'connected') {
      socket.emit(event, data);
    } else {
      console.warn('Cannot send message: WebSocket not connected');
    }
  };

  const clearMessages = (event?: WebSocketEvent) => {
    if (event) {
      setMessages(prev => ({
        ...prev,
        [event]: []
      }));
    } else {
      setMessages({
        'ai-feed': [],
        'xp-update': [],
        'mission-update': [],
        'notification': [],
        'market-update': [],
        'system-status': []
      });
    }
  };

  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{
      socket,
      status,
      messages,
      connect,
      disconnect,
      sendMessage,
      clearMessages
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  
  return context;
};

export const useAIFeed = () => {
  const { messages } = useWebSocket();
  return messages['ai-feed'];
};

export const useXPUpdates = () => {
  const { messages } = useWebSocket();
  return messages['xp-update'];
};

export const useMissionUpdates = () => {
  const { messages } = useWebSocket();
  return messages['mission-update'];
};

export const useNotifications = () => {
  const { messages } = useWebSocket();
  return messages['notification'];
};

export const createSocketConnection = (url = SOCKET_URL): Socket => {
  return io(url, { 
    transports: ['websocket'],
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  });
};
