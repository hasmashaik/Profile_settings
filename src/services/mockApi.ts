import { LoginCredentials, User } from '../features/auth/authTypes';

// Mock user data
const MOCK_USER: User = {
  username: "admin",
  name: "Admin User",
  role: "Administrator",
  profileImage: "https://ui-avatars.com/api/?name=Admin+User&background=258440&color=fff",
};

// Get password from localStorage or use default
const getCurrentPassword = (): string => {
  const savedPassword = localStorage.getItem('user_password');
  return savedPassword || "123456"; // Default password
};

// Save password to localStorage
const savePassword = (password: string): void => {
  localStorage.setItem('user_password', password);
};

// Get password info (for display purposes)
const getPasswordInfo = (): { isDefault: boolean; password: string } => {
  const password = getCurrentPassword();
  return {
    isDefault: password === "123456",
    password: password
  };
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  // Login API
  login: async (credentials: LoginCredentials): Promise<User> => {
    await delay(1000);
    
    const currentPassword = getCurrentPassword();
    
    if (credentials.username === "admin" && credentials.password === currentPassword) {
      return MOCK_USER;
    }
    
    throw new Error("Invalid username or password");
  },

  // Change password API - Now persists in localStorage
  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<boolean> => {
    await delay(1000);
    
    const currentPassword = getCurrentPassword();
    
    if (data.currentPassword === currentPassword) {
      // Save new password to localStorage
      savePassword(data.newPassword);
      return true;
    }
    
    throw new Error("Current password is incorrect");
  },

  // Update profile API
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    await delay(800);
    return { ...MOCK_USER, ...userData };
  },

  // Helper to reset password (for testing)
  resetPassword: (): void => {
    localStorage.removeItem('user_password');
  },

  // Helper to get password info
  getPasswordInfo,
};