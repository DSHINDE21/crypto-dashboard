import axios from 'axios';

const BASE_URL = 'https://api.coingecko.com/api/v3';

export const fetchCryptoData = async (currency: string) => {
  const response = await axios.get(`${BASE_URL}/simple/price`, {
    params: {
      ids: currency,
      vs_currencies: 'usd',
      include_24hr_change: true,
    },
  });
  return {
    price: response.data[currency].usd,
    percentageChange: response.data[currency].usd_24h_change,
  };
};

export const fetchCryptoOverview = async (currency: string) => {
  const response = await axios.get(`${BASE_URL}/coins/${currency}`);
  const { market_data, description, market_cap_rank } = response.data;
  return {
    marketCap: market_data.market_cap.usd,
    totalSupply: market_data.total_supply,
    circulatingSupply: market_data.circulating_supply,
    allTimeHigh: market_data.ath.usd,
    rank: market_cap_rank,
    description: description.en,
  };
};

export const fetchCryptoHistory = async (currency: string) => {
  const response = await axios.get(
    `${BASE_URL}/coins/${currency}/market_chart`,
    {
      params: {
        vs_currency: 'usd',
        days: 7,
      },
    },
  );
  return response.data.prices.map(([date, price]: [number, number]) => ({
    date: new Date(date).toLocaleDateString(),
    price,
  }));
};
