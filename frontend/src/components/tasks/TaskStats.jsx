import React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Users,
  PieChart
} from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import Card from '../common/Card';
import { showToast } from '../common/Toast';
import { getAnimationProps } from '../../utils/animationUtils';

const StatCard = ({ title, value, icon: Icon, color, change, loading, loadingStats }) => {
  const iconColor = {
    purple: 'text-accent-purple',
    blue: 'text-accent-blue',
    green: 'text-status-completed',
    yellow: 'text-priority-medium',
    red: 'text-priority-high'
  };

  return (
    <motion.div
      {...getAnimationProps({
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
      })}
    >
      <Card hover className="bg-dark-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text-secondary">{title}</p>
            <div className="text-2xl font-bold text-text-primary mt-1">
              {(loading || loadingStats) ? (
                <div className="h-8 w-16 bg-dark-secondary rounded animate-pulse"></div>
              ) : (
                value
              )}
            </div>
            {change && (
              <p className={`text-xs mt-1 ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {change}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-full ${iconColor[color] || 'text-text-secondary'} bg-current/10`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const TaskStats = () => {
  const { stats, fetchDashboardStats, loading, loadingStats } = useTask();

  React.useEffect(() => {
    fetchDashboardStats();
  }, []);

  const statsData = stats || {
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    overdueTasks: 0
  };

  const statCards = [
    {
      title: 'Total Tasks',
      value: statsData.totalTasks,
      icon: Calendar,
      color: 'purple',
      change: '+5% from last week'
    },
    {
      title: 'Pending',
      value: statsData.pendingTasks,
      icon: Clock,
      color: 'yellow',
      change: '+2 from last week'
    },
    {
      title: 'In Progress',
      value: statsData.inProgressTasks,
      icon: TrendingUp,
      color: 'blue',
      change: '+3 from last week'
    },
    {
      title: 'Completed',
      value: statsData.completedTasks,
      icon: CheckCircle,
      color: 'green',
      change: '+8 from last week'
    },
    {
      title: 'Overdue',
      value: statsData.overdueTasks,
      icon: AlertTriangle,
      color: 'red',
      change: '-1 from last week'
    }
  ];

  return (
    <motion.div
      {...getAnimationProps({
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: 0.2 }
      })}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
    >
      {statCards.map((stat, index) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          change={stat.change}
          loading={loading}
          loadingStats={loadingStats}
        />
      ))}
    </motion.div>
  );
};

export default TaskStats;