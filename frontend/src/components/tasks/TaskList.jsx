import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Grid3X3, List, Plus } from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import TaskCard from './TaskCard';
import Input from '../common/Input';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { getAnimationProps, shouldReduceMotion } from '../../utils/animationUtils';

const TaskList = ({ onAddTask, onEditTask, onDeleteTask }) => {
  const { tasks, loading } = useTask();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [viewMode, setViewMode] = useState('list'); // list or grid

  // Filter and search tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchTerm, filterStatus, filterPriority]);

  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-purple"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary h-4 w-4" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-dark-secondary text-text-primary border border-dark-card rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-purple"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 bg-dark-secondary text-text-primary border border-dark-card rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-purple"
          >
            {priorityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 w-full lg:w-auto">
          <Button
            variant={viewMode === 'list' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant="primary"
            onClick={onAddTask}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>

      {/* Stats Badges */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="default" size="lg">
          Total: {Array.isArray(tasks) ? tasks.length : 0}
        </Badge>
        <Badge variant="pending" size="lg">
          Pending: {Array.isArray(tasks) ? tasks.filter(t => t.status === 'pending').length : 0}
        </Badge>
        <Badge variant="progress" size="lg">
          In Progress: {Array.isArray(tasks) ? tasks.filter(t => t.status === 'in_progress').length : 0}
        </Badge>
        <Badge variant="completed" size="lg">
          Completed: {Array.isArray(tasks) ? tasks.filter(t => t.status === 'completed').length : 0}
        </Badge>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <motion.div
            {...getAnimationProps({
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
            })}
            className="text-center py-12"
          >
            <div className="text-text-secondary mb-4">
              <List className="h-16 w-16 mx-auto opacity-50" />
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">No tasks found</h3>
            <p className="text-text-secondary mb-4">
              {searchTerm || filterStatus !== 'all' || filterPriority !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by creating your first task'}
            </p>
            <Button
              variant="primary"
              onClick={onAddTask}
            >
              Create Your First Task
            </Button>
          </motion.div>
        ) : shouldReduceMotion() ? (
          // Render without animations in development
          filteredTasks.map((task, index) => (
            <div key={`${task._id}-${index}`}>
              <TaskCard
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            </div>
          ))
        ) : (
          // Render with animations in production
          <AnimatePresence key={`task-list-${filteredTasks.length}`}>
            {filteredTasks.map((task, index) => (
              <motion.div
                key={`${task._id}-${index}`}
                {...getAnimationProps({ 
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                  exit: { opacity: 0, y: -20 },
                  transition: { delay: index * 0.05 }
                })}
              >
                <TaskCard
                  task={task}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default TaskList;