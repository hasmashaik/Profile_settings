import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { logout } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import { TOAST_MESSAGES } from '../utils/constants';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    toast.success(TOAST_MESSAGES.LOGOUT_SUCCESS);
    navigate('/login');
  };

  return (
    <header className="gradient-bg text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4 sm:space-x-8">
            <Link to="/" className="text-xl sm:text-2xl font-bold">
              Admin Portal
            </Link>
            <nav className="flex space-x-3 sm:space-x-4">
              <Link
                to="/profile"
                className="hover:text-gray-200 transition-colors duration-200 text-sm sm:text-base"
              >
                Profile
              </Link>
              <Link
                to="/settings"
                className="hover:text-gray-200 transition-colors duration-200 text-sm sm:text-base"
              >
                Settings
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-3 sm:space-x-4">
            {user && (
              <>
                <div className="flex items-center space-x-2">
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white"
                  />
                  <span className="font-medium text-sm sm:text-base">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-white text-emerald-700 px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 text-sm sm:text-base"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;