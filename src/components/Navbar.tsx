import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Leaf, User, Menu, X, ShoppingBag, TrendingUp, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const navigation = [
    { name: 'Marketplace', href: '/marketplace', icon: ShoppingBag },
    { name: 'Dashboard', href: '/dashboard', icon: TrendingUp, authRequired: true },
    { name: 'Leaderboard', href: '/leaderboard', icon: TrendingUp },
    { name: 'List Item', href: '/list-item', icon: Plus, authRequired: true },
  ];

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg border-b-2 border-green-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 rounded-xl group-hover:scale-105 transition-transform">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                EcoFinds
              </span>
              <p className="text-xs text-gray-500 -mt-1">Sustainable Marketplace</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              if (item.authRequired && !isAuthenticated) return null;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    isActivePath(item.href)
                      ? 'bg-green-100 text-green-700 font-medium'
                      : 'text-gray-600 hover:bg-green-50 hover:text-green-600'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  <div className="text-xs text-green-600 font-medium">
                    {user.ecoPoints} eco points
                  </div>
                </div>
                <div className="relative group">
                  <button className="bg-green-100 p-2 rounded-full hover:bg-green-200 transition-colors">
                    <User className="h-5 w-5 text-green-600" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="py-2">
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/auth"
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-2">
              {navigation.map((item) => {
                if (item.authRequired && !isAuthenticated) return null;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${
                      isActivePath(item.href)
                        ? 'bg-green-100 text-green-700 font-medium'
                        : 'text-gray-600 hover:bg-green-50'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              <div className="border-t border-gray-200 pt-4">
                {isAuthenticated && user ? (
                  <div className="space-y-2">
                    <div className="px-4 py-2">
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-green-600">
                        {user.ecoPoints} eco points
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-center bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-medium"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;