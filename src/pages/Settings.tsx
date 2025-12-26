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
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
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
  
  const [language, setLanguage] = useState('en');
  const [logoutAllDevices, setLogoutAllDevices] = useState(false);
  
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

  // Password Change Functions - FIXED
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

  // Security Functions
  const handleLogoutAllDevices = () => {
    setLogoutAllDevices(true);
    setTimeout(() => {
      toast.info('Logged out from all other devices');
      setLogoutAllDevices(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Settings</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Left Column - Profile Settings */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {/* Account Settings */}
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
                    className="gradient-btn text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg font-medium disabled:opacity-50 transition-all duration-200 hover:shadow-lg text-sm sm:text-base w-full sm:w-auto"
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

              {/* Change Password - FIXED */}
              <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
                  Change Password
                </h2>
                
                <form onSubmit={handlePasswordChange} className="space-y-5 sm:space-y-6">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.current ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className={`w-full px-3 py-2 sm:px-4 sm:py-3 border ${
                          passwordErrors.currentPassword ? 'border-red-600' : 'border-gray-300'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent pr-10 text-sm sm:text-base`}
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                        className="absolute right-3 top-2.5 sm:top-3 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword.current ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    {passwordErrors.currentPassword && (
                      <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword}</p>
                    )}
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.new ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className={`w-full px-3 py-2 sm:px-4 sm:py-3 border ${
                          passwordErrors.newPassword ? 'border-red-600' : 'border-gray-300'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent pr-10 text-sm sm:text-base`}
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                        className="absolute right-3 top-2.5 sm:top-3 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword.new ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    {passwordErrors.newPassword && (
                      <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.confirm ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className={`w-full px-3 py-2 sm:px-4 sm:py-3 border ${
                          passwordErrors.confirmPassword ? 'border-red-600' : 'border-gray-300'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent pr-10 text-sm sm:text-base`}
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                        className="absolute right-3 top-2.5 sm:top-3 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword.confirm ? 'Hide' : 'Show'}
                      </button>
                    </div>
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
              </div>
            </div>

            {/* Right Column - Preferences */}
            <div className="space-y-6 sm:space-y-8">
              {/* Security Settings */}
              <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
                  Security Settings
                </h2>
                
                <div className="space-y-5 sm:space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 text-sm sm:text-base">Show/Hide Password</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                        onChange={(e) => {
                          toast.info(e.target.checked ? 'Password visibility enabled' : 'Password visibility disabled');
                        }}
                      />
                      <div className="w-10 h-5 sm:w-11 sm:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-5 sm:peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                  
                  <div className="pt-3 sm:pt-4 border-t border-gray-200">
                    <button
                      onClick={handleLogoutAllDevices}
                      disabled={logoutAllDevices}
                      className="w-full py-2.5 sm:py-3 border border-red-600 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors disabled:opacity-50 text-sm sm:text-base"
                    >
                      {logoutAllDevices ? 'Processing...' : 'Logout from all devices'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
                  Preferences
                </h2>
                
                <div className="space-y-5 sm:space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                      Language
                    </label>
                    <select
                      value={language}
                      onChange={(e) => {
                        setLanguage(e.target.value);
                        toast.info(`Language changed to ${e.target.value === 'en' ? 'English' : 
                          e.target.value === 'es' ? 'Spanish' : 
                          e.target.value === 'fr' ? 'French' : 'German'}`);
                      }}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm sm:text-base"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
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