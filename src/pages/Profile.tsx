import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import Header from '../components/Header';

const Profile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden">
            {/* Profile Header with Gradient */}
            <div className="gradient-bg px-4 py-6 sm:px-8 sm:py-8 text-white">
              <div className="flex flex-col items-center space-y-4 sm:space-y-0 sm:flex-row sm:items-start sm:space-x-6">
                {/* Profile Image in Circle */}
                <div className="relative">
                  <div className="w-28 h-28 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-lg sm:shadow-2xl overflow-hidden bg-white">
                    <img
                      src={user.profileImage || "https://ui-avatars.com/api/?name=Admin+User&background=258440&color=fff"}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                    Verified
                  </div>
                </div>
                
                {/* User Info */}
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl sm:text-4xl font-bold">{user.name}</h1>
                  <p className="text-lg sm:text-xl text-emerald-100 mt-1 sm:mt-2">@{user.username}</p>
                  <div className="mt-3 sm:mt-4 inline-flex items-center bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1 sm:py-2 rounded-full">
                    <span className="text-sm font-medium">{user.role}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="p-4 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Personal Information Card */}
                <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 pb-2 sm:pb-3 border-b border-gray-200">
                    Personal Information
                  </h2>
                  <div className="space-y-4 sm:space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500">Full Name</p>
                        <p className="text-base sm:text-lg font-medium text-gray-900">{user.name}</p>
                      </div>
                      <div className="text-emerald-600">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500">Username</p>
                        <p className="text-base sm:text-lg font-medium text-gray-900">{user.username}</p>
                      </div>
                      <div className="text-emerald-600">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Role & Permissions Card */}
                <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 pb-2 sm:pb-3 border-b border-gray-200">
                    Role & Permissions
                  </h2>
                  <div className="space-y-4 sm:space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500">Role</p>
                        <p className="text-base sm:text-lg font-medium text-gray-900">{user.role}</p>
                      </div>
                      <div className="text-emerald-600">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500">Account Status</p>
                        <span className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-emerald-100 text-emerald-800">
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full mr-1 sm:mr-2"></span>
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Details */}
              <div className="mt-6 sm:mt-8 bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6 pb-2 sm:pb-3 border-b border-gray-200">
                  Account Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-100">
                    <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">Member Since</p>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">Jan 15, 2024</p>
                  </div>
                  <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-100">
                    <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">Last Login</p>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">Just now</p>
                  </div>
                  <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-100">
                    <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">Account Type</p>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">Premium Admin</p>
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

export default Profile;