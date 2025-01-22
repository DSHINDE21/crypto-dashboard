import axios from 'axios';

// Fetch current price, percentage change, market cap, supply, and volume
export const fetchCryptoData = async (cryptoId: string) => {
  // Fetch basic info from CoinCap API
  const currentResponse = await axios.get(
    `https://api.coincap.io/v2/assets/${cryptoId}`,
  );

  const currentPrice = parseFloat(currentResponse.data.data.priceUsd);
  const percentageChange24h = parseFloat(
    currentResponse.data.data.changePercent24Hr,
  );
  const marketCap = parseFloat(currentResponse.data.data.marketCapUsd);
  const circulatingSupply = parseFloat(currentResponse.data.data.supply);
  const tradingVolume = parseFloat(currentResponse.data.data.volumeUsd24Hr);

  // Fetch description from CoinGecko API
  const descriptionResponse = await axios.get(
    `https://api.coingecko.com/api/v3/coins/${cryptoId}`,
  );

  const description =
    descriptionResponse.data?.description?.en || 'Description not available';

  // Fetch historical data (last 7 days)
  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

  const historicalResponse = await axios.get(
    `https://api.coincap.io/v2/assets/${cryptoId}/history`,
    {
      params: {
        interval: 'd1', // Daily intervals
        start: sevenDaysAgo,
        end: now,
      },
    },
  );

  const historicalData = historicalResponse.data.data.map((entry: any) =>
    parseFloat(entry.priceUsd),
  );

  return {
    currentPrice,
    percentageChange24h,
    marketCap,
    circulatingSupply,
    tradingVolume,
    historicalData,
    description,
  };
};
