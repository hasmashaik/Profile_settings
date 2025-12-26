import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { updateProfile } from '../features/auth/authSlice';
import { mockApi } from '../services/mockApi';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import { TOAST_MESSAGES } from '../utils/constants';

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Settings: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Password Change State
  const [passwordData, setPasswordData] = useState<ChangePasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState<Partial<ChangePasswordData>>({});
  
  // Profile Update State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
  });
  
  // Profile image state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentProfileImage, setCurrentProfileImage] = useState<string>(user?.profileImage || '');
  
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Initialize current profile image from user data
  useEffect(() => {
    if (user?.profileImage) {
      setCurrentProfileImage(user.profileImage);
    }
  }, [user]);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      toast.info('New image selected. Click "Save Changes" to update profile.');
    }
  };

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Remove selected image (before saving)
  const handleRemoveSelectedImage = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.info('Image selection removed');
  };

  // Remove current profile image (after saving)
  const handleRemoveProfileImage = () => {
    // Set to default avatar
    const defaultImage = "https://ui-avatars.com/api/?name=Admin+User&background=258440&color=fff";
    setCurrentProfileImage(defaultImage);
    setSelectedImage(null);
    setSelectedFile(null);
    
    // Update in Redux
    if (user) {
      dispatch(updateProfile({ ...user, profileImage: defaultImage }));
    }
    
    toast.success('Profile image removed');
    
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Get current password info
  const getCurrentPassword = (): string => {
    const savedPassword = localStorage.getItem('user_password');
    return savedPassword || "123456";
  };

  // Password Change Functions
  const validatePasswordForm = () => {
    const errors: Partial<ChangePasswordData> = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    } else if (passwordData.newPassword === passwordData.currentPassword) {
      errors.newPassword = 'New password must be different from current password';
    }
    
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setIsChangingPassword(true);
    
    try {
      await mockApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      toast.success(TOAST_MESSAGES.PASSWORD_CHANGE_SUCCESS);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setPasswordErrors({});
    } catch (error) {
      toast.error(TOAST_MESSAGES.CURRENT_PASSWORD_INCORRECT);
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Profile Update Functions
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profileData.name.trim()) {
      toast.error('Name is required');
      return;
    }
    
    setIsUpdatingProfile(true);
    
    try {
      // Determine which image to use
      let profileImage = currentProfileImage;
      
      if (selectedImage) {
        // Use the newly selected image
        profileImage = selectedImage;
        setCurrentProfileImage(selectedImage);
        toast.info('Profile image updated successfully');
      }
      
      const updatedUser = await mockApi.updateProfile({
        name: profileData.name,
        profileImage: profileImage,
      });
      
      dispatch(updateProfile(updatedUser));
      toast.success(TOAST_MESSAGES.PROFILE_UPDATE_SUCCESS);
      
      // Clear temporary selection after successful update
      setSelectedImage(null);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Handle show current password
  const handleShowPassword = () => {
    const currentPassword = getCurrentPassword();
    toast.info(`Current password: ${currentPassword}`, {
      autoClose: 5000,
    });
  };

  // Handle reset to default password
  const handleResetToDefault = () => {
    if (window.confirm('Reset password to default (123456)?')) {
      localStorage.removeItem('user_password');
      toast.success('Password reset to default: 123456');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Settings</h1>
          
          {/* Main Content - Two Columns Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Left Column - Account Settings */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
                Account Settings
              </h2>
              
              <form onSubmit={handleProfileUpdate} className="space-y-5 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm sm:text-base"
                    placeholder="Enter your full name"
                  />
                </div>
                
                {/* Profile Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Image
                  </label>
                  
                  <div className="space-y-4">
                    {/* Current/Preview Image */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                      <div className="relative">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-gray-300">
                          <img
                            src={selectedImage || currentProfileImage}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {/* Remove button for current image */}
                        {currentProfileImage && !currentProfileImage.includes('ui-avatars.com') && !selectedImage && (
                          <button
                            type="button"
                            onClick={handleRemoveProfileImage}
                            className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                            title="Remove current image"
                          >
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                          </button>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">
                            {selectedFile 
                              ? `New image selected: ${selectedFile.name.substring(0, 20)}${selectedFile.name.length > 20 ? '...' : ''}`
                              : currentProfileImage.includes('ui-avatars.com')
                                ? "Using default avatar"
                                : "Profile image saved"}
                          </p>
                          {selectedFile && (
                            <p className="text-xs text-gray-500">
                              Size: {(selectedFile.size / 1024).toFixed(2)} KB
                            </p>
                          )}
                          
                          {/* Action buttons */}
                          <div className="flex flex-wrap gap-2 mt-2">
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleFileSelect}
                              accept="image/*"
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={handleUploadClick}
                              className="px-3 py-2 sm:px-4 sm:py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-1 sm:space-x-2 text-sm"
                            >
                              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                              </svg>
                              <span>{selectedImage ? 'Change Image' : 'Upload Image'}</span>
                            </button>
                            
                            {selectedImage && (
                              <button
                                type="button"
                                onClick={handleRemoveSelectedImage}
                                className="px-3 py-2 sm:px-4 sm:py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center space-x-1 sm:space-x-2 text-sm"
                              >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                                <span>Remove Selected</span>
                              </button>
                            )}
                            
                            {currentProfileImage && !currentProfileImage.includes('ui-avatars.com') && !selectedImage && (
                              <button
                                type="button"
                                onClick={handleRemoveProfileImage}
                                className="px-3 py-2 sm:px-4 sm:py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center space-x-1 sm:space-x-2 text-sm"
                              >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                                <span>Remove Current</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                      Supports JPG, PNG, GIF (Max 5MB)
                    </p>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="gradient-btn text-white w-full py-2.5 sm:py-3 rounded-lg font-medium disabled:opacity-50 transition-all duration-200 hover:shadow-lg text-sm sm:text-base"
                >
                  {isUpdatingProfile ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </form>
            </div>

            {/* Right Column - Change Password */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
                Change Password
              </h2>
              
              <form onSubmit={handlePasswordChange} className="space-y-5 sm:space-y-6">
                {/* Current Password - NO EYE ICON */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className={`w-full px-3 py-2 sm:px-4 sm:py-3 border ${
                      passwordErrors.currentPassword ? 'border-red-600' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm sm:text-base`}
                    placeholder="Enter current password"
                  />
                  {passwordErrors.currentPassword && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword}</p>
                  )}
                </div>

                {/* New Password - NO EYE ICON */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className={`w-full px-3 py-2 sm:px-4 sm:py-3 border ${
                      passwordErrors.newPassword ? 'border-red-600' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm sm:text-base`}
                    placeholder="Enter new password"
                  />
                  {passwordErrors.newPassword && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword}</p>
                  )}
                </div>

                {/* Confirm Password - NO EYE ICON */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className={`w-full px-3 py-2 sm:px-4 sm:py-3 border ${
                      passwordErrors.confirmPassword ? 'border-red-600' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm sm:text-base`}
                    placeholder="Confirm new password"
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="gradient-btn text-white w-full py-2.5 sm:py-3 rounded-lg font-medium disabled:opacity-50 transition-all duration-200 hover:shadow-lg text-sm sm:text-base"
                >
                  {isChangingPassword ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Changing Password...
                    </span>
                  ) : (
                    'Change Password'
                  )}
                </button>
              </form>

              {/* Password Info Section */}
              <div className="mt-6 pt-5 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Password Information</h3>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Current Status:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      getCurrentPassword() === "123456" 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {getCurrentPassword() === "123456" ? 'Default Password' : 'Custom Password'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Forgot Password?</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleShowPassword}
                        className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        Show
                      </button>
                      <button
                        onClick={handleResetToDefault}
                        className="text-xs text-red-600 hover:text-red-700 font-medium"
                      >
                        Reset to Default
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Default password: <strong>123456</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;