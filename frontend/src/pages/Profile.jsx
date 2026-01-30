import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Calendar, CheckCircle, Clock } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../components/common/Toast';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { getAnimationProps } from '../utils/animationUtils';

const Profile = () => {
  const { user, updateProfile, updatePassword } = useAuth();
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    reset: resetProfile,
    formState: { errors: profileErrors }
  } = useForm({
    defaultValues: {
      name: user?.name,
      email: user?.email
    }
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors }
  } = useForm();

  // Update default values when user data loads
  useEffect(() => {
    if (user) {
      resetProfile({
        name: user.name,
        email: user.email
      });
    }
  }, [user, resetProfile]);

  const onUpdateProfile = async (data) => {
    setProfileLoading(true);
    try {
      const result = await updateProfile(data.name, data.email);
      if (result.success) {
        showToast.success('Profile updated successfully!');
      } else {
        showToast.error(result.error);
      }
    } catch (error) {
      showToast.error('Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const onUpdatePassword = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      showToast.error('New passwords do not match');
      return;
    }

    setPasswordLoading(true);
    try {
      const result = await updatePassword(data.currentPassword, data.newPassword);
      if (result.success) {
        showToast.success('Password updated successfully!');
        resetPassword();
      } else {
        showToast.error(result.error);
      }
    } catch (error) {
      showToast.error('Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Mock statistics
  const stats = {
    tasksCreated: 42,
    tasksCompleted: 36,
    completionRate: 86
  };

  return (
    <div className="min-h-screen bg-dark-primary">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          {...getAnimationProps({
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.5 }
          })}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-text-primary mb-2">Profile Settings</h1>
          <p className="text-text-secondary">Manage your account and preferences</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info Card */}
          <div className="lg:col-span-1">
            <Card className="p-6 h-full flex flex-col">
              <div className="text-center">
                <div className="mx-auto mb-4">
                  <div className="h-24 w-24 rounded-full bg-gradient-primary flex items-center justify-center mx-auto">
                    <User className="h-12 w-12 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-text-primary">{user?.name}</h3>
                <p className="text-text-secondary">{user?.email}</p>
                <div className="flex items-center justify-center mt-2 text-sm text-text-secondary">
                  <Calendar className="h-4 w-4 mr-1" />
                  Member since {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                </div>
              </div>

              {/* Stats */}
              <div className="mt-6 space-y-3 flex-grow">
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Tasks Created</span>
                  <span className="font-medium text-text-primary">{stats.tasksCreated}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Tasks Completed</span>
                  <span className="font-medium text-text-primary">{stats.tasksCompleted}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Completion Rate</span>
                  <span className="font-medium text-status-completed">{stats.completionRate}%</span>
                </div>
              </div>

              <Button
                variant="danger"
                className="w-full mt-6"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                    showToast.success('Account deletion would happen here');
                  }
                }}
              >
                Delete Account
              </Button>
            </Card>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-6">Update Information</h3>

              <form onSubmit={handleSubmitProfile(onUpdateProfile)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    placeholder="Enter your full name"
                    {...registerProfile('name', { required: 'Name is required' })}
                    error={profileErrors.name?.message}
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email"
                    {...registerProfile('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    error={profileErrors.email?.message}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" variant="primary" loading={profileLoading}>
                    Update Profile
                  </Button>
                </div>
              </form>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-6">Change Password</h3>

              <form onSubmit={handleSubmitPassword(onUpdatePassword)} className="space-y-4">
                <Input
                  label="Current Password"
                  type="password"
                  placeholder="Enter current password"
                  icon={Lock}
                  {...registerPassword('currentPassword', { required: 'Current password is required' })}
                  error={passwordErrors.currentPassword?.message}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="New Password"
                    type="password"
                    placeholder="Enter new password"
                    icon={Lock}
                    {...registerPassword('newPassword', {
                      required: 'New password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' }
                    })}
                    error={passwordErrors.newPassword?.message}
                  />

                  <Input
                    label="Confirm New Password"
                    type="password"
                    placeholder="Confirm new password"
                    icon={Lock}
                    {...registerPassword('confirmPassword', { required: 'Please confirm your new password' })}
                    error={passwordErrors.confirmPassword?.message}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" variant="primary" loading={passwordLoading}>
                    Update Password
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;