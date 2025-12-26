import { LoginCredentials, User } from '../features/auth/authTypes';

// Mock user data
const MOCK_USER: User = {
  username: "admin",
  name: "Admin User",
  role: "Administrator",
  profileImage: "https://ui-avatars.com/api/?name=Admin+User&background=258440&color=fff",
};

// Store for current password (simulating backend)
let CURRENT_PASSWORD = "123456";

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  // Login API
  login: async (credentials: LoginCredentials): Promise<User> => {
    await delay(1000);
    
    if (credentials.username === "admin" && credentials.password === CURRENT_PASSWORD) {
      return MOCK_USER;
    }
    
    throw new Error("Invalid username or password");
  },

  // Change password API - UPDATED to actually change the password
  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<boolean> => {
    await delay(1000);
    
    if (data.currentPassword === CURRENT_PASSWORD) {
      // Update the current password
      CURRENT_PASSWORD = data.newPassword;
      return true;
    }
    
    throw new Error("Current password is incorrect");
  },

  // Update profile API
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    await delay(800);
    return { ...MOCK_USER, ...userData };
  },
};