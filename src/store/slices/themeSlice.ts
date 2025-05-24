import { createSlice } from '@reduxjs/toolkit';

type ThemeState = 'light' | 'dark';

const initialState: ThemeState = 'light';

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      return state === 'light' ? 'dark' : 'light';
    },
    setTheme: (_, action: { payload: ThemeState }) => {
      return action.payload;
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
