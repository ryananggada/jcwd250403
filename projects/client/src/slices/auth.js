import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const initialState = {
  profile: Cookies.get('profile') ?? null,
  token: Cookies.get('token') ?? null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      const { profile, token } = action.payload;
      state.profile = profile;
      state.token = token;
      let twoHour = 1 / 12;
      Cookies.set('profile', JSON.stringify(profile), { expires: twoHour });
      Cookies.set('token', token, { expires: twoHour });
    },
    logout(state) {
      Cookies.remove('profile');
      Cookies.remove('token');
      state.profile = null;
      state.token = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
