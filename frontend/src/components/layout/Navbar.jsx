import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Menu,
  X,
  Search,
  User,
  Sun,
  Moon,
  Plus,
  Home,
  Calendar,
  CheckSquare,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Button from '../common/Button';
import clsx from 'clsx';
import { getAnimationProps } from '../../utils/animationUtils';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const navItems = [
    { id: 'nav-dashboard', name: 'Dashboard', path: '/dashboard', icon: Home },
    { id: 'nav-tasks', name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { id: 'nav-profile', name: 'Profile', path: '/profile', icon: User },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
  };

  return (
    <motion.nav
      {...getAnimationProps({
        initial: { y: -100 },
        animate: { y: 0 }
      })}
      className="sticky top-0 z-40 bg-dark-secondary/80 backdrop-blur-md border-b border-dark-card"
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0">
              <h1 className="text-xl font-bold gradient-text">TaskFlow</h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      className={clsx(
                        'px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors',
                        isActive(item.path)
                          ? 'bg-accent-purple/20 text-accent-purple'
                          : 'text-text-secondary hover:bg-dark-card hover:text-text-primary'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden sm:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-text-secondary" />
                </div>
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 bg-dark-card border border-dark-card rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-purple focus:border-transparent"
                />
              </div>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-dark-card transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-text-secondary" />
              ) : (
                <Moon className="h-5 w-5 text-text-secondary" />
              )}
            </button>



            {/* Logout Button */}
            <Button
              variant="danger"
              size="sm"
              className="hidden md:flex items-center gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>

            {/* User Dropdown */}
            <div className="ml-4 relative">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-text-primary">{user?.name}</p>
                  <p className="text-xs text-text-secondary">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-dark-card transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-text-primary" />
              ) : (
                <Menu className="h-6 w-6 text-text-primary" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <motion.div
            {...getAnimationProps({
              initial: { opacity: 0, height: 0 },
              animate: { opacity: 1, height: 'auto' },
              exit: { opacity: 0, height: 0 }
            })}
            className="md:hidden py-4 border-t border-dark-card"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={clsx(
                      'block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2',
                      isActive(item.path)
                        ? 'bg-accent-purple/20 text-accent-purple'
                        : 'text-text-secondary hover:bg-dark-card hover:text-text-primary'
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}

              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-dark-card"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;