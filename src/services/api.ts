import axios, { AxiosError } from 'axios';

interface ChartData {
  labels: string[];
  prices: number[];
}

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  timeout: 10000,
  headers: {
    Accept: 'application/json',
  },
});

// Add response interceptor for rate limiting
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 429) {
      // Rate limited - wait for a bit and retry
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return api.request(error.config!);
    }
    return Promise.reject(error);
  },
);

export const fetchCryptoData = async (
  cryptoId: string,
  days: number,
): Promise<ChartData> => {
  try {
    const response = await api.get(`/coins/${cryptoId}/market_chart`, {
      params: {
        vs_currency: 'usd',
        days: days,
        interval: days > 90 ? 'daily' : 'hourly',
      },
    });

    const prices = response.data.prices.map(
      (price: [number, number]) => price[1],
    );
    const labels = response.data.prices.map((price: [number, number]) => {
      const date = new Date(price[0]);
      return date.toLocaleDateString();
    });

    return {
      labels,
      prices,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        throw new Error(`Cryptocurrency ${cryptoId} not found`);
      }
      if (error.response?.status === 401) {
        throw new Error('API key required or invalid');
      }
    }
    throw error;
  }
};

// Fetch simple price data
export const fetchSimplePrices = async (
  ids: string[],
): Promise<Record<string, number>> => {
  try {
    const response = await api.get('/simple/price', {
      params: {
        ids: ids.join(','),
        vs_currencies: 'usd',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching prices:', error);
    return {};
  }
};

// Fetch coin details
export const fetchCoinDetails = async (id: string) => {
  try {
    const response = await api.get(`/coins/${id}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: false,
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      throw new Error(`Cryptocurrency ${id} not found`);
    }
    throw error;
  }
};
