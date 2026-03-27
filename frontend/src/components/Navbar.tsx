import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, User, LogOut, Menu, X, Shield } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${searchQuery}`);
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white border-opacity-10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
              <span className="text-black font-black text-xl italic uppercase">G</span>
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic group-hover:text-primary transition-colors">
              Gen<span className="text-primary italic">Z</span> Fashion
            </span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Search brands, styles..."
                className="w-full bg-surface-light border border-white border-opacity-10 rounded-full py-2 px-12 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <button type="submit" className="hidden">Search</button>
            </form>
          </div>

          {/* Icons */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/wishlist" className="hover:text-primary transition-colors flex flex-col items-center group">
              <Heart className="w-6 h-6 group-hover:fill-primary" />
              <span className="text-[10px] mt-1 font-bold">SAVED</span>
            </Link>
            {isAuthenticated ? (
              <Link to="/profile" className="hover:text-primary transition-colors flex flex-col items-center">
                <User className="w-6 h-6" />
                <span className="text-[10px] mt-1 font-bold">PROFILE</span>
              </Link>
            ) : (
              <Link to="/login" className="hover:text-primary transition-colors flex flex-col items-center">
                <User className="w-6 h-6" />
                <span className="text-[10px] mt-1 font-bold">LOGIN</span>
              </Link>
            )}
            {user?.role === 'ADMIN' && (
              <Link to="/admin" className="hover:text-accent transition-colors flex flex-col items-center text-accent">
                <Shield className="w-6 h-6" />
                <span className="text-[10px] mt-1 font-bold text-accent">ADMIN</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
              {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden glass border-t border-white border-opacity-10 animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-4 pb-6 space-y-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-surface-light border border-white border-opacity-10 rounded-xl py-3 px-12 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </form>
            <Link to="/wishlist" className="block text-lg font-bold py-2 border-b border-white border-opacity-5">My Wishlist</Link>
            {isAuthenticated ? (
              <button onClick={logout} className="block text-lg font-bold py-2 text-red-500">Logout</button>
            ) : (
              <Link to="/login" className="block text-lg font-bold py-2">Login / Register</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
