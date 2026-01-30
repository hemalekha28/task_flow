import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy load components for better performance
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Tasks = lazy(() => import('./pages/Tasks'));
const Profile = lazy(() => import('./pages/Profile'));
const ProtectedRoute = lazy(() => import('./components/common/ProtectedRoute'));
import Toast from './components/common/Toast';

// Simple loading component
const Loader = () => (
  <div className="min-h-screen bg-dark-primary flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-purple"></div>
  </div>
);

const App = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Simple animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-dark-primary text-text-primary">
      <Suspense fallback={<Loader />}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route
              path="/"
              element={
                <motion.div
                  key="root-redirect"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  className="h-full"
                >
                  {isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
                </motion.div>
              }
            />

            <Route
              path="/login"
              element={
                <motion.div
                  key="login"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  className="h-full"
                >
                  <Login />
                </motion.div>
              }
            />

            <Route
              path="/signup"
              element={
                <motion.div
                  key="signup"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  className="h-full"
                >
                  <Signup />
                </motion.div>
              }
            />

            <Route
              path="/dashboard"
              element={
                <motion.div
                  key="dashboard"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  className="h-full"
                >
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                </motion.div>
              }
            />

            <Route
              path="/tasks"
              element={
                <motion.div
                  key="tasks"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  className="h-full"
                >
                  <ProtectedRoute>
                    <Tasks />
                  </ProtectedRoute>
                </motion.div>
              }
            />

            <Route
              path="/profile"
              element={
                <motion.div
                  key="profile"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  className="h-full"
                >
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                </motion.div>
              }
            />

            {/* 404 Route */}
            <Route
              path="*"
              element={
                <motion.div
                  key="not-found"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  className="h-full flex items-center justify-center"
                >
                  <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">404</h1>
                    <p className="text-xl">Page not found</p>
                  </div>
                </motion.div>
              }
            />
          </Routes>
        </AnimatePresence>
      </Suspense>
      <Toast />
    </div>
  );
};

export default App;