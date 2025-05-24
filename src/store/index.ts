import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { cryptoApi } from './api/cryptoApi';

// Import your other reducers here
import themeReducer from './slices/themeSlice';
import userReducer from './slices/userSlice';
import cryptoReducer from './slices/cryptoSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['theme', 'user', 'crypto'], // Only persist these reducers
};

const persistedThemeReducer = persistReducer(persistConfig, themeReducer);
const persistedUserReducer = persistReducer(persistConfig, userReducer);
const persistedCryptoReducer = persistReducer(persistConfig, cryptoReducer);

export const store = configureStore({
  reducer: {
    [cryptoApi.reducerPath]: cryptoApi.reducer,
    theme: persistedThemeReducer,
    user: persistedUserReducer,
    crypto: persistedCryptoReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(cryptoApi.middleware),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
