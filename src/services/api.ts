import axios from 'axios';
import { config } from '@/config';

export const coincapApi = axios.create({
  baseURL: config.COINCAP_BASE_URL,
  params: {
    apiKey: config.COINCAP_API_KEY,
  },
});

export const coingeckoApi = axios.create({
  baseURL: config.COINGECKO_BASE_URL,
});

export interface CryptoData {
  currentPrice: number;
  percentageChange24h: number;
  marketCap: number;
  circulatingSupply: number;
  tradingVolume: number;
  historicalData: number[];
  description: string;
  iconUrl: string;
  currencyRank: number;
  athPrice: number;
  athDate: string;
  maxSupply: number;
}

export interface HistoricalDataEntry {
  priceUsd: string;
  time: number;
  date: string;
}
