import { useQuery } from '@tanstack/react-query';
import { coincapApi, coingeckoApi, CryptoData } from './api';

export const useCryptoData = (cryptoId: string, dateRange: number) => {
  return useQuery({
    queryKey: ['crypto', cryptoId, dateRange],
    queryFn: async (): Promise<CryptoData> => {
      const [currentResponse, descriptionResponse, historicalResponse] =
        await Promise.all([
          // Fetch basic info from CoinCap API
          coincapApi.get(`/v3/assets/${cryptoId}`),
          // Fetch description and icon from CoinGecko API
          coingeckoApi.get(`/api/v3/coins/${cryptoId}`),
          // Fetch historical data
          coincapApi.get(`/v3/assets/${cryptoId}/history`, {
            params: {
              interval: 'd1',
              start: Date.now() - dateRange * 24 * 60 * 60 * 1000,
              end: Date.now(),
            },
          }),
        ]);

      const currentPrice = parseFloat(currentResponse.data.data.priceUsd);
      const percentageChange24h = parseFloat(
        currentResponse.data.data.changePercent24Hr,
      );
      const marketCap = parseFloat(currentResponse.data.data.marketCapUsd);
      const circulatingSupply = parseFloat(currentResponse.data.data.supply);
      const tradingVolume = parseFloat(currentResponse.data.data.volumeUsd24Hr);
      const currencyRank = parseFloat(currentResponse.data.data.rank);
      const maxSupply = parseFloat(currentResponse.data.data?.maxSupply);

      const description =
        descriptionResponse.data?.description?.en ||
        'Description not available';
      const iconUrl = descriptionResponse.data?.image?.small;
      const athPrice = descriptionResponse.data?.market_data?.ath?.usd || 0;
      const athDate = descriptionResponse.data?.market_data?.ath_date?.usd;

      const historicalData = historicalResponse.data.data.map(
        (entry: { priceUsd: string }) => parseFloat(entry.priceUsd),
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
    },
    staleTime: 1000 * 60 * 1, // 1 minute
  });
};
