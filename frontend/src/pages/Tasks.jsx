import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    SlidersHorizontal,
    Plus,
    Calendar,
    Clock,
    AlertCircle,
    CheckCircle2,
    Circle,
    Loader,
    ArrowUpDown,
    Grid3x3,
    List,
    LayoutGrid
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import TaskCard from '../components/tasks/TaskCard';
import TaskModal from '../components/tasks/TaskModal';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { useTask } from '../context/TaskContext';
import { showToast } from '../components/common/Toast';
import { getAnimationProps } from '../utils/animationUtils';

const Tasks = () => {
    const { tasks, loading, deleteTask } = useTask();
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedPriority, setSelectedPriority] = useState('all');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [viewMode, setViewMode] = useState('grid'); // grid or list
    const [showFilters, setShowFilters] = useState(false);

    // Filter and sort tasks
    const filteredAndSortedTasks = useMemo(() => {
        let filtered = tasks.filter((task) => {
            const matchesSearch =
                task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus;
            const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;

            return matchesSearch && matchesStatus && matchesPriority;
        });

        // Sort tasks
        filtered.sort((a, b) => {
            let comparison = 0;

            switch (sortBy) {
                case 'title':
                    comparison = a.title.localeCompare(b.title);
                    break;
                case 'priority':
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
                    break;
                case 'status':
                    comparison = a.status.localeCompare(b.status);
                    break;
                case 'dueDate':
                    const dateA = a.dueDate ? new Date(a.dueDate) : new Date(0);
                    const dateB = b.dueDate ? new Date(b.dueDate) : new Date(0);
                    comparison = dateA - dateB;
                    break;
                case 'createdAt':
                default:
                    comparison = new Date(b.createdAt) - new Date(a.createdAt);
                    break;
            }

            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return filtered;
    }, [tasks, searchQuery, selectedStatus, selectedPriority, sortBy, sortOrder]);

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

    const toggleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    // Task statistics
    const stats = useMemo(() => {
        return {
            total: tasks.length,
            pending: tasks.filter((t) => t.status === 'pending').length,
            inProgress: tasks.filter((t) => t.status === 'in_progress').length,
            completed: tasks.filter((t) => t.status === 'completed').length,
        };
    }, [tasks]);

    return (
        <div className="min-h-screen bg-dark-primary">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.div
                    {...getAnimationProps({
                        initial: { opacity: 0, y: 20 },
                        animate: { opacity: 1, y: 0 },
                        transition: { duration: 0.5 },
                    })}
                    className="mb-8"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-text-primary mb-2">All Tasks</h1>
                            <p className="text-text-secondary">
                                Manage and organize all your tasks in one place
                            </p>
                        </div>
                        <Button
                            variant="primary"
                            onClick={handleAddTask}
                            className="flex items-center gap-2 w-full sm:w-auto"
                        >
                            <Plus className="h-5 w-5" />
                            New Task
                        </Button>
                    </div>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                    {...getAnimationProps({
                        initial: { opacity: 0, y: 20 },
                        animate: { opacity: 1, y: 0 },
                        transition: { duration: 0.5, delay: 0.1 },
                    })}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                >
                    <div className="bg-dark-secondary/50 backdrop-blur-sm border border-dark-card rounded-xl p-4 hover:border-accent-purple/50 transition-colors">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-text-secondary mb-1">Total Tasks</p>
                                <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
                            </div>
                            <div className="p-3 bg-accent-purple/10 rounded-lg">
                                <LayoutGrid className="h-6 w-6 text-accent-purple" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-dark-secondary/50 backdrop-blur-sm border border-dark-card rounded-xl p-4 hover:border-yellow-500/50 transition-colors">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-text-secondary mb-1">Pending</p>
                                <p className="text-2xl font-bold text-text-primary">{stats.pending}</p>
                            </div>
                            <div className="p-3 bg-yellow-500/10 rounded-lg">
                                <Clock className="h-6 w-6 text-yellow-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-dark-secondary/50 backdrop-blur-sm border border-dark-card rounded-xl p-4 hover:border-blue-500/50 transition-colors">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-text-secondary mb-1">In Progress</p>
                                <p className="text-2xl font-bold text-text-primary">{stats.inProgress}</p>
                            </div>
                            <div className="p-3 bg-blue-500/10 rounded-lg">
                                <Loader className="h-6 w-6 text-blue-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-dark-secondary/50 backdrop-blur-sm border border-dark-card rounded-xl p-4 hover:border-green-500/50 transition-colors">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-text-secondary mb-1">Completed</p>
                                <p className="text-2xl font-bold text-text-primary">{stats.completed}</p>
                            </div>
                            <div className="p-3 bg-green-500/10 rounded-lg">
                                <CheckCircle2 className="h-6 w-6 text-green-500" />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Search and Filters */}
                <motion.div
                    {...getAnimationProps({
                        initial: { opacity: 0, y: 20 },
                        animate: { opacity: 1, y: 0 },
                        transition: { duration: 0.5, delay: 0.2 },
                    })}
                    className="bg-dark-secondary/50 backdrop-blur-sm border border-dark-card rounded-xl p-6 mb-6"
                >
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-secondary" />
                                <input
                                    type="text"
                                    placeholder="Search tasks by title or description..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-dark-card border border-dark-card rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-purple focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        {/* Filter Toggle */}
                        <Button
                            variant="secondary"
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2"
                        >
                            <SlidersHorizontal className="h-5 w-5" />
                            Filters
                            {(selectedStatus !== 'all' || selectedPriority !== 'all') && (
                                <Badge variant="primary" size="sm">
                                    Active
                                </Badge>
                            )}
                        </Button>

                        {/* View Mode Toggle */}
                        <div className="flex gap-2">
                            <Button
                                variant={viewMode === 'grid' ? 'primary' : 'secondary'}
                                onClick={() => setViewMode('grid')}
                                className="p-3"
                            >
                                <Grid3x3 className="h-5 w-5" />
                            </Button>
                            <Button
                                variant={viewMode === 'list' ? 'primary' : 'secondary'}
                                onClick={() => setViewMode('list')}
                                className="p-3"
                            >
                                <List className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Expanded Filters */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-dark-card">
                                    {/* Status Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">
                                            Status
                                        </label>
                                        <select
                                            value={selectedStatus}
                                            onChange={(e) => setSelectedStatus(e.target.value)}
                                            className="w-full px-4 py-2.5 bg-dark-card border border-dark-card rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-purple focus:border-transparent transition-all"
                                        >
                                            <option value="all">All Status</option>
                                            <option value="pending">Pending</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                    </div>

                                    {/* Priority Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">
                                            Priority
                                        </label>
                                        <select
                                            value={selectedPriority}
                                            onChange={(e) => setSelectedPriority(e.target.value)}
                                            className="w-full px-4 py-2.5 bg-dark-card border border-dark-card rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-purple focus:border-transparent transition-all"
                                        >
                                            <option value="all">All Priorities</option>
                                            <option value="high">High Priority</option>
                                            <option value="medium">Medium Priority</option>
                                            <option value="low">Low Priority</option>
                                        </select>
                                    </div>

                                    {/* Sort By */}
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">
                                            Sort By
                                        </label>
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="w-full px-4 py-2.5 bg-dark-card border border-dark-card rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-purple focus:border-transparent transition-all"
                                        >
                                            <option value="createdAt">Date Created</option>
                                            <option value="dueDate">Due Date</option>
                                            <option value="title">Title</option>
                                            <option value="priority">Priority</option>
                                            <option value="status">Status</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Clear Filters */}
                                {(selectedStatus !== 'all' || selectedPriority !== 'all' || sortBy !== 'createdAt') && (
                                    <div className="mt-4 flex justify-end">
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setSelectedStatus('all');
                                                setSelectedPriority('all');
                                                setSortBy('createdAt');
                                                setSortOrder('desc');
                                            }}
                                            className="text-sm"
                                        >
                                            Clear All Filters
                                        </Button>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Results Summary */}
                <motion.div
                    {...getAnimationProps({
                        initial: { opacity: 0 },
                        animate: { opacity: 1 },
                        transition: { duration: 0.3, delay: 0.3 },
                    })}
                    className="flex items-center justify-between mb-6"
                >
                    <p className="text-text-secondary">
                        Showing <span className="font-semibold text-text-primary">{filteredAndSortedTasks.length}</span> of{' '}
                        <span className="font-semibold text-text-primary">{tasks.length}</span> tasks
                    </p>
                    <button
                        onClick={() => toggleSort(sortBy)}
                        className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
                    >
                        <ArrowUpDown className="h-4 w-4" />
                        {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                    </button>
                </motion.div>

                {/* Tasks Grid/List */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-purple"></div>
                    </div>
                ) : filteredAndSortedTasks.length === 0 ? (
                    <motion.div
                        {...getAnimationProps({
                            initial: { opacity: 0, scale: 0.95 },
                            animate: { opacity: 1, scale: 1 },
                            transition: { duration: 0.5 },
                        })}
                        className="text-center py-20"
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-dark-secondary mb-4">
                            <AlertCircle className="h-8 w-8 text-text-secondary" />
                        </div>
                        <h3 className="text-xl font-semibold text-text-primary mb-2">No tasks found</h3>
                        <p className="text-text-secondary mb-6">
                            {searchQuery || selectedStatus !== 'all' || selectedPriority !== 'all'
                                ? 'Try adjusting your filters or search query'
                                : 'Get started by creating your first task'}
                        </p>
                        <Button variant="primary" onClick={handleAddTask} className="inline-flex items-center gap-2">
                            <Plus className="h-5 w-5" />
                            Create Your First Task
                        </Button>
                    </motion.div>
                ) : (
                    <div
                        className={
                            viewMode === 'grid'
                                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                                : 'space-y-4'
                        }
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredAndSortedTasks.map((task, index) => (
                                <motion.div
                                    key={task._id}
                                    {...getAnimationProps({
                                        initial: { opacity: 0, y: 20 },
                                        animate: { opacity: 1, y: 0 },
                                        exit: { opacity: 0, scale: 0.95 },
                                        transition: { duration: 0.3, delay: index * 0.05 },
                                    })}
                                    layout
                                >
                                    <TaskCard task={task} onEdit={handleEditTask} onDelete={handleDeleteTask} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </main>

            {/* Task Modal */}
            <TaskModal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                task={editingTask}
            />
        </div>
    );
};

export default Tasks;
