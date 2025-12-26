import { LoginCredentials, User } from '../features/auth/authTypes';

// Mock user data - Load from localStorage or use default
const getMockUser = (): User => {
  try {
    const savedUser = localStorage.getItem('mock_user_data');
    if (savedUser) {
      return JSON.parse(savedUser);
    }
  } catch (error) {
    console.error('Error loading user data:', error);
  }
  
  // Default user
  return {
    username: "admin",
    name: "Admin User",
    role: "Administrator",
    profileImage: "https://ui-avatars.com/api/?name=Admin+User&background=258440&color=fff",
  };
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

// Save user data to localStorage
const saveUserData = (userData: User): void => {
  localStorage.setItem('mock_user_data', JSON.stringify(userData));
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  // Login API
  login: async (credentials: LoginCredentials): Promise<User> => {
    await delay(1000);
    
    const currentPassword = getCurrentPassword();
    const user = getMockUser();
    
    if (credentials.username === user.username && credentials.password === currentPassword) {
      return user;
    }
    
    throw new Error("Invalid username or password");
  },

  // Change password API
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

  // Update profile API - Now saves to localStorage
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    await delay(800);
    
    const currentUser = getMockUser();
    const updatedUser = { ...currentUser, ...userData };
    
    // Save updated user to localStorage
    saveUserData(updatedUser);
    
    return updatedUser;
  },

  // Get password info for display
  getPasswordInfo: () => {
    const password = getCurrentPassword();
    return {
      isDefault: password === "123456",
      password: password
    };
  },

  // Reset to default password
  resetToDefault: (): void => {
    localStorage.removeItem('user_password');
  },
};