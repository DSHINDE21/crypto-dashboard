import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CryptoState {
  selectedCrypto: string;
  watchlist: string[];
  favorites: string[];
}

const initialState: CryptoState = {
  selectedCrypto: 'bitcoin',
  watchlist: [],
  favorites: [],
};

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    setSelectedCrypto: (state, action: PayloadAction<string>) => {
      state.selectedCrypto = action.payload;
    },
    addToWatchlist: (state, action: PayloadAction<string>) => {
      if (!state.watchlist.includes(action.payload)) {
        state.watchlist.push(action.payload);
      }
    },
    removeFromWatchlist: (state, action: PayloadAction<string>) => {
      state.watchlist = state.watchlist.filter(
        (crypto) => crypto !== action.payload,
      );
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const index = state.favorites.indexOf(action.payload);
      if (index === -1) {
        state.favorites.push(action.payload);
      } else {
        state.favorites.splice(index, 1);
      }
    },
  },
});

export const {
  setSelectedCrypto,
  addToWatchlist,
  removeFromWatchlist,
  toggleFavorite,
} = cryptoSlice.actions;

export default cryptoSlice.reducer;
