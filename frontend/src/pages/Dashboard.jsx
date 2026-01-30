import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import TaskStats from '../components/tasks/TaskStats';
import TaskList from '../components/tasks/TaskList';
import TaskModal from '../components/tasks/TaskModal';
import { Plus } from 'lucide-react';
import { showToast } from '../components/common/Toast';
import { getAnimationProps } from '../utils/animationUtils';
import { useTask } from '../context/TaskContext';

const Dashboard = () => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const { deleteTask } = useTask();

  const handleAddTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleDeleteTask = async (task) => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      try {
        await deleteTask(task._id);
        showToast.success('Task deleted successfully!');
      } catch (error) {
        showToast.error('Failed to delete task');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-primary">
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
          <h1 className="text-3xl font-bold text-text-primary mb-2">Dashboard</h1>
          <p className="text-text-secondary">Welcome back! Here's what you need to focus on today.</p>
        </motion.div>

        <TaskStats />

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-text-primary">Your Tasks</h2>
        </div>

        <TaskList
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
        />
      </main>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        task={editingTask}
      />
    </div>
  );
};

export default Dashboard;