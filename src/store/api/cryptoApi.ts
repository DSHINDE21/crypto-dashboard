import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface CryptoDetails {
  id: string;
  name: string;
  symbol: string;
  description: string;
  image: string;
  market_data: {
    current_price: {
      usd: number;
    };
    market_cap: {
      usd: number;
    };
    total_volume: {
      usd: number;
    };
  };
}

export const cryptoApi = createApi({
  reducerPath: 'cryptoApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.coingecko.com/api/v3' }),
  endpoints: (builder) => ({
    getCryptoDetails: builder.query<CryptoDetails, string>({
      query: (id) =>
        `/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
    }),
    getTopCryptos: builder.query<any[], number>({
      query: (limit = 10) =>
        `/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`,
    }),
  }),
});

export const { useGetCryptoDetailsQuery, useGetTopCryptosQuery } = cryptoApi;
