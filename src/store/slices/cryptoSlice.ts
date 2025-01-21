import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface CryptoState {
  selectedCrypto: string;
  currentPrice: number | null;
  percentageChange: number | null;
  historicalData: any[];
  overview: any | null;
  status: string;
}

const initialState: CryptoState = {
  selectedCrypto: 'bitcoin',
  currentPrice: null,
  percentageChange: null,
  historicalData: [],
  overview: null,
  status: 'idle',
};

export const fetchCryptoData = createAsyncThunk(
  'crypto/fetchCryptoData',
  async (crypto: string) => {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=usd&include_24hr_change=true`,
    );
    return response.data;
  },
);

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    setCrypto(state, action) {
      state.selectedCrypto = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptoData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCryptoData.fulfilled, (state, action) => {
        state.currentPrice = action.payload.usd;
        state.percentageChange = action.payload.usd_24h_change;
        state.status = 'succeeded';
      });
  },
});

export const { setCrypto } = cryptoSlice.actions;
export default cryptoSlice.reducer;
