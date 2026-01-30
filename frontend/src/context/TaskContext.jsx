import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import api from '../utils/axios';

const TaskContext = createContext();

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  // Load tasks and stats when authentication is complete
  useEffect(() => {
    if (!isAuthLoading) {
      if (isAuthenticated) {
        Promise.all([
          fetchTasks(),
          fetchDashboardStats()
        ]).catch(console.error);
      } else {
        // Reset states when not authenticated
        setTasks([]);
        setStats({});
        setLoading(false);
        setLoadingStats(false);
      }
    }
  }, [isAuthenticated, isAuthLoading]);

  const fetchTasks = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/tasks');
      const tasksData = response.data.data || [];
      setTasks(Array.isArray(tasksData) ? tasksData : []);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setError(err.response?.data?.message || 'Failed to load tasks');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    try {
      setLoading(true);
      const response = await api.post('/tasks', taskData);
      const newTask = response.data.data;
      // Ensure newTask is a valid task object
      if (newTask && typeof newTask === 'object') {
        setTasks(prev => [...prev, newTask]);
        await fetchDashboardStats(); // Refresh stats immediately after task operation
        return newTask;
      } else {
        throw new Error('Invalid task data received');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (taskId, taskData) => {
    try {
      setLoading(true);
      const response = await api.put(`/tasks/${taskId}`, taskData);
      const updatedTask = response.data.data;
      // Ensure updatedTask is a valid task object
      if (updatedTask && typeof updatedTask === 'object') {
        setTasks(prev => prev.map(task => task._id === taskId ? updatedTask : task));
        await fetchDashboardStats(); // Refresh stats immediately after task operation
        return updatedTask;
      } else {
        throw new Error('Invalid task data received');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      setLoading(true);
      await api.delete(`/tasks/${taskId}`);
      setTasks(prev => prev.filter(task => task._id !== taskId));
      await fetchDashboardStats(); // Refresh stats immediately after task operation
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskCompletion = async (taskId) => {
    try {
      const task = tasks.find(t => t._id === taskId);
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      const response = await api.put(`/tasks/${taskId}`, {
        status: newStatus
      });
      const updatedTask = response.data.data;
      setTasks(prev => prev.map(t => t._id === taskId ? updatedTask : t));
      await fetchDashboardStats(); // Refresh stats immediately after task operation
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const fetchDashboardStats = async () => {
    try {
      setLoadingStats(true);
      setError(null);
      const response = await api.get('/tasks/dashboard');
      setStats(response.data.data || {});
      return response.data;
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard stats');
      setStats({});
      throw err;
    } finally {
      setLoadingStats(false);
    }
  };



  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    tasks,
    stats,
    loading: isAuthLoading || loading,
    loadingStats: isAuthLoading || loadingStats,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    fetchDashboardStats,
  }), [tasks, stats, loading, loadingStats, error, isAuthLoading]);

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
};