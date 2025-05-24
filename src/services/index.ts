import { config } from '@/config';
import axios from 'axios';

interface HistoricalDataEntry {
  priceUsd: string;
  time: number;
  date: string;
}

export const fetchCryptoData = async (
  cryptoId: string,
  dateRange: number = 7,
) => {
  // Fetch basic info from CoinCap API
  const currentResponse = await axios.get(
    `${config.COINCAP_BASE_URL}/v3/assets/${cryptoId}`,
    {
      params: {
        apiKey: config.COINCAP_API_KEY,
      },
    },
  );

  const currentPrice = parseFloat(currentResponse.data.data.priceUsd);

  const percentageChange24h = parseFloat(
    currentResponse.data.data.changePercent24Hr,
  );
  const marketCap = parseFloat(currentResponse.data.data.marketCapUsd);
  const circulatingSupply = parseFloat(currentResponse.data.data.supply);
  const tradingVolume = parseFloat(currentResponse.data.data.volumeUsd24Hr);
  const currencyRank = parseFloat(currentResponse.data.data.rank);
  const maxSupply = parseFloat(currentResponse.data.data?.maxSupply);

  // Fetch description and icon from CoinGecko API
  const descriptionResponse = await axios.get(
    `${config.COINGECKO_BASE_URL}/api/v3/coins/${cryptoId}`,
  );

  const description =
    descriptionResponse.data?.description?.en || 'Description not available';
  const iconUrl = descriptionResponse.data?.image?.small; // Get the small icon URL

  // Get All-time High (ATH) data from CoinGecko
  const athPrice = descriptionResponse.data?.market_data?.ath?.usd || 0; // ATH in USD
  const athDate = descriptionResponse.data?.market_data?.ath_date?.usd; // ATH date

  // Fetch historical data based on date range
  const now = Date.now();
  const startDate = now - dateRange * 24 * 60 * 60 * 1000;

  const historicalResponse = await axios.get(
    `${config.COINCAP_BASE_URL}/v3/assets/${cryptoId}/history`,
    {
      params: {
        interval: 'd1', // Daily intervals
        start: startDate,
        end: now,
        apiKey: config.COINCAP_API_KEY,
      },
    },
  );

  const historicalData = historicalResponse.data.data.map(
    (entry: HistoricalDataEntry) => parseFloat(entry.priceUsd),
  );

  return {
    currentPrice,
    percentageChange24h,
    marketCap,
    circulatingSupply,
    tradingVolume,
    historicalData,
    description,
    iconUrl,
    currencyRank,
    athPrice,
    athDate,
    maxSupply,
  };
};
