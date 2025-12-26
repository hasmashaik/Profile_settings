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
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Profile Header with Gradient */}
            <div className="gradient-bg px-8 py-8 text-white">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                {/* Profile Image in Circle */}
                <div className="relative">
                  <div className="w-40 h-40 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white">
                    <img
                      src={user.profileImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                    Verified
                  </div>
                </div>
                
                {/* User Info */}
                <div className="text-center md:text-left">
                  <h1 className="text-4xl font-bold">{user.name}</h1>
                  <p className="text-xl text-emerald-100 mt-2">@{user.username}</p>
                  <div className="mt-4 inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="text-sm font-medium">{user.role}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information Card */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-3 border-b border-gray-200">
                    Personal Information
                  </h2>
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="text-lg font-medium text-gray-900">{user.name}</p>
                      </div>
                      <div className="text-emerald-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Username</p>
                        <p className="text-lg font-medium text-gray-900">{user.username}</p>
                      </div>
                      <div className="text-emerald-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Role & Permissions Card */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-3 border-b border-gray-200">
                    Role & Permissions
                  </h2>
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Role</p>
                        <p className="text-lg font-medium text-gray-900">{user.role}</p>
                      </div>
                      <div className="text-emerald-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Account Status</p>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Details */}
              <div className="mt-8 bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 pb-3 border-b border-gray-200">
                  Account Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-4 rounded-lg border border-gray-100">
                    <p className="text-sm text-gray-500 mb-2">Member Since</p>
                    <p className="font-medium text-gray-900">January 15, 2024</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-100">
                    <p className="text-sm text-gray-500 mb-2">Last Login</p>
                    <p className="font-medium text-gray-900">Just now</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-100">
                    <p className="text-sm text-gray-500 mb-2">Account Type</p>
                    <p className="font-medium text-gray-900">Premium Admin</p>
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