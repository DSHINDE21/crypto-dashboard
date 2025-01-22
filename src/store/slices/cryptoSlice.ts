import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CryptoState {
  selectedCrypto: string;
  selectedCurrency: string;
}

const initialState: CryptoState = {
  selectedCrypto: 'bitcoin', // Default selected crypto
  selectedCurrency: 'usd',
};

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    setSelectedCrypto(state, action: PayloadAction<string>) {
      state.selectedCrypto = action.payload;
    },
    setSelectedCurrency: (state, action: PayloadAction<string>) => {
      state.selectedCurrency = action.payload;
    },
  },
});

export const { setSelectedCrypto } = cryptoSlice.actions;
export default cryptoSlice.reducer;
