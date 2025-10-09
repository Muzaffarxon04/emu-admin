import { createSlice } from '@reduxjs/toolkit';

type AuthDataType = {
  user: any;
};

const initialState: AuthDataType = {
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserData(state, action) {
      const { payload } = action;
      state.user = payload;
    },
    clearUser(state) {
      state.user = initialState.user;
    },
  },
});

export const { setUserData, clearUser } = authSlice.actions;
export default authSlice.reducer;
