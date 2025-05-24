import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  preferences: {
    notifications: {
      priceAlerts: boolean;
      newsUpdates: boolean;
    };
    currency: string;
    language: string;
  };
  profile: {
    id?: string;
    email?: string;
    name?: string;
  };
}

const initialState: UserState = {
  preferences: {
    notifications: {
      priceAlerts: true,
      newsUpdates: true,
    },
    currency: 'USD',
    language: 'en',
  },
  profile: {},
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateNotificationPreferences: (
      state,
      action: PayloadAction<{
        type: 'priceAlerts' | 'newsUpdates';
        enabled: boolean;
      }>,
    ) => {
      state.preferences.notifications[action.payload.type] =
        action.payload.enabled;
    },
    setCurrency: (state, action: PayloadAction<string>) => {
      state.preferences.currency = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.preferences.language = action.payload;
    },
    updateProfile: (
      state,
      action: PayloadAction<Partial<UserState['profile']>>,
    ) => {
      state.profile = { ...state.profile, ...action.payload };
    },
  },
});

export const {
  updateNotificationPreferences,
  setCurrency,
  setLanguage,
  updateProfile,
} = userSlice.actions;

export default userSlice.reducer;
