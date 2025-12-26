import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from './authTypes';

// Load user from localStorage
const loadUserFromStorage = (): User | null => {
  try {
    const userStr = localStorage.getItem('mock_user_data');
    if (userStr) {
      return JSON.parse(userStr);
    }
  } catch (error) {
    console.error('Error loading user from localStorage:', error);
  }
  return null;
};

const savedUser = loadUserFromStorage();

const initialState: AuthState = {
  user: savedUser || {
    username: "admin",
    name: "Admin User",
    role: "Administrator",
    profileImage: "https://ui-avatars.com/api/?name=Admin+User&background=258440&color=fff",
  },
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateProfile,
} = authSlice.actions;

export default authSlice.reducer;