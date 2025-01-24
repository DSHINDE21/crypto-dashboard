import axios from 'axios';

export const fetchCryptoData = async (cryptoId: string, dateRange: number) => {
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

  // Fetch description and icon from CoinGecko API
  const descriptionResponse = await axios.get(
    `https://api.coingecko.com/api/v3/coins/${cryptoId}`,
  );

  const description =
    descriptionResponse.data?.description?.en || 'Description not available';
  const iconUrl = descriptionResponse.data?.image?.small; // Get the small icon URL

  // Fetch historical data based on date range
  const now = Date.now();
  const startDate = now - dateRange * 24 * 60 * 60 * 1000;

  const historicalResponse = await axios.get(
    `https://api.coincap.io/v2/assets/${cryptoId}/history`,
    {
      params: {
        interval: 'd1', // Daily intervals
        start: startDate,
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
    iconUrl, // Add iconUrl to the return data
  };
};
