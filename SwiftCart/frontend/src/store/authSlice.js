import { createSlice } from '@reduxjs/toolkit';

// Restore session from localStorage on load
const savedUser = (() => {
  try {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('sc_user');
    if (token && user) return JSON.parse(user);
  } catch { /* ignore */ }
  return null;
})();

const initialState = {
  user: savedUser,
  isAuthenticated: !!savedUser,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('sc_user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('sc_user');
    },
  },
});

export const { login, logout } = authSlice.actions;

// Selectors
export const selectIsAdmin = (state) => state.auth.user?.role === 'admin';
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;

export default authSlice.reducer;
