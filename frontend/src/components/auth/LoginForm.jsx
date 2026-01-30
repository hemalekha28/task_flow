import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { showToast } from '../common/Toast';
import Input from '../common/Input';
import Button from '../common/Button';
import { getAnimationProps } from '../../utils/animationUtils';

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, setError } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await login(data.email, data.password);
      if (result.success) {
        showToast.success('Login successful!');
        // Add a small delay to ensure the auth state is updated
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 100);
      } else {
        setError('root', { message: result.error });
        showToast.error(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
      setError('root', { message: errorMessage });
      showToast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding/Visuals */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-primary items-center justify-center p-12">
        <div className="text-center text-white">
          <motion.h1
            {...getAnimationProps({
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.6 }
            })}
            className="text-4xl font-bold mb-4"
          >
            Welcome Back
          </motion.h1>
          <motion.p
            {...getAnimationProps({
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.6, delay: 0.2 }
            })}
            className="text-xl opacity-90 mb-8"
          >
            Manage your tasks with elegance and efficiency
          </motion.p>
          <motion.div
            {...getAnimationProps({
              initial: { opacity: 0, scale: 0.8 },
              animate: { opacity: 1, scale: 1 },
              transition: { duration: 0.6, delay: 0.4 }
            })}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
          >
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-white/20 rounded-lg p-3"></div>
              <div className="bg-white/20 rounded-lg p-3"></div>
              <div className="bg-white/20 rounded-lg p-3"></div>
              <div className="bg-white/20 rounded-lg p-3"></div>
              <div className="bg-white/20 rounded-lg p-3"></div>
              <div className="bg-white/20 rounded-lg p-3"></div>
            </div>
            <p className="text-sm opacity-75">Your tasks, beautifully organized</p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-12">
        <motion.div
          {...getAnimationProps({
            initial: { opacity: 0, x: 20 },
            animate: { opacity: 1, x: 0 },
            transition: { duration: 0.6 }
          })}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-text-primary mb-2">Sign in to your account</h2>
            <p className="text-text-secondary">Enter your credentials to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              icon={Mail}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              error={errors.email?.message}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                icon={Lock}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                error={errors.password?.message}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-text-secondary hover:text-text-primary transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {errors.root && (
              <motion.div
                {...getAnimationProps({
                  initial: { opacity: 0, y: -10 },
                  animate: { opacity: 1, y: 0 }
                })}
                className="text-red-500 text-sm text-center py-2 px-4 bg-red-500/10 rounded-lg border border-red-500/20"
              >
                {errors.root.message}
              </motion.div>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-dark-card bg-dark-secondary text-accent-purple focus:ring-accent-purple"
                />
                <span className="ml-2 text-sm text-text-secondary">Remember me</span>
              </label>
              <Link to="#" className="text-sm text-accent-purple hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
            >
              Sign In
            </Button>
          </form>

          <p className="mt-8 text-center text-text-secondary">
            Don't have an account?{' '}
            <Link to="/signup" className="text-accent-purple hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginForm;