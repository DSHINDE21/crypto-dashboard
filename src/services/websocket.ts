import { create } from 'zustand';

interface WebSocketStore {
  socket: WebSocket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

const WEBSOCKET_URL = 'wss://stream.binance.com:9443/ws';

export const useWebSocketStore = create<WebSocketStore>((set) => ({
  socket: null,
  isConnected: false,
  connect: () => {
    const socket = new WebSocket(WEBSOCKET_URL);

    socket.onopen = () => {
      console.log('WebSocket Connected');
      set({ isConnected: true });

      // Subscribe to crypto pair streams
      const subscribeMessage = {
        method: 'SUBSCRIBE',
        params: ['btcusdt@trade', 'ethusdt@trade', 'bnbusdt@trade'],
        id: 1,
      };
      socket.send(JSON.stringify(subscribeMessage));
    };

    socket.onclose = () => {
      console.log('WebSocket Disconnected');
      set({ isConnected: false, socket: null });
    };

    socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    set({ socket });
  },
  disconnect: () => {
    const { socket } = useWebSocketStore.getState();
    if (socket) {
      socket.close();
      set({ socket: null, isConnected: false });
    }
  },
}));
