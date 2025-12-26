import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginStart, loginSuccess, loginFailure } from '../features/auth/authSlice';
import { mockApi } from '../services/mockApi';
import { TOAST_MESSAGES } from '../utils/constants';
import { LoginCredentials } from '../features/auth/authTypes';

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<LoginCredentials>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);

  const validateForm = () => {
    const newErrors: Partial<LoginCredentials> = {};
    
    if (!credentials.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!credentials.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error(TOAST_MESSAGES.FILL_ALL_FIELDS);
      return;
    }
    
    setIsLoading(true);
    dispatch(loginStart());

    try {
      const user = await mockApi.login(credentials);
      dispatch(loginSuccess(user));
      toast.success(TOAST_MESSAGES.LOGIN_SUCCESS);
      navigate('/profile');
    } catch (error) {
      dispatch(loginFailure(error instanceof Error ? error.message : 'Login failed'));
      toast.error(TOAST_MESSAGES.INVALID_CREDENTIALS);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof LoginCredentials]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleResetPassword = () => {
    setShowResetConfirmation(true);
  };

  const confirmResetPassword = () => {
    mockApi.resetToDefault();
    setShowForgotPassword(false);
    setShowResetConfirmation(false);
    toast.success('Password has been reset to default: 123456');
  };

  const cancelResetPassword = () => {
    setShowResetConfirmation(false);
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Login Header */}
          <div className="gradient-bg px-6 py-8 text-white">
            <div className="text-center">
              <h2 className="text-3xl font-bold">
                Welcome Back
              </h2>
              <p className="mt-2 text-emerald-100">
                Sign in to your account
              </p>
            </div>
          </div>

          {/* Login Form */}
          <div className="px-6 py-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={credentials.username}
                    onChange={handleChange}
                    className={`appearance-none relative block w-full px-4 py-3 border ${
                      errors.username ? 'border-red-600' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm sm:text-base transition duration-200`}
                    placeholder="Enter your username"
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={credentials.password}
                    onChange={handleChange}
                    className={`appearance-none relative block w-full px-4 py-3 border ${
                      errors.password ? 'border-red-600' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm sm:text-base transition duration-200`}
                    placeholder="Enter your password"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Forgot password?
                </button>
              </div>

              {/* Forgot Password Section */}
              {showForgotPassword && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 animate-fadeIn">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">Forgot Password?</h3>
                  <p className="text-sm text-yellow-700 mb-3">
                    You can reset your password to the default value. This will set your password back to "123456".
                  </p>
                  
                  {!showResetConfirmation ? (
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={handleResetPassword}
                        className="w-full bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors font-medium"
                      >
                        Reset to Default Password
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(false)}
                        className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-yellow-700 mb-3">
                        Are you sure you want to reset your password to "123456"?
                      </p>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={confirmResetPassword}
                          className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                          Yes, Reset
                        </button>
                        <button
                          type="button"
                          onClick={cancelResetPassword}
                          className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="gradient-btn text-white w-full py-3 px-4 border border-transparent text-sm sm:text-base font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>

              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Demo credentials: <span className="font-semibold text-emerald-700">admin</span> / <span className="font-semibold text-emerald-700">123456</span>
                </p>
              </div>
            </form>
          </div>
        </div>
        
        {/* Branding Footer */}
        <div className="mt-6 text-center">
          <p className="text-white text-sm opacity-90">
            Secure Admin Portal • Built with React & TypeScript
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;