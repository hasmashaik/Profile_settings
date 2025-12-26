import { LoginCredentials, User } from '../features/auth/authTypes';

// Mock user data
const MOCK_USER: User = {
  username: "admin",
  name: "Admin User",
  role: "Administrator",
  profileImage: "https://ui-avatars.com/api/?name=Admin+User&background=258440&color=fff",
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  // Login API
  login: async (credentials: LoginCredentials): Promise<User> => {
    await delay(1000); // Simulate network delay
    
    if (credentials.username === "admin" && credentials.password === "123456") {
      return MOCK_USER;
    }
    
    throw new Error("Invalid username or password");
  },

  // Change password API
  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<boolean> => {
    await delay(1000);
    
    if (data.currentPassword === "123456") {
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