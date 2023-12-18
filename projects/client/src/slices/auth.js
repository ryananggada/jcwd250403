import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

function isValidToken(token) {
  if (!token) {
    localStorage.removeItem('token');
    return false;
  }

  const payload = jwtDecode(token);
  const currentDate = new Date();

  if (payload.exp * 1000 > currentDate.getTime()) {
    return true;
  }

  localStorage.removeItem('token');
  return false;
}

const initialState = {
  token:
    localStorage.getItem('token') && isValidToken(localStorage.getItem('token'))
      ? localStorage.getItem('token')
      : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      const { token } = action.payload;
      state.token = token;
      localStorage.setItem('token', token);
    },
    logout(state) {
      localStorage.removeItem('token');
      state.token = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
