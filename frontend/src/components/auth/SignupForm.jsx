import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { showToast } from '../common/Toast';
import Input from '../common/Input';
import Button from '../common/Button';
import { getAnimationProps } from '../../utils/animationUtils';

const SignupForm = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, setError, watch } = useForm({
    mode: 'onChange'
  });

  const password = watch('password');

  const validatePasswordStrength = (value) => {
    if (value.length < 6) return 'Password must be at least 6 characters';
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
      return 'Password must contain uppercase, lowercase, and number';
    }
    return null;
  };

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }

    setLoading(true);
    try {
      const result = await registerUser(data.name, data.email, data.password);
      if (result.success) {
        showToast.success('Account created successfully!');
        navigate('/dashboard');
      } else {
        setError('root', { message: result.error });
        showToast.error(result.error);
      }
    } catch (error) {
      setError('root', { message: 'An unexpected error occurred' });
      showToast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { label: '', score: 0, color: '' };

    let score = 0;
    if (pwd.length >= 6) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    const strengths = [
      { label: 'Weak', score: 0, color: 'bg-red-500' },
      { label: 'Weak', score: 1, color: 'bg-red-500' },
      { label: 'Fair', score: 2, color: 'bg-orange-500' },
      { label: 'Good', score: 3, color: 'bg-yellow-500' },
      { label: 'Strong', score: 4, color: 'bg-green-500' },
      { label: 'Strong', score: 5, color: 'bg-green-500' }
    ];

    return strengths[score];
  };

  const passwordStrength = getPasswordStrength(password);

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
            Join TaskFlow
          </motion.h1>
          <motion.p
            {...getAnimationProps({
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.6, delay: 0.2 }
            })}
            className="text-xl opacity-90 mb-8"
          >
            Start organizing your tasks with our elegant platform
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
            <p className="text-sm opacity-75">Organize, prioritize, and accomplish</p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
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
            <h2 className="text-3xl font-bold text-text-primary mb-2">Create an account</h2>
            <p className="text-text-secondary">Join us today to manage your tasks efficiently</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              icon={User}
              {...register('name', {
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters'
                }
              })}
              error={errors.name?.message}
            />

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
                placeholder="Create a password"
                icon={Lock}
                {...register('password', {
                  required: 'Password is required',
                  validate: validatePasswordStrength
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

            {/* Password Strength Indicator */}
            {password && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Password strength</span>
                  <span className={passwordStrength.color.replace('bg-', 'text-')}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="w-full bg-dark-card rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${passwordStrength.color} transition-all duration-300`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="relative">
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                icon={Lock}
                {...register('confirmPassword', {
                  required: 'Please confirm your password'
                })}
                error={errors.confirmPassword?.message}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-text-secondary hover:text-text-primary transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <label className="flex items-start">
              <input
                type="checkbox"
                className="mt-1 rounded border-dark-card bg-dark-secondary text-accent-purple focus:ring-accent-purple"
                {...register('terms', {
                  required: 'You must accept the terms and conditions'
                })}
              />
              <span className="ml-2 text-sm text-text-secondary">
                I agree to the <Link to="#" className="text-accent-purple hover:underline">Terms of Service</Link> and <Link to="#" className="text-accent-purple hover:underline">Privacy Policy</Link>
              </span>
            </label>
            {errors.terms && (
              <p className="text-red-500 text-sm mt-1">{errors.terms.message}</p>
            )}

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

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
            >
              Create Account
            </Button>
          </form>

          <p className="mt-8 text-center text-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-accent-purple hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupForm;