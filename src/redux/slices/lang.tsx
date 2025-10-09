import { createSlice } from "@reduxjs/toolkit";

type ThemeType = {
  languages: object[];
  defaultLang: string;
};

const initialState: ThemeType = {
  languages: [
    { locale: "RU", shortcode: "ru" },
    { locale: "EN", shortcode: "en" },
    { locale: "UZ", shortcode: "uz" },
  ],
  defaultLang: "ru",
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    changeDefaultLang(state, action) {
      state.defaultLang = action.payload;
    },
  },
});

export const { changeDefaultLang } = languageSlice.actions;
export default languageSlice.reducer;
