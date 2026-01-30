import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  CheckSquare,
  Calendar,
  FileText,
  Settings,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  Plus,
  Menu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';
import { getAnimationProps } from '../../utils/animationUtils';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user, logout } = useAuth();
  const location = useLocation();

  const sidebarItems = [
    { id: 'sidebar-dashboard', name: 'Dashboard', path: '/dashboard', icon: Home },
    { id: 'sidebar-all-tasks', name: 'All Tasks', path: '/tasks', icon: CheckSquare },
    { id: 'sidebar-today', name: 'Today', path: '/tasks/today', icon: Calendar },
    { id: 'sidebar-upcoming', name: 'Upcoming', path: '/tasks/upcoming', icon: FileText },
    { id: 'sidebar-completed', name: 'Completed', path: '/tasks/completed', icon: CheckSquare },
    { id: 'sidebar-settings', name: 'Settings', path: '/settings', icon: Settings },
    { id: 'sidebar-profile', name: 'Profile', path: '/profile', icon: User },
  ];

  const isActive = (path) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    if (path.includes('?')) {
      const [basePath, queryParams] = path.split('?');
      if (location.pathname === basePath && location.search.includes(queryParams)) return true;
    }
    return location.pathname === path;
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="md:hidden fixed top-20 left-4 z-50 p-2 rounded-lg bg-dark-secondary border border-dark-card"
      >
        <Menu className="h-5 w-5 text-text-primary" />
      </button>

      {/* Backdrop for mobile */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            {...getAnimationProps({
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 }
            })}
            className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        {...getAnimationProps({
          initial: { x: -300 },
          animate: { x: mobileMenuOpen || !isCollapsed ? 0 : -280 }
        })}
        className={clsx(
          'fixed left-0 top-16 h-[calc(100vh-4rem)] z-40 bg-dark-secondary border-r border-dark-card transition-all duration-300',
          { 'w-64': !isCollapsed, 'w-20': isCollapsed }
        )}
      >
        <div className="flex flex-col h-full">
          {/* User Info */}
          <div className={`p-4 border-b border-dark-card ${isCollapsed ? 'items-center justify-center' : ''}`}>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              {!isCollapsed && (
                <div>
                  <p className="text-sm font-medium text-text-primary">{user?.name}</p>
                  <p className="text-xs text-text-secondary truncate">{user?.email}</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-2 py-4">
            <ul className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <Link
                      key={item.id}
                      to={item.path}
                      className={clsx(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                        isActive(item.path)
                          ? 'bg-accent-purple/20 text-accent-purple border-l-4 border-accent-purple'
                          : 'text-text-secondary hover:bg-dark-card hover:text-text-primary'
                      )}
                    >
                      <Icon className={clsx('h-5 w-5', { 'mx-auto': isCollapsed })} />
                      {!isCollapsed && <span>{item.name}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-dark-card space-y-2">
            <button
              className={clsx(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors',
                { 'justify-center': isCollapsed }
              )}
              onClick={logout}
            >
              <LogOut className={clsx('h-5 w-5', { 'mx-auto': isCollapsed })} />
              {!isCollapsed && <span>Logout</span>}
            </button>

            {/* Collapse Toggle */}
            <button
              onClick={toggleCollapse}
              className={clsx(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-dark-card hover:text-text-primary transition-colors',
                { 'justify-center': isCollapsed }
              )}
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5 mx-auto" />
              ) : (
                <>
                  <ChevronLeft className="h-5 w-5" />
                  <span>Collapse</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;