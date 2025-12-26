import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from './authTypes';

// Check localStorage for existing auth
const loadFromLocalStorage = (): { user: User | null; isAuthenticated: boolean } => {
  try {
    const authData = localStorage.getItem('auth');
    if (authData) {
      return JSON.parse(authData);
    }
  } catch (error) {
    console.error('Error reading auth from localStorage:', error);
  }
  return { user: null, isAuthenticated: false };
};

const savedAuth = loadFromLocalStorage();

const initialState: AuthState = {
  user: savedAuth.user,
  isAuthenticated: savedAuth.isAuthenticated,
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
      
      // Save to localStorage
      try {
        localStorage.setItem('auth', JSON.stringify({
          user: action.payload,
          isAuthenticated: true,
        }));
      } catch (error) {
        console.error('Error saving auth to localStorage:', error);
      }
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      
      // Clear localStorage
      try {
        localStorage.removeItem('auth');
      } catch (error) {
        console.error('Error clearing auth from localStorage:', error);
      }
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        
        // Update localStorage
        try {
          localStorage.setItem('auth', JSON.stringify({
            user: state.user,
            isAuthenticated: true,
          }));
        } catch (error) {
          console.error('Error updating auth in localStorage:', error);
        }
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