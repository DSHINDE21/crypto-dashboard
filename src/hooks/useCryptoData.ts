import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useWebSocketStore } from '../services/websocket';
import axios from 'axios';

interface CryptoPrice {
  symbol: string;
  price: string;
  volume: string;
  change24h: string;
}

const fetchInitialPrices = async (): Promise<CryptoPrice[]> => {
  const response = await axios.get(
    'https://api.binance.com/api/v3/ticker/24hr?symbols=["BTCUSDT","ETHUSDT","BNBUSDT"]',
  );
  return response.data.map((item: any) => ({
    symbol: item.symbol,
    price: item.lastPrice,
    volume: item.volume,
    change24h: item.priceChangePercent,
  }));
};

export const useCryptoData = () => {
  const queryClient = useQueryClient();
  const { socket, connect, isConnected } = useWebSocketStore();

  useEffect(() => {
    if (!isConnected) {
      connect();
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.e === 'trade') {
          queryClient.setQueryData(
            ['cryptoPrices'],
            (old: CryptoPrice[] | undefined) => {
              if (!old) return old;
              return old.map((item) =>
                item.symbol === data.s ? { ...item, price: data.p } : item,
              );
            },
          );
        }
      };
    }
  }, [socket, queryClient]);

  return useQuery({
    queryKey: ['cryptoPrices'],
    queryFn: fetchInitialPrices,
    refetchInterval: 30000, // Fallback refresh every 30 seconds
    staleTime: Infinity, // Data is never considered stale since we update via WebSocket
  });
};
